/**
 * webmcp/tools.ts
 *
 * WebMCP Tool Definitions & Handlers for Casefile.
 *
 * Exposes 9 structured WebMCP tools operating on the shared gameService.
 * Each invocation records a rich event into the shared Zustand store.
 */

import { gameService } from '@/game/services/gameService';
import { useGameStore } from '@/game/state/store';
import type { AgentEventKind } from '@/game/types';

export interface WebMCPToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
  handler: (params: Record<string, any>) => Promise<any> | any;
}

// Compute dynamic agent hypothesis based strictly on discovered evidence
export function computeAgentHypothesis(): string {
  const store = useGameStore.getState();
  const caseData = store.activeCase;
  const discovered = store.discoveredEvidenceIds;
  const inspected = store.inspectedEvidenceIds;

  const totalEv = caseData.evidence.length;
  const ratio = totalEv > 0 ? inspected.size / totalEv : 0;

  // Check if any contradiction timeline event has been uncovered by discovered evidence
  const contradictionFound = caseData.timeline.some(
    (t) => t.isContradiction && t.evidenceIds.some((eid) => discovered.has(eid)),
  );

  if (ratio >= 0.6 || contradictionFound) {
    return `HIGH PROGRESS: Discovered key physical evidence and timeline discrepancies. Compare location access logs and physical receipts with suspect statements in your Deduction Workspace.`;
  }

  if (ratio >= 0.3 || discovered.size >= 3) {
    return `MODERATE PROGRESS: Evaluating ${discovered.size} discovered clues across case locations. Cross-referencing suspect statements against physical access records.`;
  }

  if (discovered.size > 0) {
    return `PRELIMINARY ANALYSIS: Evaluating ${discovered.size} discovered clues across locations and cross-referencing statements from all ${caseData.suspects.length} persons of interest.`;
  }

  return `INITIAL ANALYSIS: Exploring case locations and interviewing persons of interest to establish initial timeline and opportunity.`;
}

// Generate human-readable summary & classification for agent activity panel
function summarizeResult(tool: string, params: Record<string, any>, result: any): {
  summary: string;
  kind: AgentEventKind;
  status: 'success' | 'warning' | 'error';
} {
  if (tool === 'search_evidence') {
    const count = result.discovered?.length ?? 0;
    return {
      summary: `Searched evidence for "${params.query || 'all'}" — ${count} items discovered`,
      kind: count > 0 ? 'discovery' : 'tool_call',
      status: 'success',
    };
  }

  if (tool === 'inspect_evidence') {
    return {
      summary: `Inspected [${result.name}]: ${result.detailedDescription?.slice(0, 70)}...`,
      kind: 'discovery',
      status: 'success',
    };
  }

  if (tool === 'search_locations') {
    return {
      summary: `Examined location directory for "${params.query || 'all'}" — ${result.locations?.length ?? 0} locations evaluated`,
      kind: 'tool_call',
      status: 'success',
    };
  }

  if (tool === 'get_suspects') {
    const contradictions = result.suspects?.filter((s: any) => s.hasContradictionAlert)?.length ?? 0;
    return {
      summary: `Evaluated 5 suspects — ${contradictions} statement contradictions flagged`,
      kind: contradictions > 0 ? 'warning' : 'tool_call',
      status: contradictions > 0 ? 'warning' : 'success',
    };
  }

  if (tool === 'get_suspect_profile') {
    const isContradicted = result.hasStatementContradiction;
    return {
      summary: `Examined profile of ${result.name} — ${isContradicted ? '⚡ Statement Contradiction Found' : 'Alibi logged'}`,
      kind: isContradicted ? 'warning' : 'tool_call',
      status: isContradicted ? 'warning' : 'success',
    };
  }

  if (tool === 'interview_suspect') {
    return {
      summary: `Interviewed ${result.suspectName}: "${result.response?.slice(0, 60)}..."`,
      kind: 'tool_call',
      status: 'success',
    };
  }

  if (tool === 'build_timeline') {
    const contradictions = result.contradictionsFound?.length ?? 0;
    return {
      summary: `Reconstructed timeline (${result.reconstructedEventsCount}/${result.totalTimelineEvents} events) — ${contradictions} contradictions detected`,
      kind: contradictions > 0 ? 'warning' : 'tool_call',
      status: contradictions > 0 ? 'warning' : 'success',
    };
  }

  if (tool === 'submit_accusation') {
    const isCorrect = result.isCorrect;
    return {
      summary: `Submitted Accusation against ${result.accusation?.accusedSuspectName}: ${result.verdict}`,
      kind: isCorrect ? 'hypothesis' : 'warning',
      status: isCorrect ? 'success' : 'error',
    };
  }

  return {
    summary: `Executed ${tool}`,
    kind: 'tool_call',
    status: 'success',
  };
}

// Helper to wrap handlers with error handling & agent activity logging
function createToolHandler(
  name: string,
  fn: (params: Record<string, any>) => any,
): (params: Record<string, any>) => any {
  return (params: Record<string, any>) => {
    try {
      const result = fn(params);
      const { summary, kind, status } = summarizeResult(name, params, result);
      const hypothesis = computeAgentHypothesis();

      // Update agent hypothesis in Zustand store
      useGameStore.getState().setAgentHypothesis(hypothesis);

      // Log execution in shared Zustand state for live UI activity panel
      useGameStore.getState().logAgentAction({
        tool: name,
        parameters: Object.fromEntries(
          Object.entries(params || {}).map(([k, v]) => [k, String(v)]),
        ),
        result: typeof result === 'object' ? JSON.stringify(result).slice(0, 160) + '...' : String(result),
        summary,
        kind,
        status,
        hypothesis,
      });

      return {
        success: true,
        data: result,
      };
    } catch (err: any) {
      const errorMessage = err?.message || 'An error occurred executing WebMCP tool';

      useGameStore.getState().logAgentAction({
        tool: name,
        parameters: Object.fromEntries(
          Object.entries(params || {}).map(([k, v]) => [k, String(v)]),
        ),
        result: `ERROR: ${errorMessage}`,
        summary: `Error in ${name}: ${errorMessage}`,
        kind: 'warning',
        status: 'error',
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  };
}

// ─── 9 WebMCP Tools ───────────────────────────────────────────────────────────

export const WEBMCP_TOOLS: WebMCPToolDefinition[] = [
  // 1. get_case_state
  {
    name: 'get_case_state',
    description:
      'Retrieve high-level investigation summary including case title, victim details, current objective, count of discovered evidence, list of known suspects, and overall progress percentage. Use this tool at the beginning of an investigation or to refresh case context. Constraints: Does NOT leak killer identity or hidden solution.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
    handler: createToolHandler('get_case_state', () => gameService.getCaseState()),
  },

  // 2. search_evidence
  {
    name: 'search_evidence',
    description:
      'Search discovered and discoverable evidence using keywords (e.g., "whiskey", "cyanide", "keycard", "cctv", "letter") or empty string to list all. Returns structured list of discovered clues, discoverable items in visited locations, and count of inaccessible items in unvisited areas. Use when searching for physical or forensic proof connected to a suspect, location, or event.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search term or keyword (e.g., "whiskey", "letter", "cctv", "divorce"). Pass empty string to list all currently accessible evidence.',
        },
      },
      required: ['query'],
    },
    handler: createToolHandler('search_evidence', (params) => {
      const query = typeof params.query === 'string' ? params.query : '';
      return gameService.searchEvidence(query);
    }),
  },

  // 3. inspect_evidence
  {
    name: 'inspect_evidence',
    description:
      'Perform detailed forensic inspection on a specific evidence item by ID (e.g., "whiskey-glass", "cyanide-vial", "keycard-log", "cctv-gap"). Updates the shared investigation state and returns detailed forensic findings, batch origins, related suspect links, corroborating clues, and hidden significance. Use when analyzing a clue in depth.',
    inputSchema: {
      type: 'object',
      properties: {
        evidence_id: {
          type: 'string',
          description: 'Unique evidence ID string (e.g., "whiskey-glass", "cyanide-vial", "keycard-log", "pharmacy-order", "divorce-filing").',
        },
      },
      required: ['evidence_id'],
    },
    handler: createToolHandler('inspect_evidence', (params) => {
      if (!params.evidence_id || typeof params.evidence_id !== 'string') {
        throw new Error('Parameter "evidence_id" (string) is required.');
      }
      return gameService.inspectEvidence(params.evidence_id);
    }),
  },

  // 4. search_locations
  {
    name: 'search_locations',
    description:
      'List or search investigation locations (e.g., "Main Gallery", "Private Office", "Storage Room", "Courtyard", "Security Room"). Returns location visitation status, investigator notes for visited areas, and undiscovered clue counts. Use when deciding which physical area of the gallery to explore next.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Optional location keyword (e.g., "office", "gallery", "security"). Pass empty string to retrieve all 5 locations.',
        },
      },
      required: ['query'],
    },
    handler: createToolHandler('search_locations', (params) => {
      const query = typeof params.query === 'string' ? params.query : '';
      return gameService.searchLocations(query);
    }),
  },

  // 5. get_suspects
  {
    name: 'get_suspects',
    description:
      'Retrieve structured directory of all persons of interest for the active case. Includes occupations, relationships to victim, interview completion status, and statement contradiction alerts. Use when evaluating who had motive or opportunity.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
    handler: createToolHandler('get_suspects', () => gameService.getSuspects()),
  },

  // 6. get_suspect_profile
  {
    name: 'get_suspect_profile',
    description:
      'Get comprehensive dossier for a specific suspect by ID. Returns background, stated alibi, surface motive, initial statement, list of linked evidence, interview transcript history, and available/locked interrogation question IDs. Use before questioning a suspect or cross-referencing their alibi.',
    inputSchema: {
      type: 'object',
      properties: {
        suspect_id: {
          type: 'string',
          description: 'Unique suspect ID string.',
        },
      },
      required: ['suspect_id'],
    },
    handler: createToolHandler('get_suspect_profile', (params) => {
      if (!params.suspect_id || typeof params.suspect_id !== 'string') {
        throw new Error('Parameter "suspect_id" (string) is required.');
      }
      return gameService.getSuspectProfile(params.suspect_id);
    }),
  },

  // 7. interview_suspect
  {
    name: 'interview_suspect',
    description:
      'Interrogate a suspect by asking a specific question ID (e.g., "va-q1", "va-q4") or topic keyword (e.g., "keycard", "cyanide", "divorce", "cctv"). Returns deterministic, case-specific response and records the entry in the shared investigation log. Note: Certain advanced questions require discovering related evidence first.',
    inputSchema: {
      type: 'object',
      properties: {
        suspect_id: {
          type: 'string',
          description: 'Unique suspect ID (e.g., "victoria-adeyemi", "michael-grant", "sarah-okafor").',
        },
        question: {
          type: 'string',
          description: 'Question ID (e.g., "va-q1", "va-q4") or question topic keyword (e.g., "keycard", "divorce", "cyanide").',
        },
      },
      required: ['suspect_id', 'question'],
    },
    handler: createToolHandler('interview_suspect', (params) => {
      if (!params.suspect_id || typeof params.suspect_id !== 'string') {
        throw new Error('Parameter "suspect_id" (string) is required.');
      }
      if (!params.question || typeof params.question !== 'string') {
        throw new Error('Parameter "question" (string) is required.');
      }
      return gameService.interviewSuspect(params.suspect_id, params.question);
    }),
  },

  // 8. build_timeline
  {
    name: 'build_timeline',
    description:
      'Reconstruct the chronological timeline of events on the night of the murder based strictly on discovered evidence and interview responses. Identifies confirmed events, suspect movements, time of death, statement contradictions (e.g., alibi vs keycard log), and missing unverified time slots. Use when establishing window of opportunity.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
    handler: createToolHandler('build_timeline', () => gameService.buildTimeline()),
  },

  // 9. submit_accusation
  {
    name: 'submit_accusation',
    description:
      'Formally submit a complete theory accusation containing suspected perpetrator, method, motive, approximate time, detailed explanation, and supporting evidence IDs. Evaluates the theory using partial scoring (100 pts) against the case solution. If score is below 80, outputs targeted spoil-free feedback without leaking the solution so you can revise.',
    inputSchema: {
      type: 'object',
      properties: {
        suspect_id: {
          type: 'string',
          description: 'ID of the accused suspect (e.g. "victoria-adeyemi", "nadia-yusuf", "miriam-bello").',
        },
        method: {
          type: 'string',
          description: 'Proposed murder/theft method and execution mechanism.',
        },
        motive: {
          type: 'string',
          description: 'Proposed underlying financial, personal, or corporate motive.',
        },
        approximate_time: {
          type: 'string',
          description: 'Estimated opportunity window / timestamp of the crime.',
        },
        explanation: {
          type: 'string',
          description: 'Comprehensive deductive explanation linking facts together.',
        },
        supporting_evidence_ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of evidence IDs supporting this accusation.',
        },
      },
      required: ['suspect_id'],
    },
    handler: createToolHandler('submit_accusation', (params) => {
      if (!params.suspect_id || typeof params.suspect_id !== 'string') {
        throw new Error('Parameter "suspect_id" (string) is required.');
      }
      return gameService.submitAccusation(
        params.suspect_id,
        params.method || '',
        params.motive || '',
        params.approximate_time || '',
        params.explanation || params.reasoning || '',
        Array.isArray(params.supporting_evidence_ids) ? params.supporting_evidence_ids : [],
      );
    }),
  },
];

/** Lookup map by tool name */
export const WEBMCP_TOOL_MAP = new Map<string, WebMCPToolDefinition>(
  WEBMCP_TOOLS.map((t) => [t.name, t]),
);

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

// Compute dynamic agent hypothesis based on discovered evidence
function computeAgentHypothesis(): string {
  const store = useGameStore.getState();
  const caseData = store.activeCase;
  const discovered = store.discoveredEvidenceIds;
  const inspected = store.inspectedEvidenceIds;

  const hasCyanide = inspected.has('cyanide-vial') || inspected.has('pharmacy-order');
  const hasKeycard = inspected.has('keycard-log');
  const hasCctvGap = inspected.has('cctv-gap');
  const hasMarcusArg = discovered.has('cctv-argument');
  const hasJamesTransfers = discovered.has('bank-transfer');

  if (hasCyanide && hasKeycard && hasCctvGap) {
    return 'HIGH CONFIDENCE: Victoria Adeyemi is the prime suspect. Poison traced to her clinic (cyanide-vial), keycard places her in office at 10:19 PM, and CCTV gap was paid for via Michael Grant (£3,000 cash deposit).';
  }

  if (hasCyanide || hasKeycard) {
    return 'MODERATE CONFIDENCE: Investigating Victoria Adeyemi. Keycard log contradicts her alibi and chemical evidence points toward pharmaceutical supply access.';
  }

  if (hasJamesTransfers) {
    return 'PRELIMINARY HYPOTHESIS: James Bello has strong financial motive (£160k embezzlement), but his main gallery alibi is corroborated by multiple witnesses. Testing for alternative suspects.';
  }

  if (hasMarcusArg) {
    return 'PRELIMINARY HYPOTHESIS: Marcus Cole had a heated argument at 8:45 PM over painting forgery, but CCTV confirms he exited by cab at 9:28 PM before the murder window.';
  }

  return 'INITIAL HYPOTHESIS: Gathering evidence across gallery locations and questioning all 5 persons of interest to establish timeline and opportunity.';
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
    const isRedHerring = result.isRedHerring;
    return {
      summary: `Inspected [${result.name}]: ${result.detailedDescription?.slice(0, 70)}...`,
      kind: isRedHerring ? 'warning' : 'discovery',
      status: isRedHerring ? 'warning' : 'success',
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
      'Returns the current investigation state relevant to an AI agent, including discovered evidence, known suspects, interview count, timeline progress, and objective. Does NOT reveal the solution.',
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
      'Search physical & digital evidence by query string. Categorizes items into discovered, discoverable (in visited locations), and inaccessible.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search term or keyword (e.g., "whiskey", "letter", "cctv"). Pass empty string to list all.',
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
      'Examine a specific piece of evidence in detail. Updates the shared investigation state and returns forensic findings, related suspects, and hidden significance.',
    inputSchema: {
      type: 'object',
      properties: {
        evidence_id: {
          type: 'string',
          description: 'Unique evidence ID (e.g., "whiskey-glass", "cyanide-vial", "keycard-log").',
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
      'List or search investigation locations (crime scene, office, courtyard, etc.) and check visitation status and clue counts.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Optional location name or keyword search. Pass empty string to list all locations.',
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
      'Returns all 5 suspects connected to the victim along with their current interview status and statement contradiction alerts.',
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
      'Get full dossier for a suspect including background, stated alibi, surface motive, statement contradiction alerts, linked evidence, and available interview questions.',
    inputSchema: {
      type: 'object',
      properties: {
        suspect_id: {
          type: 'string',
          description: 'Unique suspect ID (e.g., "victoria-adeyemi", "marcus-cole", "james-bello").',
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
      'Interrogate a suspect by asking a question topic or question ID. Returns a deterministic response based on case state and records the Q&A in the shared investigation log.',
    inputSchema: {
      type: 'object',
      properties: {
        suspect_id: {
          type: 'string',
          description: 'Unique suspect ID (e.g., "victoria-adeyemi", "michael-grant").',
        },
        question: {
          type: 'string',
          description: 'Question ID (e.g., "va-q1") or question keyword/topic (e.g., "keycard", "divorce", "cyanide").',
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
      'Returns the reconstructed timeline of events on the night of the murder. Highlights confirmed events, statement contradictions, and missing time windows.',
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
      'Formally recommend an accusation against a suspect with supporting reasoning. Evaluates the accusation against the case solution, checks supporting evidence, and records the outcome.',
    inputSchema: {
      type: 'object',
      properties: {
        suspect_id: {
          type: 'string',
          description: 'ID of the suspect accused of the murder (e.g., "victoria-adeyemi").',
        },
        reasoning: {
          type: 'string',
          description: 'Detailed deduction and supporting evidence explaining why this suspect is the killer.',
        },
      },
      required: ['suspect_id', 'reasoning'],
    },
    handler: createToolHandler('submit_accusation', (params) => {
      if (!params.suspect_id || typeof params.suspect_id !== 'string') {
        throw new Error('Parameter "suspect_id" (string) is required.');
      }
      if (!params.reasoning || typeof params.reasoning !== 'string') {
        throw new Error('Parameter "reasoning" (string) is required.');
      }
      return gameService.submitAccusation(params.suspect_id, params.reasoning);
    }),
  },
];

/** Lookup map by tool name */
export const WEBMCP_TOOL_MAP = new Map<string, WebMCPToolDefinition>(
  WEBMCP_TOOLS.map((t) => [t.name, t]),
);

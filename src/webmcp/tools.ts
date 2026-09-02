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
  if (result && result.success === false) {
    return {
      summary: `Failed ${tool}: ${result.error}`,
      kind: 'warning',
      status: 'error',
    };
  }

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
      summary: `Inspected clue [${result.name || params.evidence_id}]: ${result.description?.slice(0, 50) || 'Forensic inspection completed'}...`,
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

  if (tool === 'get_case_state') {
    const contradictions = result.suspects?.filter((s: any) => s.hasContradictionAlert)?.length ?? 0;
    return {
      summary: `Case state retrieved (${result.suspects?.length ?? 5} suspects, ${contradictions} contradictions flagged)`,
      kind: contradictions > 0 ? 'warning' : 'tool_call',
      status: contradictions > 0 ? 'warning' : 'success',
    };
  }

  if (tool === 'get_suspects') {
    const contradictions = result.suspects?.filter((s: any) => s.hasContradictionAlert)?.length ?? 0;
    return {
      summary: `Evaluated ${result.suspects?.length ?? 5} suspects — ${contradictions} statement contradictions flagged`,
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
      summary: `Submitted Accusation against ${result.accusedSuspectName || params.suspect_id}: ${result.verdict}`,
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

// Synchronize structured WebMCP tool results directly to the Casefile state layer
function syncToolResultToState(toolName: string, params: Record<string, any>, result: any) {
  if (!result) return;
  const store = useGameStore.getState();

  if (toolName === 'get_case_state') {
    store.updateCaseState(result);
  } else if (toolName === 'get_suspect_profile') {
    if (result.success !== false) {
      store.setActiveSuspect(result);

      if (result.hasStatementContradiction || result.statementContradiction) {
        const suspectName = result.name || 'Victoria Adeyemi';
        store.addContradiction({
          id: `contradiction-${result.id || 'victoria-adeyemi'}`,
          title: `Keycard vs Stated Arrival (${suspectName})`,
          eventTime: '10:19 PM',
          eventDescription: `${suspectName}'s keycard accessed Daniel's private office.`,
          contradictedSuspect: suspectName,
          suspectClaim: `${suspectName} claims she arrived at 10:45 PM.`,
          evidenceSource: 'Electronic Keycard Access Audit Log (#04)',
          observation: `${suspectName}'s keycard accessed the private office before her stated arrival.`,
        });

        store.addInvestigativeLead({
          title: `${suspectName}'s Keycard Access Discrepancy`,
          description: `${suspectName}'s keycard accessed the private office at 10:19 PM, before her stated arrival time of 10:45 PM.`,
          sourceTool: 'get_suspect_profile',
          status: 'active',
        });
      }
    }
  } else if (toolName === 'search_evidence') {
    const caseData = store.activeCase;
    const rawItems = [...(result.discovered || []), ...(result.discoverableNow || [])];
    const itemsToUpdate: import('@/game/types').DiscoveredEvidenceItem[] = [];

    rawItems.forEach((raw: any) => {
      const fullEv = caseData.evidence.find((e) => e.id === raw.id);
      if (fullEv) {
        store.discoverEvidence(fullEv.id);

        const loc = caseData.locations.find((l) => l.id === fullEv.location);
        const relatedSuspects = fullEv.relatedSuspectIds.map(
          (sid) => caseData.suspects.find((s) => s.id === sid)?.name ?? sid,
        );
        const hasContradiction = caseData.timeline.some(
          (t) => t.isContradiction && t.evidenceIds.includes(fullEv.id),
        );

        itemsToUpdate.push({
          id: fullEv.id,
          name: fullEv.name,
          description: fullEv.description,
          isInspected: store.inspectedEvidenceIds.has(fullEv.id),
          tags: fullEv.tags,
          location: loc?.name ?? fullEv.location,
          relatedSuspects,
          hasContradiction,
        });
      } else {
        itemsToUpdate.push(raw);
      }
    });

    if (itemsToUpdate.length > 0) {
      store.updateDiscoveredEvidence(itemsToUpdate);
    }
  } else if (toolName === 'inspect_evidence') {
    if (result.success !== false) {
      const caseData = store.activeCase;
      const evId = result.id || params.evidence_id;
      const timelineEvent = caseData.timeline.find((t) => t.evidenceIds.includes(evId));
      const contradictionEvent = caseData.timeline.find((t) => t.isContradiction && t.evidenceIds.includes(evId));

      let contradictionNotice = null;
      if (contradictionEvent) {
        const suspectId = contradictionEvent.contradictsSuspectId || contradictionEvent.suspectIds[0];
        const suspect = caseData.suspects.find((s) => s.id === suspectId);
        contradictionNotice = {
          suspectName: suspect?.name ?? suspectId ?? 'Suspect',
          time: contradictionEvent.time,
          statement: suspect?.alibi || suspect?.initialStatement || 'Stated alternative timeline.',
          observation: `Evidence proves activity at ${contradictionEvent.time}, directly contradicting ${suspect?.name || 'suspect'}'s stated timeline.`,
        };

        store.addContradiction({
          id: `contradiction-${evId}`,
          title: `Evidence Discrepancy (${contradictionNotice.suspectName})`,
          eventTime: timelineEvent?.time || '10:19 PM',
          eventDescription: `${contradictionNotice.suspectName}'s activity: ${result.name || 'Keycard log'} proves access at ${timelineEvent?.time || '10:19 PM'}.`,
          contradictedSuspect: contradictionNotice.suspectName,
          suspectClaim: contradictionNotice.statement || 'Victoria claims she arrived at 10:45 PM.',
          evidenceSource: result.name || 'Electronic Keycard Access Audit Log',
          observation: contradictionNotice.observation,
        });

        store.addInvestigativeLead({
          title: `${contradictionNotice.suspectName}'s Keycard Access (${timelineEvent?.time || '10:19 PM'})`,
          description: `${contradictionNotice.suspectName}'s keycard accessed the private office before her stated arrival.`,
          sourceTool: 'inspect_evidence',
          status: 'active',
        });
      }

      const loc = caseData.locations.find((l) => l.id === result.location);

      const enrichedResult = {
        ...result,
        location: loc?.name ?? result.location,
        relevantTimestamp: timelineEvent?.time ?? null,
        whatItProves: result.detailedDescription || result.description,
        contradictionNotice,
      };

      store.setSelectedEvidence(enrichedResult);
    }
  } else if (toolName === 'build_timeline') {
    if (Array.isArray(result.reconstructedEvents)) {
      const caseData = store.activeCase;
      const enrichedEvents = result.reconstructedEvents.map((ev: any) => {
        const fullEvent = caseData.timeline.find((t) => t.id === ev.id);
        const relatedEv = fullEvent ? caseData.evidence.filter((e) => fullEvent.evidenceIds.includes(e.id)) : [];
        const loc = relatedEv[0]
          ? caseData.locations.find((l) => l.id === relatedEv[0].location)?.name
          : null;

        return {
          ...ev,
          location: loc || (ev.description.toLowerCase().includes('office') ? 'Private Office' : ev.description.toLowerCase().includes('forecourt') ? 'Forecourt' : 'Main Gallery'),
          source: ev.source || (relatedEv[0]?.name ? `Evidence: ${relatedEv[0].name}` : 'Investigation Record'),
        };
      });

      if (Array.isArray(result.contradictionsFound)) {
        result.contradictionsFound.forEach((c: any) => {
          store.addContradiction({
            id: `contradiction-${c.contradictedSuspect}-${c.eventTime}`,
            title: `Timeline Contradiction: ${c.contradictedSuspect}`,
            eventTime: c.eventTime,
            eventDescription: c.eventDescription,
            contradictedSuspect: c.contradictedSuspect,
            suspectClaim: c.suspectClaim,
            evidenceSource: 'Timeline Reconstruction',
            observation: `Established evidence proves activity at ${c.eventTime}, conflicting with ${c.contradictedSuspect}'s stated timeline.`,
          });

          store.addInvestigativeLead({
            title: `Investigate ${c.contradictedSuspect}'s Timeline Discrepancy`,
            description: `${c.contradictedSuspect} claims "${c.suspectClaim}", but evidence proves activity at ${c.eventTime}.`,
            sourceTool: 'build_timeline',
            status: 'active',
          });
        });
      }

      store.updateTimelineState(enrichedEvents, result.contradictionsFound || []);
    }
  } else if (toolName === 'interview_suspect') {
    if (result.success && result.response) {
      const activeSuspect = store.activeSuspect;
      if (activeSuspect && activeSuspect.id === params.suspect_id) {
        const updatedProfile = gameService.getSuspectProfile(params.suspect_id);
        if (updatedProfile.success !== false) {
          store.setActiveSuspect(updatedProfile as any);
        }
      }
      store.addInvestigativeLead({
        title: `Interview: ${result.suspectName || params.suspect_id}`,
        description: `Asked "${result.questionAsked || params.question}": ${result.response.slice(0, 100)}...`,
        sourceTool: 'interview_suspect',
        status: 'active',
      });
    }
  } else if (toolName === 'submit_accusation') {
    store.addInvestigativeLead({
      title: `Accusation: ${result.accusedSuspectName || params.suspect_id}`,
      description: result.verdict ? `${result.verdict} — ${result.message}` : (result.error || 'Accusation evaluated'),
      sourceTool: 'submit_accusation',
      status: result.isCorrect ? 'resolved' : 'active',
    });
  }
}

function getRunningSummary(tool: string, params: Record<string, any>): string {
  if (tool === 'get_case_state') return '→ Retrieving case state...';
  if (tool === 'get_suspect_profile') {
    const name = params.suspect_id === 'victoria-adeyemi' ? 'Victoria Adeyemi' : (params.suspect_id || 'suspect');
    return `→ Loading ${name} profile...`;
  }
  if (tool === 'search_evidence') return `→ Searching evidence for "${params.query || 'clues'}"...`;
  if (tool === 'inspect_evidence') return `→ Inspecting clue "${params.evidence_id || 'evidence'}"...`;
  if (tool === 'build_timeline') return '→ Reconstructing timeline...';
  if (tool === 'interview_suspect') return `→ Interviewing ${params.suspect_id || 'suspect'}...`;
  if (tool === 'submit_accusation') return '→ Evaluating formal accusation...';
  return `→ Executing ${tool}...`;
}

// Helper to wrap handlers with error handling & agent activity logging
function createToolHandler(
  name: string,
  fn: (params: Record<string, any>) => any,
): (params: Record<string, any>) => any {
  return (params: Record<string, any>) => {
    const actionId = crypto.randomUUID();
    const runningSummary = getRunningSummary(name, params);

    // Log RUNNING state
    useGameStore.getState().logAgentAction({
      id: actionId,
      tool: name,
      parameters: Object.fromEntries(
        Object.entries(params || {}).map(([k, v]) => [k, String(v)]),
      ),
      result: 'Processing...',
      summary: runningSummary,
      kind: 'tool_call',
      status: 'running',
    });

    try {
      const result = fn(params);
      const { summary, kind, status } = summarizeResult(name, params, result);
      const hypothesis = computeAgentHypothesis();

      // Synchronize structured result directly into Casefile state layer
      syncToolResultToState(name, params, result);

      // Update agent hypothesis in Zustand store
      useGameStore.getState().setAgentHypothesis(hypothesis);

      // Log SUCCESS state
      useGameStore.getState().logAgentAction({
        id: actionId,
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

      if (result && typeof result === 'object' && 'success' in result) {
        return result;
      }

      return {
        success: true,
        data: result,
      };
    } catch (err: any) {
      const errorMessage = err?.message || 'An error occurred executing WebMCP tool';

      useGameStore.getState().logAgentAction({
        id: actionId,
        tool: name,
        parameters: Object.fromEntries(
          Object.entries(params || {}).map(([k, v]) => [k, String(v)]),
        ),
        result: `ERROR: ${errorMessage}`,
        summary: `✗ ${name} execution failed: ${errorMessage}`,
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
      'Retrieve high-level investigation summary including case title, victim details, current objective, count of discovered evidence, list of known suspects, and overall progress metrics. Use this tool at the beginning of an investigation or to refresh case context. Constraints: Does NOT leak killer identity or hidden solution.',
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
      'Perform detailed forensic inspection on a SPECIFIC DISCOVERED evidence item by ID (e.g., "whiskey-glass", "cyanide-vial", "keycard-log", "cctv-gap"). Constraints: ONLY works for evidence that the investigator has already discovered. Returns error "Evidence not available. This item has not been discovered." if called on undiscovered evidence.',
    inputSchema: {
      type: 'object',
      properties: {
        evidence_id: {
          type: 'string',
          description: 'Unique evidence ID string of a DISCOVERED item.',
        },
      },
      required: ['evidence_id'],
    },
    handler: createToolHandler('inspect_evidence', (params) => {
      if (!params.evidence_id || typeof params.evidence_id !== 'string') {
        return {
          success: false,
          error: 'Parameter "evidence_id" (string) is required.',
        };
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
      'Retrieve structured directory of all 5 persons of interest (Marcus Cole, Sarah Okafor, James Bello, Victoria Adeyemi, Michael Grant). Includes occupations, relationships to victim, interview completion status, and statement contradiction alerts. Use when evaluating who had motive or opportunity.',
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
      'Get comprehensive dossier for a specific suspect by ID (e.g., "victoria-adeyemi", "marcus-cole"). Returns background, stated alibi, surface motive, initial statement, list of linked evidence, interview transcript history, and available/locked interrogation question IDs. Use before questioning a suspect or cross-referencing their alibi.',
    inputSchema: {
      type: 'object',
      properties: {
        suspect_id: {
          type: 'string',
          description: 'Unique suspect ID (e.g., "victoria-adeyemi", "marcus-cole", "james-bello", "sarah-okafor", "michael-grant").',
        },
      },
      required: ['suspect_id'],
    },
    handler: createToolHandler('get_suspect_profile', (params) => {
      if (!params.suspect_id || typeof params.suspect_id !== 'string') {
        return {
          success: false,
          error: 'Parameter "suspect_id" (string) is required.',
        };
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
        return {
          success: false,
          error: 'Parameter "suspect_id" (string) is required.',
        };
      }
      if (!params.question || typeof params.question !== 'string') {
        return {
          success: false,
          error: 'Parameter "question" (string) is required.',
        };
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
      'Formally submit an investigative recommendation or accusation against a suspect with supporting reasoning. Constraints: Requires establishing case deduction requirements first (e.g. poison source, keycard verification, motive, alibi contradiction). Returns error if deductions are incomplete.',
    inputSchema: {
      type: 'object',
      properties: {
        suspect_id: {
          type: 'string',
          description: 'ID of the suspect accused of the murder (e.g., "victoria-adeyemi").',
        },
        reasoning: {
          type: 'string',
          description: 'Detailed deduction explaining motive, method, opportunity, and supporting evidence.',
        },
      },
      required: ['suspect_id', 'reasoning'],
    },
    handler: createToolHandler('submit_accusation', (params) => {
      if (!params.suspect_id || typeof params.suspect_id !== 'string') {
        return {
          success: false,
          error: 'Parameter "suspect_id" (string) is required.',
        };
      }
      return gameService.submitAccusation(params.suspect_id, params.reasoning || '');
    }),
  },
];

/** Lookup map by tool name */
export const WEBMCP_TOOL_MAP = new Map<string, WebMCPToolDefinition>(
  WEBMCP_TOOLS.map((t) => [t.name, t]),
);

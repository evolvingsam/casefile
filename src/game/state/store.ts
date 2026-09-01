import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  AppPhase,
  Case,
  WorkspaceView,
  AgentAction,
  CaseNote,
  InterviewEntry,
  BoardConnection,
  ConnectionNodeType,
  InvestigationEvent,
  InvestigationEventType,
  ActorType,
  AccusationSubmission,
  AccusationEvaluation,
  PlayerHypothesis,
  PlayerContradictionFlag,
} from '@/game/types';
import { THE_GALLERY_MURDER } from '@/game/data/galleryMurder';
import { getCaseById, getDefaultCaseId } from '@/game/data/registry';
import { evaluateAccusation } from '@/game/logic/evaluation';

// ─── Per-Case Game State ──────────────────────────────────────────────────────

export interface CaseGameState {
  startTime: number;
  visitedLocationIds: Set<string>;
  discoveredEvidenceIds: Set<string>;
  inspectedEvidenceIds: Set<string>;
  interviewedSuspectIds: Set<string>;
  interviews: InterviewEntry[];
  notes: CaseNote[];
  connections: BoardConnection[];
  hypotheses: PlayerHypothesis[];
  contradictionFlags: PlayerContradictionFlag[];
  investigationLog: InvestigationEvent[];
  agentActions: AgentAction[];
  agentHypothesis: string | null;
  activeView: WorkspaceView;
  accusation: string | null;
  accusationSubmission: AccusationSubmission | null;
  accusationEvaluation: AccusationEvaluation | null;
}

export function createInitialCaseState(): CaseGameState {
  return {
    startTime: Date.now(),
    visitedLocationIds: new Set(),
    discoveredEvidenceIds: new Set(),
    inspectedEvidenceIds: new Set(),
    interviewedSuspectIds: new Set(),
    interviews: [],
    notes: [],
    connections: [],
    hypotheses: [],
    contradictionFlags: [],
    investigationLog: [],
    agentActions: [],
    agentHypothesis: null,
    activeView: 'overview',
    accusation: null,
    accusationSubmission: null,
    accusationEvaluation: null,
  };
}

// ─── Main State Shape ─────────────────────────────────────────────────────────

interface GameState extends CaseGameState {
  phase: AppPhase;
  activeCaseId: string;
  activeCase: Case;

  // Map of isolated state per case ID
  caseStates: Record<string, CaseGameState>;
}

// ─── Actions Shape ────────────────────────────────────────────────────────────

interface GameActions {
  // Case selection
  selectCase: (caseId: string) => void;

  // Phase
  setPhase: (phase: AppPhase) => void;
  startInvestigation: () => void;

  // Workspace
  setActiveView: (view: WorkspaceView) => void;

  // Locations
  visitLocation: (locationId: string) => void;

  // Evidence
  discoverEvidence: (evidenceId: string) => void;
  inspectEvidence: (evidenceId: string) => void;

  // Interviews
  recordInterview: (entry: Omit<InterviewEntry, 'id'>) => void;

  // Notes
  addNote: (content: string, author: ActorType) => void;
  deleteNote: (noteId: string) => void;

  // Case board connections
  addConnection: (
    fromId: string,
    fromType: ConnectionNodeType,
    toId: string,
    toType: ConnectionNodeType,
    label?: string,
    author?: ActorType,
  ) => void;
  removeConnection: (connectionId: string) => void;

  // Human Deduction Layer Actions
  addHypothesis: (hypothesis: Omit<PlayerHypothesis, 'id' | 'createdAt'>) => void;
  updateHypothesis: (id: string, updates: Partial<PlayerHypothesis>) => void;
  deleteHypothesis: (id: string) => void;

  addContradictionFlag: (flag: Omit<PlayerContradictionFlag, 'id' | 'createdAt'>) => void;
  deleteContradictionFlag: (id: string) => void;

  // Agent actions
  logAgentAction: (action: Omit<AgentAction, 'id' | 'timestamp'>) => void;
  setAgentHypothesis: (hypothesis: string) => void;

  // Accusation
  makeAccusation: (
    suspectId: string,
    method?: string,
    motive?: string,
    approximateTime?: string,
    explanation?: string,
    supportingEvidenceIds?: string[],
  ) => void;

  // Reset
  resetInvestigation: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeEvent(
  type: InvestigationEventType,
  description: string,
  relatedId?: string,
  actor: ActorType = 'human',
): InvestigationEvent {
  return {
    id: crypto.randomUUID(),
    type,
    description,
    timestamp: Date.now(),
    actor,
    relatedId,
  };
}

const defaultId = getDefaultCaseId();
const defaultCase = THE_GALLERY_MURDER;

// Helper to update active case state and sync into caseStates record
function updateActiveCaseState(
  state: GameState,
  updates: Partial<CaseGameState>,
): Partial<GameState> {
  const nextCs: CaseGameState = {
    startTime: updates.startTime ?? state.startTime,
    visitedLocationIds: new Set(updates.visitedLocationIds ?? state.visitedLocationIds),
    discoveredEvidenceIds: new Set(updates.discoveredEvidenceIds ?? state.discoveredEvidenceIds),
    inspectedEvidenceIds: new Set(updates.inspectedEvidenceIds ?? state.inspectedEvidenceIds),
    interviewedSuspectIds: new Set(updates.interviewedSuspectIds ?? state.interviewedSuspectIds),
    interviews: updates.interviews ?? state.interviews,
    notes: updates.notes ?? state.notes,
    connections: updates.connections ?? state.connections,
    hypotheses: updates.hypotheses ?? state.hypotheses,
    contradictionFlags: updates.contradictionFlags ?? state.contradictionFlags,
    investigationLog: updates.investigationLog ?? state.investigationLog,
    agentActions: updates.agentActions ?? state.agentActions,
    agentHypothesis: updates.agentHypothesis !== undefined ? updates.agentHypothesis : state.agentHypothesis,
    activeView: updates.activeView ?? state.activeView,
    accusation: updates.accusation !== undefined ? updates.accusation : state.accusation,
    accusationSubmission: updates.accusationSubmission !== undefined ? updates.accusationSubmission : state.accusationSubmission,
    accusationEvaluation: updates.accusationEvaluation !== undefined ? updates.accusationEvaluation : state.accusationEvaluation,
  };

  return {
    ...updates,
    caseStates: {
      ...state.caseStates,
      [state.activeCaseId]: nextCs,
    },
  };
}

// ─── Store with Persist Middleware ────────────────────────────────────────────

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...createInitialCaseState(),
      phase: 'landing',
      activeCaseId: defaultId,
      activeCase: defaultCase,
      caseStates: {
        [defaultId]: createInitialCaseState(),
      },

      // ── Case Selection ─────────────────────────────────────────────────────

      selectCase: (caseId) =>
        set((state) => {
          const targetCase = getCaseById(caseId);
          if (!targetCase) return {};

          // Snapshot current active state
          const currentSnapshot: CaseGameState = {
            startTime: state.startTime,
            visitedLocationIds: new Set(state.visitedLocationIds),
            discoveredEvidenceIds: new Set(state.discoveredEvidenceIds),
            inspectedEvidenceIds: new Set(state.inspectedEvidenceIds),
            interviewedSuspectIds: new Set(state.interviewedSuspectIds),
            interviews: [...state.interviews],
            notes: [...state.notes],
            connections: [...state.connections],
            hypotheses: [...state.hypotheses],
            contradictionFlags: [...state.contradictionFlags],
            investigationLog: [...state.investigationLog],
            agentActions: [...state.agentActions],
            agentHypothesis: state.agentHypothesis,
            activeView: state.activeView,
            accusation: state.accusation,
            accusationSubmission: state.accusationSubmission,
            accusationEvaluation: state.accusationEvaluation,
          };

          const updatedCaseStates = {
            ...state.caseStates,
            [state.activeCaseId]: currentSnapshot,
          };

          const rawTarget = updatedCaseStates[caseId];
          const targetState: CaseGameState = rawTarget
            ? {
                ...rawTarget,
                visitedLocationIds: new Set(rawTarget.visitedLocationIds),
                discoveredEvidenceIds: new Set(rawTarget.discoveredEvidenceIds),
                inspectedEvidenceIds: new Set(rawTarget.inspectedEvidenceIds),
                interviewedSuspectIds: new Set(rawTarget.interviewedSuspectIds),
                interviews: [...rawTarget.interviews],
                notes: [...rawTarget.notes],
                connections: [...rawTarget.connections],
                hypotheses: [...rawTarget.hypotheses],
                contradictionFlags: [...rawTarget.contradictionFlags],
                investigationLog: [...rawTarget.investigationLog],
                agentActions: [...rawTarget.agentActions],
              }
            : createInitialCaseState();

          return {
            activeCaseId: caseId,
            activeCase: targetCase,
            caseStates: {
              ...updatedCaseStates,
              [caseId]: targetState,
            },
            ...targetState,
            phase: 'briefing',
          };
        }),

      // ── Phase ──────────────────────────────────────────────────────────────

      setPhase: (phase) => set({ phase }),

      startInvestigation: () =>
        set((state) => ({
          ...updateActiveCaseState(state, {
            activeView: 'overview',
            startTime: state.startTime || Date.now(),
          }),
          phase: 'investigation',
        })),

      // ── Workspace ──────────────────────────────────────────────────────────

      setActiveView: (view) =>
        set((state) => updateActiveCaseState(state, { activeView: view })),

      // ── Locations ──────────────────────────────────────────────────────────

      visitLocation: (locationId) =>
        set((state) => {
          if (state.visitedLocationIds.has(locationId)) {
            return {};
          }

          const location = state.activeCase.locations.find((l) => l.id === locationId);
          const newVisited = new Set([...state.visitedLocationIds, locationId]);
          const newDiscovered = new Set([...state.discoveredEvidenceIds]);

          const newLogEntries: InvestigationEvent[] = [
            makeEvent('location_visited', `Visited ${location?.name ?? locationId}`, locationId, 'human'),
          ];

          if (location) {
            location.evidenceIds.forEach((eid) => {
              if (!newDiscovered.has(eid)) {
                newDiscovered.add(eid);
                const ev = state.activeCase.evidence.find((e) => e.id === eid);
                newLogEntries.push(
                  makeEvent('evidence_discovered', `Discovered: ${ev?.name ?? eid}`, eid, 'human'),
                );
              }
            });
          }

          return updateActiveCaseState(state, {
            visitedLocationIds: newVisited,
            discoveredEvidenceIds: newDiscovered,
            investigationLog: [...state.investigationLog, ...newLogEntries],
          });
        }),

      // ── Evidence ───────────────────────────────────────────────────────────

      discoverEvidence: (evidenceId) =>
        set((state) => {
          if (state.discoveredEvidenceIds.has(evidenceId)) return {};
          const ev = state.activeCase.evidence.find((e) => e.id === evidenceId);
          return updateActiveCaseState(state, {
            discoveredEvidenceIds: new Set([...state.discoveredEvidenceIds, evidenceId]),
            investigationLog: [
              ...state.investigationLog,
              makeEvent('evidence_discovered', `Discovered: ${ev?.name ?? evidenceId}`, evidenceId, 'human'),
            ],
          });
        }),

      inspectEvidence: (evidenceId) =>
        set((state) => {
          const ev = state.activeCase.evidence.find((e) => e.id === evidenceId);
          const alreadyInspected = state.inspectedEvidenceIds.has(evidenceId);
          const newLog = alreadyInspected
            ? state.investigationLog
            : [
                ...state.investigationLog,
                makeEvent('evidence_inspected', `Inspected: ${ev?.name ?? evidenceId}`, evidenceId, 'human'),
              ];

          return updateActiveCaseState(state, {
            inspectedEvidenceIds: new Set([...state.inspectedEvidenceIds, evidenceId]),
            investigationLog: newLog,
          });
        }),

      // ── Interviews ─────────────────────────────────────────────────────────

      recordInterview: (entry) =>
        set((state) => {
          const suspect = state.activeCase.suspects.find((s) => s.id === entry.suspectId);
          const firstInterview = !state.interviewedSuspectIds.has(entry.suspectId);
          const actor = entry.author ?? 'human';

          const newEntry: InterviewEntry = { ...entry, author: actor, id: crypto.randomUUID() };

          const newLog: InvestigationEvent[] = [...state.investigationLog];
          if (firstInterview) {
            newLog.push(
              makeEvent(
                'suspect_interviewed',
                `${actor === 'agent' ? 'AGENT' : 'YOU'} interviewed ${suspect?.name ?? entry.suspectId}`,
                entry.suspectId,
                actor,
              ),
            );
          }

          return updateActiveCaseState(state, {
            interviews: [...state.interviews, newEntry],
            interviewedSuspectIds: new Set([
              ...state.interviewedSuspectIds,
              entry.suspectId,
            ]),
            investigationLog: newLog,
          });
        }),

      // ── Notes ──────────────────────────────────────────────────────────────

      addNote: (content, author) =>
        set((state) =>
          updateActiveCaseState(state, {
            notes: [
              ...state.notes,
              { id: crypto.randomUUID(), content, author, timestamp: Date.now() },
            ],
            investigationLog: [
              ...state.investigationLog,
              makeEvent(
                'note_added',
                `${author === 'agent' ? 'AGENT' : 'YOU'} added a note: "${content.slice(0, 35)}..."`,
                undefined,
                author,
              ),
            ],
          }),
        ),

      deleteNote: (noteId) =>
        set((state) =>
          updateActiveCaseState(state, {
            notes: state.notes.filter((n) => n.id !== noteId),
          }),
        ),

      // ── Case Board ─────────────────────────────────────────────────────────

      addConnection: (fromId, fromType, toId, toType, label, author = 'human') =>
        set((state) => {
          const exists = state.connections.some(
            (c) =>
              (c.fromId === fromId && c.toId === toId) ||
              (c.fromId === toId && c.toId === fromId),
          );
          if (exists) return {};

          const connection: BoardConnection = {
            id: crypto.randomUUID(),
            fromId,
            fromType,
            toId,
            toType,
            label,
            author,
            timestamp: Date.now(),
          };

          return updateActiveCaseState(state, {
            connections: [...state.connections, connection],
            investigationLog: [
              ...state.investigationLog,
              makeEvent(
                'connection_made',
                `${author === 'agent' ? 'AGENT' : 'YOU'} linked ${fromId} ↔ ${toId}`,
                connection.id,
                author,
              ),
            ],
          });
        }),

      removeConnection: (connectionId) =>
        set((state) =>
          updateActiveCaseState(state, {
            connections: state.connections.filter((c) => c.id !== connectionId),
            investigationLog: [
              ...state.investigationLog,
              makeEvent('connection_removed', 'Removed a board connection', connectionId),
            ],
          }),
        ),

      // ── Human Deduction Layer Actions ─────────────────────────────────────

      addHypothesis: (hypothesisData) =>
        set((state) => {
          const newHyp: PlayerHypothesis = {
            ...hypothesisData,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
          };

          return updateActiveCaseState(state, {
            hypotheses: [...state.hypotheses, newHyp],
            investigationLog: [
              ...state.investigationLog,
              makeEvent('connection_made', `Formulated hypothesis: "${newHyp.title}"`, newHyp.id),
            ],
          });
        }),

      updateHypothesis: (id, updates) =>
        set((state) => ({
          ...updateActiveCaseState(state, {
            hypotheses: state.hypotheses.map((h) => (h.id === id ? { ...h, ...updates } : h)),
          }),
        })),

      deleteHypothesis: (id) =>
        set((state) => ({
          ...updateActiveCaseState(state, {
            hypotheses: state.hypotheses.filter((h) => h.id !== id),
          }),
        })),

      addContradictionFlag: (flagData) =>
        set((state) => {
          const newFlag: PlayerContradictionFlag = {
            ...flagData,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
          };

          return updateActiveCaseState(state, {
            contradictionFlags: [...state.contradictionFlags, newFlag],
            investigationLog: [
              ...state.investigationLog,
              makeEvent('connection_made', `Flagged contradiction: "${newFlag.title}"`, newFlag.id),
            ],
          });
        }),

      deleteContradictionFlag: (id) =>
        set((state) => ({
          ...updateActiveCaseState(state, {
            contradictionFlags: state.contradictionFlags.filter((f) => f.id !== id),
          }),
        })),

      // ── Agent ──────────────────────────────────────────────────────────────

      logAgentAction: (action) =>
        set((state) => {
          const newAction: AgentAction = {
            ...action,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
          };

          const summaryText = action.summary ?? `[WebMCP] ${action.tool} executed`;

          return updateActiveCaseState(state, {
            agentActions: [...state.agentActions, newAction],
            investigationLog: [
              ...state.investigationLog,
              makeEvent('agent_tool_call', `AGENT ${summaryText}`, newAction.id, 'agent'),
            ],
          });
        }),

      setAgentHypothesis: (hypothesis) =>
        set((state) =>
          updateActiveCaseState(state, {
            agentHypothesis: hypothesis,
            investigationLog: [
              ...state.investigationLog,
              makeEvent(
                'agent_hypothesis',
                `AGENT updated hypothesis: "${hypothesis.slice(0, 45)}..."`,
                undefined,
                'agent',
              ),
            ],
          }),
        ),

      // ── Accusation ─────────────────────────────────────────────────────────

      makeAccusation: (suspectId, method = '', motive = '', approximateTime = '', explanation = '', supportingEvidenceIds = []) =>
        set((state) => {
          const submissionData: AccusationSubmission = {
            suspectId,
            method,
            motive,
            approximateTime,
            explanation: explanation || method + ' ' + motive,
            supportingEvidenceIds,
            submittedAt: Date.now(),
          };

          const evaluation = evaluateAccusation(state.activeCase, submissionData);

          return {
            ...updateActiveCaseState(state, {
              accusation: suspectId,
              accusationSubmission: submissionData,
              accusationEvaluation: evaluation,
            }),
            phase: 'resolution',
          };
        }),

      // ── Reset ──────────────────────────────────────────────────────────────

      resetInvestigation: () =>
        set((state) => {
          const freshState = createInitialCaseState();
          return {
            ...freshState,
            caseStates: {
              ...state.caseStates,
              [state.activeCaseId]: freshState,
            },
          };
        }),
    }),
    {
      name: 'casefile-game-session-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        phase: state.phase,
        activeCaseId: state.activeCaseId,
        caseStates: Object.fromEntries(
          Object.entries(state.caseStates || {}).map(([cid, cs]) => [
            cid,
            {
              ...cs,
              visitedLocationIds: Array.from(cs.visitedLocationIds || []),
              discoveredEvidenceIds: Array.from(cs.discoveredEvidenceIds || []),
              inspectedEvidenceIds: Array.from(cs.inspectedEvidenceIds || []),
              interviewedSuspectIds: Array.from(cs.interviewedSuspectIds || []),
            },
          ]),
        ),
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const activeId = state.activeCaseId || getDefaultCaseId();
        state.activeCaseId = activeId;
        state.activeCase = getCaseById(activeId) || THE_GALLERY_MURDER;

        if (state.caseStates) {
          Object.keys(state.caseStates).forEach((cid) => {
            const cs = state.caseStates[cid] as any;
            if (cs) {
              if (Array.isArray(cs.visitedLocationIds)) cs.visitedLocationIds = new Set(cs.visitedLocationIds);
              if (Array.isArray(cs.discoveredEvidenceIds)) cs.discoveredEvidenceIds = new Set(cs.discoveredEvidenceIds);
              if (Array.isArray(cs.inspectedEvidenceIds)) cs.inspectedEvidenceIds = new Set(cs.inspectedEvidenceIds);
              if (Array.isArray(cs.interviewedSuspectIds)) cs.interviewedSuspectIds = new Set(cs.interviewedSuspectIds);
            }
          });
        } else {
          state.caseStates = {};
        }

        const activeCs = state.caseStates[activeId] as any;
        if (activeCs) {
          state.startTime = activeCs.startTime ?? Date.now();
          state.visitedLocationIds = activeCs.visitedLocationIds instanceof Set ? activeCs.visitedLocationIds : new Set();
          state.discoveredEvidenceIds = activeCs.discoveredEvidenceIds instanceof Set ? activeCs.discoveredEvidenceIds : new Set();
          state.inspectedEvidenceIds = activeCs.inspectedEvidenceIds instanceof Set ? activeCs.inspectedEvidenceIds : new Set();
          state.interviewedSuspectIds = activeCs.interviewedSuspectIds instanceof Set ? activeCs.interviewedSuspectIds : new Set();
          state.interviews = activeCs.interviews ?? [];
          state.notes = activeCs.notes ?? [];
          state.connections = activeCs.connections ?? [];
          state.investigationLog = activeCs.investigationLog ?? [];
          state.agentActions = activeCs.agentActions ?? [];
          state.agentHypothesis = activeCs.agentHypothesis ?? null;
          state.activeView = activeCs.activeView ?? 'overview';
          state.accusation = activeCs.accusation ?? null;
          state.accusationSubmission = activeCs.accusationSubmission ?? null;
        } else {
          const fresh = createInitialCaseState();
          state.caseStates[activeId] = fresh;
          Object.assign(state, fresh);
        }
      },
    },
  ),
);

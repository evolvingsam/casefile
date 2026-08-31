import { create } from 'zustand';
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
} from '@/game/types';
import { THE_GALLERY_MURDER } from '@/game/data/galleryMurder';

// ─── State Shape ──────────────────────────────────────────────────────────────

interface GameState {
  phase: AppPhase;
  activeCase: Case;
  startTime: number;

  // Investigation progress
  visitedLocationIds: Set<string>;
  discoveredEvidenceIds: Set<string>;
  inspectedEvidenceIds: Set<string>;
  interviewedSuspectIds: Set<string>;

  // Interview history
  interviews: InterviewEntry[];

  // Case notes
  notes: CaseNote[];

  // Case board connections
  connections: BoardConnection[];

  // Investigation event log
  investigationLog: InvestigationEvent[];

  // Agent actions
  agentActions: AgentAction[];

  // Current agent hypothesis
  agentHypothesis: string | null;

  // Workspace nav
  activeView: WorkspaceView;

  // Accusation
  accusation: string | null;
  accusationSubmission: AccusationSubmission | null;
}

// ─── Actions Shape ────────────────────────────────────────────────────────────

interface GameActions {
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

  // Agent actions
  logAgentAction: (action: Omit<AgentAction, 'id' | 'timestamp'>) => void;
  setAgentHypothesis: (hypothesis: string) => void;

  // Accusation
  makeAccusation: (
    suspectId: string,
    reasoning?: string,
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

// ─── Store ────────────────────────────────────────────────────────────────────

const INITIAL_STATE: Omit<GameState, 'activeCase'> = {
  phase: 'landing',
  startTime: Date.now(),
  visitedLocationIds: new Set(),
  discoveredEvidenceIds: new Set(),
  inspectedEvidenceIds: new Set(),
  interviewedSuspectIds: new Set(),
  interviews: [],
  notes: [],
  connections: [],
  investigationLog: [],
  agentActions: [],
  agentHypothesis: null,
  activeView: 'overview',
  accusation: null,
  accusationSubmission: null,
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...INITIAL_STATE,
  activeCase: THE_GALLERY_MURDER,

  // ── Phase ──────────────────────────────────────────────────────────────────

  setPhase: (phase) => set({ phase }),

  startInvestigation: () =>
    set({
      phase: 'investigation',
      startTime: Date.now(),
      activeView: 'overview',
    }),

  // ── Workspace ──────────────────────────────────────────────────────────────

  setActiveView: (view) => set({ activeView: view }),

  // ── Locations ──────────────────────────────────────────────────────────────

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

      return {
        visitedLocationIds: newVisited,
        discoveredEvidenceIds: newDiscovered,
        investigationLog: [...state.investigationLog, ...newLogEntries],
      };
    }),

  // ── Evidence ───────────────────────────────────────────────────────────────

  discoverEvidence: (evidenceId) =>
    set((state) => {
      if (state.discoveredEvidenceIds.has(evidenceId)) return {};
      const ev = state.activeCase.evidence.find((e) => e.id === evidenceId);
      return {
        discoveredEvidenceIds: new Set([...state.discoveredEvidenceIds, evidenceId]),
        investigationLog: [
          ...state.investigationLog,
          makeEvent('evidence_discovered', `Discovered: ${ev?.name ?? evidenceId}`, evidenceId, 'human'),
        ],
      };
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

      return {
        inspectedEvidenceIds: new Set([...state.inspectedEvidenceIds, evidenceId]),
        investigationLog: newLog,
      };
    }),

  // ── Interviews ─────────────────────────────────────────────────────────────

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

      return {
        interviews: [...state.interviews, newEntry],
        interviewedSuspectIds: new Set([
          ...state.interviewedSuspectIds,
          entry.suspectId,
        ]),
        investigationLog: newLog,
      };
    }),

  // ── Notes ──────────────────────────────────────────────────────────────────

  addNote: (content, author) =>
    set((state) => ({
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
    })),

  deleteNote: (noteId) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== noteId),
    })),

  // ── Case Board ─────────────────────────────────────────────────────────────

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

      return {
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
      };
    }),

  removeConnection: (connectionId) =>
    set((state) => ({
      connections: state.connections.filter((c) => c.id !== connectionId),
      investigationLog: [
        ...state.investigationLog,
        makeEvent('connection_removed', `Connection removed`, connectionId, 'human'),
      ],
    })),

  // ── Agent ──────────────────────────────────────────────────────────────────

  logAgentAction: (action) =>
    set((state) => {
      const newAction: AgentAction = {
        ...action,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };

      const summaryText = action.summary ?? `[WebMCP] ${action.tool} executed`;

      return {
        agentActions: [...state.agentActions, newAction],
        investigationLog: [
          ...state.investigationLog,
          makeEvent('agent_tool_call', `AGENT ${summaryText}`, newAction.id, 'agent'),
        ],
      };
    }),

  setAgentHypothesis: (hypothesis) =>
    set((state) => ({
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
    })),

  // ── Accusation ─────────────────────────────────────────────────────────────

  makeAccusation: (suspectId, reasoning = '', supportingEvidenceIds = []) =>
    set({
      accusation: suspectId,
      accusationSubmission: {
        suspectId,
        reasoning,
        supportingEvidenceIds,
        submittedAt: Date.now(),
      },
      phase: 'resolution',
    }),

  // ── Reset ──────────────────────────────────────────────────────────────────

  resetInvestigation: () =>
    set({
      ...INITIAL_STATE,
      startTime: Date.now(),
      activeCase: get().activeCase,
    }),
}));

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
} from '@/game/types';
import { THE_GALLERY_MURDER } from '@/game/data/galleryMurder';

// ─── State Shape ──────────────────────────────────────────────────────────────

interface GameState {
  phase: AppPhase;
  activeCase: Case;

  // Investigation progress
  visitedLocationIds: Set<string>;
  discoveredEvidenceIds: Set<string>;
  inspectedEvidenceIds: Set<string>;
  interviewedSuspectIds: Set<string>;

  // Interview history (full entries with questionId)
  interviews: InterviewEntry[];

  // Case notes
  notes: CaseNote[];

  // Case board connections (player-authored)
  connections: BoardConnection[];

  // Investigation event log (all player actions in order)
  investigationLog: InvestigationEvent[];

  // Agent actions
  agentActions: AgentAction[];

  // Workspace nav
  activeView: WorkspaceView;

  // Accusation
  accusation: string | null;
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
  addNote: (content: string, author: 'player' | 'agent') => void;
  deleteNote: (noteId: string) => void;

  // Case board connections
  addConnection: (
    fromId: string,
    fromType: ConnectionNodeType,
    toId: string,
    toType: ConnectionNodeType,
    label?: string,
  ) => void;
  removeConnection: (connectionId: string) => void;

  // Agent actions
  logAgentAction: (action: Omit<AgentAction, 'id' | 'timestamp'>) => void;

  // Accusation
  makeAccusation: (suspectId: string) => void;

  // Reset (for replay)
  resetInvestigation: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeEvent(
  type: InvestigationEventType,
  description: string,
  relatedId?: string,
): InvestigationEvent {
  return {
    id: crypto.randomUUID(),
    type,
    description,
    timestamp: Date.now(),
    relatedId,
  };
}

// ─── Store ────────────────────────────────────────────────────────────────────

const INITIAL_STATE: Omit<GameState, 'activeCase'> = {
  phase: 'landing',
  visitedLocationIds: new Set(),
  discoveredEvidenceIds: new Set(),
  inspectedEvidenceIds: new Set(),
  interviewedSuspectIds: new Set(),
  interviews: [],
  notes: [],
  connections: [],
  investigationLog: [],
  agentActions: [],
  activeView: 'overview',
  accusation: null,
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...INITIAL_STATE,
  activeCase: THE_GALLERY_MURDER,

  // ── Phase ──────────────────────────────────────────────────────────────────

  setPhase: (phase) => set({ phase }),

  startInvestigation: () =>
    set({
      phase: 'investigation',
      activeView: 'overview',
    }),

  // ── Workspace ──────────────────────────────────────────────────────────────

  setActiveView: (view) => set({ activeView: view }),

  // ── Locations ──────────────────────────────────────────────────────────────

  visitLocation: (locationId) =>
    set((state) => {
      if (state.visitedLocationIds.has(locationId)) {
        // Re-visiting — no state change beyond keeping it visited
        return {};
      }

      const location = state.activeCase.locations.find((l) => l.id === locationId);
      const newVisited = new Set([...state.visitedLocationIds, locationId]);
      const newDiscovered = new Set([...state.discoveredEvidenceIds]);

      const newLogEntries: InvestigationEvent[] = [
        makeEvent(
          'location_visited',
          `Visited ${location?.name ?? locationId}`,
          locationId,
        ),
      ];

      if (location) {
        location.evidenceIds.forEach((eid) => {
          if (!newDiscovered.has(eid)) {
            newDiscovered.add(eid);
            const ev = state.activeCase.evidence.find((e) => e.id === eid);
            newLogEntries.push(
              makeEvent('evidence_discovered', `Discovered: ${ev?.name ?? eid}`, eid),
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
          makeEvent('evidence_discovered', `Discovered: ${ev?.name ?? evidenceId}`, evidenceId),
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
            makeEvent(
              'evidence_inspected',
              `Inspected: ${ev?.name ?? evidenceId}`,
              evidenceId,
            ),
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

      const newEntry: InterviewEntry = { ...entry, id: crypto.randomUUID() };

      const newLog: InvestigationEvent[] = [...state.investigationLog];
      if (firstInterview) {
        newLog.push(
          makeEvent(
            'suspect_interviewed',
            `Interviewed ${suspect?.name ?? entry.suspectId}`,
            entry.suspectId,
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
      investigationLog:
        author === 'player'
          ? [
              ...state.investigationLog,
              makeEvent('note_added', `Note added: "${content.slice(0, 40)}..."`),
            ]
          : state.investigationLog,
    })),

  deleteNote: (noteId) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== noteId),
    })),

  // ── Case Board ─────────────────────────────────────────────────────────────

  addConnection: (fromId, fromType, toId, toType, label) =>
    set((state) => {
      // Prevent duplicate connections
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
        timestamp: Date.now(),
      };

      return {
        connections: [...state.connections, connection],
        investigationLog: [
          ...state.investigationLog,
          makeEvent(
            'connection_made',
            `Linked ${fromId} ↔ ${toId}`,
            connection.id,
          ),
        ],
      };
    }),

  removeConnection: (connectionId) =>
    set((state) => ({
      connections: state.connections.filter((c) => c.id !== connectionId),
      investigationLog: [
        ...state.investigationLog,
        makeEvent('connection_removed', `Connection removed`, connectionId),
      ],
    })),

  // ── Agent ──────────────────────────────────────────────────────────────────

  logAgentAction: (action) =>
    set((state) => ({
      agentActions: [
        ...state.agentActions,
        { ...action, id: crypto.randomUUID(), timestamp: Date.now() },
      ],
    })),

  // ── Accusation ─────────────────────────────────────────────────────────────

  makeAccusation: (suspectId) =>
    set({ accusation: suspectId, phase: 'resolution' }),

  // ── Reset ──────────────────────────────────────────────────────────────────

  resetInvestigation: () =>
    set({
      ...INITIAL_STATE,
      activeCase: get().activeCase,
    }),
}));

// ─── Selector hooks (convenience) ─────────────────────────────────────────────

export const selectActiveCase = (s: GameState & GameActions) => s.activeCase;
export const selectPhase = (s: GameState & GameActions) => s.phase;
export const selectDiscoveredEvidence = (s: GameState & GameActions) =>
  s.discoveredEvidenceIds;
export const selectInspectedEvidence = (s: GameState & GameActions) =>
  s.inspectedEvidenceIds;
export const selectVisitedLocations = (s: GameState & GameActions) =>
  s.visitedLocationIds;
export const selectInterviews = (s: GameState & GameActions) => s.interviews;
export const selectInterviewedSuspects = (s: GameState & GameActions) =>
  s.interviewedSuspectIds;
export const selectConnections = (s: GameState & GameActions) => s.connections;
export const selectNotes = (s: GameState & GameActions) => s.notes;
export const selectInvestigationLog = (s: GameState & GameActions) =>
  s.investigationLog;

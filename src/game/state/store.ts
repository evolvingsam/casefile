import { create } from 'zustand';
import type {
  AppPhase,
  Case,
  WorkspaceView,
  AgentAction,
  CaseNote,
  InterviewEntry,
} from '@/game/types';
import { THE_GALLERY_MURDER } from '@/game/data/galleryMurder';

// ─── State Shape ──────────────────────────────────────────────────────────────

interface GameState {
  // App phase
  phase: AppPhase;

  // Active case
  activeCase: Case;

  // Investigation progress — which entities have been interacted with
  visitedLocationIds: Set<string>;
  discoveredEvidenceIds: Set<string>;
  inspectedEvidenceIds: Set<string>;
  interviewedSuspectIds: Set<string>;

  // Interview history
  interviews: InterviewEntry[];

  // Case notes (player + agent)
  notes: CaseNote[];

  // Agent activity log
  agentActions: AgentAction[];

  // Current workspace view
  activeView: WorkspaceView;

  // Currently selected evidence ID (for detail panel)
  selectedEvidenceId: string | null;

  // Currently selected suspect ID (for detail panel)
  selectedSuspectId: string | null;

  // Final accusation
  accusation: string | null;
}

// ─── Actions Shape ────────────────────────────────────────────────────────────

interface GameActions {
  // Phase navigation
  setPhase: (phase: AppPhase) => void;
  startInvestigation: () => void;

  // Workspace navigation
  setActiveView: (view: WorkspaceView) => void;

  // Selection
  selectEvidence: (id: string | null) => void;
  selectSuspect: (id: string | null) => void;

  // Location interactions
  visitLocation: (locationId: string) => void;

  // Evidence interactions — discovering auto-marks evidence in the case
  discoverEvidence: (evidenceId: string) => void;
  inspectEvidence: (evidenceId: string) => void;

  // Suspect interactions
  recordInterview: (entry: InterviewEntry) => void;

  // Notes
  addNote: (content: string, author: 'player' | 'agent') => void;

  // Agent actions
  logAgentAction: (action: Omit<AgentAction, 'id' | 'timestamp'>) => void;

  // Accusation
  makeAccusation: (suspectId: string) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useGameStore = create<GameState & GameActions>((set) => ({
  // ── Initial state ──
  phase: 'landing',
  activeCase: THE_GALLERY_MURDER,
  visitedLocationIds: new Set(),
  discoveredEvidenceIds: new Set(),
  inspectedEvidenceIds: new Set(),
  interviewedSuspectIds: new Set(),
  interviews: [],
  notes: [],
  agentActions: [],
  activeView: 'overview',
  selectedEvidenceId: null,
  selectedSuspectId: null,
  accusation: null,

  // ── Phase navigation ──
  setPhase: (phase) => set({ phase }),
  startInvestigation: () =>
    set({ phase: 'investigation', activeView: 'overview' }),

  // ── Workspace navigation ──
  setActiveView: (view) => set({ activeView: view }),

  // ── Selection ──
  selectEvidence: (id) => set({ selectedEvidenceId: id }),
  selectSuspect: (id) => set({ selectedSuspectId: id }),

  // ── Location interactions ──
  // When a location is visited, auto-discover all its evidence
  visitLocation: (locationId) =>
    set((state) => {
      const newVisited = new Set([...state.visitedLocationIds, locationId]);
      const location = state.activeCase.locations.find((l) => l.id === locationId);
      const newDiscovered = new Set([...state.discoveredEvidenceIds]);
      if (location) {
        location.evidenceIds.forEach((eid) => newDiscovered.add(eid));
      }
      return {
        visitedLocationIds: newVisited,
        discoveredEvidenceIds: newDiscovered,
      };
    }),

  // ── Evidence interactions ──
  discoverEvidence: (evidenceId) =>
    set((state) => ({
      discoveredEvidenceIds: new Set([...state.discoveredEvidenceIds, evidenceId]),
    })),

  inspectEvidence: (evidenceId) =>
    set((state) => ({
      inspectedEvidenceIds: new Set([...state.inspectedEvidenceIds, evidenceId]),
      selectedEvidenceId: evidenceId,
    })),

  // ── Suspect interactions ──
  recordInterview: (entry) =>
    set((state) => ({
      interviews: [...state.interviews, entry],
      interviewedSuspectIds: new Set([
        ...state.interviewedSuspectIds,
        entry.suspectId,
      ]),
    })),

  // ── Notes ──
  addNote: (content, author) =>
    set((state) => ({
      notes: [
        ...state.notes,
        {
          id: crypto.randomUUID(),
          content,
          author,
          timestamp: Date.now(),
        },
      ],
    })),

  // ── Agent actions ──
  logAgentAction: (action) =>
    set((state) => ({
      agentActions: [
        ...state.agentActions,
        {
          ...action,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        },
      ],
    })),

  // ── Accusation ──
  makeAccusation: (suspectId) =>
    set({ accusation: suspectId, phase: 'resolution' }),
}));

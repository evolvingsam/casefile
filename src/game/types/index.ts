// ─── ID Aliases ───────────────────────────────────────────────────────────────

export type EvidenceId = string;
export type SuspectId = string;
export type LocationId = string;
export type StatementId = string;

// ─── Suspect ──────────────────────────────────────────────────────────────────

export interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface Suspect {
  id: SuspectId;
  name: string;
  /** Short role/title displayed on card */
  title: string;
  occupation: string;
  /** Public-facing description shown to player immediately */
  description: string;
  /** The suspect's relationship to the victim */
  relationship: string;
  /** Surface motive the player discovers through investigation */
  motive: string;
  /** Their stated alibi */
  alibi: string;
  /** Hidden information only revealed through deep investigation */
  secrets: string[];
  /** Statement given on the night */
  initialStatement: string;
  /** Canned interview Q&A pairs */
  interviewResponses: InterviewQuestion[];
  /** Evidence IDs that link to this suspect */
  relatedEvidenceIds: EvidenceId[];
  /** Whether this suspect is the killer (hidden from player) */
  isKiller: boolean;
}

// ─── Location ─────────────────────────────────────────────────────────────────

export interface Location {
  id: LocationId;
  name: string;
  description: string;
  /** Atmospheric detail shown when player enters */
  investigatorNote: string;
  /** Emoji icon for the location card */
  icon: string;
  /** Evidence that can be found in this location */
  evidenceIds: EvidenceId[];
}

// ─── Evidence ─────────────────────────────────────────────────────────────────

export interface Evidence {
  id: EvidenceId;
  name: string;
  /** Short description shown on the evidence card */
  description: string;
  /** Detailed analysis revealed when inspected */
  detailedDescription: string;
  location: LocationId;
  /** Tags used for filtering (e.g. 'physical', 'digital', 'document') */
  tags: string[];
  /** Suspects this evidence is connected to */
  relatedSuspectIds: SuspectId[];
  /** Other evidence this piece corroborates or conflicts with */
  relatedEvidenceIds: EvidenceId[];
  /** True if this is a deliberate mislead */
  isRedHerring: boolean;
  /** True if this evidence is part of the provable solution */
  contributesToSolution: boolean;
  /** Hidden significance — what the evidence really proves */
  hiddenSignificance: string;
}

// ─── Timeline Event ───────────────────────────────────────────────────────────

export interface TimelineEvent {
  id: string;
  time: string;
  description: string;
  /** Source of this fact (e.g. 'CCTV', 'Witness', 'Phone record') */
  source: string;
  suspectIds: SuspectId[];
  evidenceIds: EvidenceId[];
  /** Whether this event creates a contradiction with a statement */
  isContradiction: boolean;
  /** ID of the suspect whose statement this contradicts */
  contradictsSuspectId?: SuspectId;
}

// ─── Case Solution ────────────────────────────────────────────────────────────

export interface CaseSolution {
  killerId: SuspectId;
  method: string;
  motive: string;
  opportunity: string;
  /** The narrative of what really happened */
  fullExplanation: string;
  /** The key evidence items that prove guilt */
  keyEvidenceIds: EvidenceId[];
}

// ─── Case ─────────────────────────────────────────────────────────────────────

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  subtitle: string;
  victim: string;
  victimDescription: string;
  briefing: string;
  suspects: Suspect[];
  locations: Location[];
  evidence: Evidence[];
  timeline: TimelineEvent[];
  solution: CaseSolution;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export type WorkspaceView =
  | 'overview'
  | 'locations'
  | 'evidence'
  | 'suspects'
  | 'timeline'
  | 'caseboard'
  | 'agent';

// ─── App Phase ────────────────────────────────────────────────────────────────

export type AppPhase = 'landing' | 'briefing' | 'investigation' | 'resolution';

// ─── Session State Types ───────────────────────────────────────────────────────

export interface InterviewEntry {
  suspectId: SuspectId;
  question: string;
  response: string;
  timestamp: number;
}

export interface AgentAction {
  id: string;
  tool: string;
  parameters: Record<string, string>;
  result: string;
  timestamp: number;
}

export interface CaseNote {
  id: string;
  content: string;
  author: 'player' | 'agent';
  timestamp: number;
}

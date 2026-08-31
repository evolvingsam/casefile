// ─── ID Aliases ───────────────────────────────────────────────────────────────

export type EvidenceId = string;
export type SuspectId = string;
export type LocationId = string;
export type ConnectionId = string;
export type InvestigationEventId = string;
export type ActorType = 'human' | 'agent';

// ─── Suspect ──────────────────────────────────────────────────────────────────

export interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
  /** Evidence IDs that must be discovered before this question unlocks */
  requiresEvidenceIds?: EvidenceId[];
}

export interface Suspect {
  id: SuspectId;
  name: string;
  title: string;
  occupation: string;
  description: string;
  relationship: string;
  motive: string;
  alibi: string;
  secrets: string[];
  initialStatement: string;
  interviewResponses: InterviewQuestion[];
  relatedEvidenceIds: EvidenceId[];
  isKiller: boolean;
}

// ─── Location ─────────────────────────────────────────────────────────────────

export interface Location {
  id: LocationId;
  name: string;
  description: string;
  investigatorNote: string;
  icon: string;
  evidenceIds: EvidenceId[];
}

// ─── Evidence ─────────────────────────────────────────────────────────────────

export interface Evidence {
  id: EvidenceId;
  name: string;
  description: string;
  detailedDescription: string;
  location: LocationId;
  tags: string[];
  relatedSuspectIds: SuspectId[];
  relatedEvidenceIds: EvidenceId[];
  isRedHerring: boolean;
  contributesToSolution: boolean;
  hiddenSignificance: string;
}

// ─── Timeline Event ───────────────────────────────────────────────────────────

export interface TimelineEvent {
  id: string;
  time: string;
  description: string;
  source: string;
  suspectIds: SuspectId[];
  evidenceIds: EvidenceId[];
  isContradiction: boolean;
  contradictsSuspectId?: SuspectId;
  alwaysVisible?: boolean;
}

// ─── Case Solution ────────────────────────────────────────────────────────────

export interface CaseSolution {
  killerId: SuspectId;
  method: string;
  motive: string;
  opportunity: string;
  fullExplanation: string;
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

// ─── Case Board ───────────────────────────────────────────────────────────────

export type ConnectionNodeType = 'evidence' | 'suspect';

export interface BoardConnection {
  id: ConnectionId;
  fromId: string;
  fromType: ConnectionNodeType;
  toId: string;
  toType: ConnectionNodeType;
  label?: string;
  timestamp: number;
  author?: ActorType;
}

// ─── Investigation Log ────────────────────────────────────────────────────────

export type InvestigationEventType =
  | 'location_visited'
  | 'evidence_discovered'
  | 'evidence_inspected'
  | 'suspect_interviewed'
  | 'connection_made'
  | 'connection_removed'
  | 'note_added'
  | 'agent_tool_call'
  | 'agent_hypothesis';

export interface InvestigationEvent {
  id: InvestigationEventId;
  type: InvestigationEventType;
  description: string;
  timestamp: number;
  actor: ActorType;
  relatedId?: string;
}

export interface InvestigationProgress {
  locationsVisited: number;
  locationsTotal: number;
  evidenceDiscovered: number;
  evidenceTotal: number;
  evidenceInspected: number;
  suspectsInterviewed: number;
  suspectsTotal: number;
  timelineEventsVisible: number;
  timelineEventsTotal: number;
  contradictionsFound: number;
  completionPercent: number;
}

// ─── Agent Recommendation ────────────────────────────────────────────────────

export interface AgentRecommendation {
  suspectId: SuspectId;
  suspectName: string;
  confidence: 'Low' | 'Moderate' | 'High' | 'Conclusive';
  confidencePercentage: number;
  reasoning: string;
  supportingEvidenceIds: EvidenceId[];
  supportingEvidenceNames: string[];
  contradictionSummary?: string;
  recommendedAction: string;
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

// ─── Session Types ────────────────────────────────────────────────────────────

export interface InterviewEntry {
  id: string;
  suspectId: SuspectId;
  questionId: string;
  question: string;
  response: string;
  timestamp: number;
  author?: ActorType;
}

export type AgentEventKind =
  | 'tool_call'
  | 'result'
  | 'discovery'
  | 'warning'
  | 'hypothesis';

export interface AgentAction {
  id: string;
  tool: string;
  parameters: Record<string, string>;
  result: string;
  timestamp: number;
  status?: 'success' | 'warning' | 'error' | 'running';
  kind?: AgentEventKind;
  summary?: string;
  hypothesis?: string;
}

export interface CaseNote {
  id: string;
  content: string;
  author: ActorType;
  timestamp: number;
}

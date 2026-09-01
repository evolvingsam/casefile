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
  secrets?: string[];
  initialStatement: string;
  interviewResponses: InterviewQuestion[];
  relatedEvidenceIds: EvidenceId[];
  isKiller?: boolean;
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

// ─── Evidence (Client Public Model) ──────────────────────────────────────────

export interface Evidence {
  id: EvidenceId;
  name: string;
  description: string;
  detailedDescription: string;
  location: LocationId;
  tags: string[];
  relatedSuspectIds: SuspectId[];
  relatedEvidenceIds: EvidenceId[];
  isRedHerring?: boolean;
  contributesToSolution?: boolean;
  hiddenSignificance?: string;
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

// ─── Hidden Relationship & Deduction Requirements ─────────────────────────────

export interface HiddenRelationship {
  sourceId: string;
  targetId: string;
  relationshipType: string;
  description: string;
  requiresEvidenceIds?: EvidenceId[];
}

export interface DeductionRequirement {
  id: string;
  title: string;
  description: string;
  requiredEvidenceIds?: EvidenceId[];
  requiredInspectedEvidenceIds?: EvidenceId[];
  requiredInterviewQuestionIds?: string[];
  isFulfilled?: boolean;
}

export type CaseStatus = 'available' | 'locked' | 'coming_soon';

export interface CaseMetadata {
  id: string;
  caseNumber: string;
  title: string;
  subtitle: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  estimatedTime?: string;
  status: CaseStatus;
  victim: string;
  victimDescription: string;
  briefing: string;
  objective?: string;
}

// ─── Case ─────────────────────────────────────────────────────────────────────

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  subtitle: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  estimatedTime?: string;
  status?: CaseStatus;
  victim: string;
  victimDescription: string;
  briefing: string;
  objective?: string;
  suspects: Suspect[];
  locations: Location[];
  evidence: Evidence[];
  timeline: TimelineEvent[];
  hiddenRelationships?: HiddenRelationship[];
  solution?: CaseSolution;
  deductionRequirements?: DeductionRequirement[];
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

// ─── Player Hypothesis & Contradictions ───────────────────────────────────────

export type CertaintyLevel =
  | 'Possible'
  | 'Probable'
  | 'Confirmed'
  | 'Speculative'
  | 'Plausible'
  | 'Highly Likely'
  | 'Conclusive';

export interface PlayerHypothesis {
  id: string;
  title?: string;
  statement?: string;
  reasoning?: string;
  associatedSuspectId?: SuspectId;
  associatedTimelineEventId?: string;
  linkedEvidenceIds: EvidenceId[];
  certainty: CertaintyLevel;
  createdAt: number;
}

export interface PlayerContradictionFlag {
  id: string;
  title: string;
  suspectId?: SuspectId;
  timelineEventId?: string;
  description: string;
  evidenceIds: EvidenceId[];
  createdAt: number;
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

// ─── Accusation Submission ───────────────────────────────────────────────────

export interface AccusationSubmission {
  suspectId: SuspectId;
  method?: string;
  motive?: string;
  approximateTime?: string;
  explanation: string;
  reasoning?: string;
  supportingEvidenceIds: EvidenceId[];
  submittedAt: number;
}

export interface AccusationEvaluation {
  passedThreshold: boolean;
  totalScore: number;
  perpetratorScore: number;
  methodScore: number;
  motiveScore: number;
  timelineScore: number;
  evidenceScore: number;
  elementBreakdown: {
    perpetrator: 'Correct' | 'Incorrect';
    method: 'Correct' | 'Partial' | 'Incorrect';
    motive: 'Correct' | 'Partial' | 'Incorrect';
    timeline: 'Correct' | 'Partial' | 'Incorrect';
    evidence: 'Correct' | 'Partial' | 'Incorrect';
    perpetratorCorrect?: boolean;
    methodRating?: 'Correct' | 'Partial' | 'Incorrect';
    motiveRating?: 'Correct' | 'Partial' | 'Incorrect';
    timelineRating?: 'Correct' | 'Partial' | 'Incorrect';
    evidenceRating?: 'Correct' | 'Partial' | 'Incorrect';
  };
  feedbackLines: string[];
  comparison?: {
    playerTheory: {
      suspectName: string;
      method: string;
      motive: string;
      timeline: string;
      explanation: string;
      evidenceNames: string[];
    };
    actualSolution: {
      killerName: string;
      method: string;
      motive: string;
      opportunity: string;
      explanation: string;
      keyEvidenceNames: string[];
    };
  };
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export type WorkspaceView =
  | 'overview'
  | 'locations'
  | 'evidence'
  | 'suspects'
  | 'timeline'
  | 'caseboard'
  | 'deductions'
  | 'agent';

// ─── App Phase ────────────────────────────────────────────────────────────────

export type AppPhase = 'landing' | 'cases' | 'briefing' | 'investigation' | 'resolution';

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

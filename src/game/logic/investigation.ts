/**
 * investigation.ts
 *
 * Pure investigation logic — no React, no store.
 * All functions are deterministic given the same inputs.
 */

import type {
  Case,
  Evidence,
  Suspect,
  Location,
  SuspectId,
  EvidenceId,
  LocationId,
  InterviewEntry,
  BoardConnection,
  AgentRecommendation,
  ActorType,
  InvestigationProgress,
} from '@/game/types';

// ─── Location Queries ─────────────────────────────────────────────────────────

export function getLocationEvidence(
  caseData: Case,
  locationId: LocationId,
): Evidence[] {
  const loc = caseData.locations.find((l) => l.id === locationId);
  if (!loc) return [];
  return loc.evidenceIds
    .map((eid) => caseData.evidence.find((e) => e.id === eid))
    .filter((e): e is Evidence => e !== undefined);
}

export function locationDiscoveryProgress(
  caseData: Case,
  locationId: LocationId,
  discoveredEvidenceIds: Set<EvidenceId>,
): { found: number; total: number } {
  const loc = caseData.locations.find((l) => l.id === locationId);
  if (!loc) return { found: 0, total: 0 };
  const found = loc.evidenceIds.filter((eid) => discoveredEvidenceIds.has(eid)).length;
  return { found, total: loc.evidenceIds.length };
}

// ─── Evidence Queries ─────────────────────────────────────────────────────────

export type EvidenceStatus = 'undiscovered' | 'discovered' | 'inspected';

export function getEvidenceStatus(
  evidenceId: EvidenceId,
  discoveredEvidenceIds: Set<EvidenceId>,
  inspectedEvidenceIds: Set<EvidenceId>,
): EvidenceStatus {
  if (inspectedEvidenceIds.has(evidenceId)) return 'inspected';
  if (discoveredEvidenceIds.has(evidenceId)) return 'discovered';
  return 'undiscovered';
}

export function getDiscoveredEvidence(
  caseData: Case,
  discoveredEvidenceIds: Set<EvidenceId>,
): Evidence[] {
  return caseData.evidence.filter((e) => discoveredEvidenceIds.has(e.id));
}

export function getRelatedEvidence(
  caseData: Case,
  evidenceId: EvidenceId,
  discoveredEvidenceIds: Set<EvidenceId>,
): Evidence[] {
  const ev = caseData.evidence.find((e) => e.id === evidenceId);
  if (!ev) return [];
  return ev.relatedEvidenceIds
    .filter((eid) => discoveredEvidenceIds.has(eid))
    .map((eid) => caseData.evidence.find((e) => e.id === eid))
    .filter((e): e is Evidence => e !== undefined);
}

export function getEvidenceSuspects(
  caseData: Case,
  evidenceId: EvidenceId,
): Suspect[] {
  const ev = caseData.evidence.find((e) => e.id === evidenceId);
  if (!ev) return [];
  return ev.relatedSuspectIds
    .map((sid) => caseData.suspects.find((s) => s.id === sid))
    .filter((s): s is Suspect => s !== undefined);
}

// ─── Suspect Queries ──────────────────────────────────────────────────────────

export interface KnownSuspectInfo {
  suspect: Suspect;
  isInterviewed: boolean;
  questionCount: number;
  linkedEvidenceIds: EvidenceId[];
  interviewHistory: InterviewEntry[];
  hasContradiction: boolean;
}

export function getKnownSuspectInfo(
  caseData: Case,
  suspectId: SuspectId,
  discoveredEvidenceIds: Set<EvidenceId>,
  interviewedSuspectIds: Set<SuspectId>,
  interviews: InterviewEntry[],
): KnownSuspectInfo | null {
  const suspect = caseData.suspects.find((s) => s.id === suspectId);
  if (!suspect) return null;

  const linkedEvidenceIds = suspect.relatedEvidenceIds.filter((eid) =>
    discoveredEvidenceIds.has(eid),
  );

  const interviewHistory = interviews.filter((i) => i.suspectId === suspectId);

  const hasContradiction = caseData.timeline.some(
    (event) =>
      event.isContradiction &&
      event.contradictsSuspectId === suspectId &&
      event.evidenceIds.some((eid) => discoveredEvidenceIds.has(eid)),
  );

  return {
    suspect,
    isInterviewed: interviewedSuspectIds.has(suspectId),
    questionCount: interviewHistory.length,
    linkedEvidenceIds,
    interviewHistory,
    hasContradiction,
  };
}

// ─── Timeline Queries ─────────────────────────────────────────────────────────

export function isTimelineEventVisible(
  event: Case['timeline'][number],
  discoveredEvidenceIds: Set<EvidenceId>,
  interviewedSuspectIds: Set<SuspectId>,
): boolean {
  if (event.alwaysVisible) return true;
  if (event.evidenceIds.some((eid) => discoveredEvidenceIds.has(eid))) return true;
  if (event.suspectIds.some((sid) => interviewedSuspectIds.has(sid))) return true;
  return false;
}

export function getVisibleTimelineEvents(
  caseData: Case,
  discoveredEvidenceIds: Set<EvidenceId>,
  interviewedSuspectIds: Set<SuspectId>,
): Case['timeline'] {
  return caseData.timeline.filter((event) =>
    isTimelineEventVisible(event, discoveredEvidenceIds, interviewedSuspectIds),
  );
}

// ─── Case Board Queries ───────────────────────────────────────────────────────

export function connectionExists(
  connections: BoardConnection[],
  fromId: string,
  toId: string,
): boolean {
  return connections.some(
    (c) =>
      (c.fromId === fromId && c.toId === toId) ||
      (c.fromId === toId && c.toId === fromId),
  );
}

// ─── Overall Progress ─────────────────────────────────────────────────────────

export function getInvestigationProgress(
  caseData: Case,
  visitedLocationIds: Set<LocationId>,
  discoveredEvidenceIds: Set<EvidenceId>,
  inspectedEvidenceIds: Set<EvidenceId>,
  interviewedSuspectIds: Set<SuspectId>,
): InvestigationProgress {
  const timelineVisible = getVisibleTimelineEvents(
    caseData,
    discoveredEvidenceIds,
    interviewedSuspectIds,
  );

  const contradictionsFound = caseData.timeline.filter(
    (e) =>
      e.isContradiction &&
      e.evidenceIds.some((eid) => discoveredEvidenceIds.has(eid)),
  ).length;

  const lv = visitedLocationIds.size;
  const lt = caseData.locations.length;
  const ed = discoveredEvidenceIds.size;
  const et = caseData.evidence.length;
  const ei = inspectedEvidenceIds.size;
  const si = interviewedSuspectIds.size;
  const st = caseData.suspects.length;

  const completionPercent = Math.round(
    ((lv / lt + ed / et + ei / et + si / st) / 4) * 100,
  );

  return {
    locationsVisited: lv,
    locationsTotal: lt,
    evidenceDiscovered: ed,
    evidenceTotal: et,
    evidenceInspected: ei,
    suspectsInterviewed: si,
    suspectsTotal: st,
    timelineEventsVisible: timelineVisible.length,
    timelineEventsTotal: caseData.timeline.length,
    contradictionsFound,
    completionPercent,
  };
}

// ─── Agent Recommendation & Assistant Guidance Logic ──────────────────────────

export function getAgentRecommendation(
  caseData: Case,
  discoveredEvidenceIds: Set<EvidenceId>,
  inspectedEvidenceIds: Set<EvidenceId>,
  interviewedSuspectIds: Set<SuspectId>,
): AgentRecommendation {
  const discoveredEv = caseData.evidence.filter((e) => discoveredEvidenceIds.has(e.id));
  const discoveredCount = discoveredEv.length;
  const totalCount = caseData.evidence.length;
  const ratio = totalCount > 0 ? discoveredCount / totalCount : 0;

  // Check for discovered timeline contradictions
  const contradictionEvent = caseData.timeline.find(
    (e) => e.isContradiction && e.evidenceIds.some((eid) => discoveredEvidenceIds.has(eid)),
  );

  let confidence: 'Low' | 'Moderate' | 'High' | 'Conclusive' = 'Low';
  let percentage = 35;

  if (ratio >= 0.75) {
    confidence = 'Conclusive';
    percentage = 92;
  } else if (ratio >= 0.5) {
    confidence = 'High';
    percentage = 78;
  } else if (ratio >= 0.25) {
    confidence = 'Moderate';
    percentage = 55;
  } else {
    confidence = 'Low';
    percentage = 35;
  }

  // Supporting evidence titles (only discovered items)
  const supportingNames = discoveredEv.slice(0, 6).map((e) => e.name);

  // Formulate investigative guidance strictly based on discovered clues
  let reasoning = '';
  if (contradictionEvent) {
    reasoning = `Discovered evidence indicates a significant discrepancy: "${contradictionEvent.description}". Compare location access logs and physical receipts with suspect statements to evaluate opportunity.`;
  } else if (ratio >= 0.5) {
    reasoning = `Multiple physical clues have been discovered across case locations. Examine the timeline for gaps or unmonitored intervals, and cross-reference purchase receipts against access records in your Deduction Workspace.`;
  } else if (ratio >= 0.25) {
    reasoning = `Preliminary observations gathered. Focus on searching unexplored locations and interviewing remaining persons of interest to establish timeline and access opportunity.`;
  } else {
    reasoning = `Initial stage: Explore all case locations, inspect physical evidence, and question persons of interest to build your observation framework.`;
  }

  let contradictionSummary = undefined;
  if (contradictionEvent) {
    contradictionSummary = contradictionEvent.description;
  }

  return {
    suspectId: 'suspects-under-review',
    suspectName: 'Persons of Interest Under Review',
    confidence,
    confidencePercentage: percentage,
    reasoning,
    supportingEvidenceIds: discoveredEv.map((e) => e.id),
    supportingEvidenceNames: supportingNames.length > 0 ? supportingNames : ['Initial investigation clues'],
    contradictionSummary,
    recommendedAction:
      'Review discovered clues, connect evidence, and test hypotheses in your Deduction Workspace. The human detective retains final conclusion authority.',
  };
}

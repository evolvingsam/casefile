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
} from '@/game/types';

// ─── Location Queries ─────────────────────────────────────────────────────────

/** Return all evidence discoverable from a location. */
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

/** Count how many of a location's evidence items have been discovered. */
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

/** Determine the display status of a piece of evidence. */
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

/** Return all discovered evidence objects, sorted by location order. */
export function getDiscoveredEvidence(
  caseData: Case,
  discoveredEvidenceIds: Set<EvidenceId>,
): Evidence[] {
  return caseData.evidence.filter((e) => discoveredEvidenceIds.has(e.id));
}

/** Return evidence items related to a given piece of evidence (discovered only). */
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

/** Return suspects linked to a piece of evidence (already known to the player). */
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

/**
 * Build a "known facts" summary for a suspect, given current investigation state.
 * Only surfaces information the player has legitimately earned.
 */
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

  // A contradiction exists when: we've discovered evidence that contradicts their timeline event
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

/** Return all suspects that have been linked to discovered evidence. */
export function getSuspectsWithEvidence(
  caseData: Case,
  discoveredEvidenceIds: Set<EvidenceId>,
): Suspect[] {
  return caseData.suspects.filter((s) =>
    s.relatedEvidenceIds.some((eid) => discoveredEvidenceIds.has(eid)),
  );
}

// ─── Timeline Queries ─────────────────────────────────────────────────────────

/**
 * A timeline event is visible when:
 * - It is marked `alwaysVisible`, OR
 * - Any of its related evidence has been discovered, OR
 * - Any of its related suspects has been interviewed
 */
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

/** Check whether a specific connection already exists. */
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

/** Get all connections involving a given node (evidence or suspect). */
export function getNodeConnections(
  connections: BoardConnection[],
  nodeId: string,
): BoardConnection[] {
  return connections.filter((c) => c.fromId === nodeId || c.toId === nodeId);
}

// ─── Overall Progress ─────────────────────────────────────────────────────────

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

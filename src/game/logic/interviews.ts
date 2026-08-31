/**
 * interviews.ts
 *
 * Pure interview logic — deterministic question availability and response lookup.
 * No React, no store.
 */

import type {
  Case,
  Suspect,
  SuspectId,
  EvidenceId,
  InterviewQuestion,
  InterviewEntry,
} from '@/game/types';

// ─── Question Availability ────────────────────────────────────────────────────

/**
 * Returns the questions available to the player for a given suspect.
 *
 * A question is available when:
 * - It has no `requiresEvidenceIds` (always available), OR
 * - All evidence IDs in `requiresEvidenceIds` have been discovered
 *
 * A question is exhausted when it has already been asked in this session.
 */
export interface QuestionAvailability {
  question: InterviewQuestion;
  isAvailable: boolean;
  isAsked: boolean;
  /** When locked: the first undiscovered evidence ID blocking this question */
  blockedByEvidenceId?: EvidenceId;
}

export function getQuestionAvailability(
  suspect: Suspect,
  discoveredEvidenceIds: Set<EvidenceId>,
  interviews: InterviewEntry[],
): QuestionAvailability[] {
  const askedQuestionIds = new Set(
    interviews.filter((i) => i.suspectId === suspect.id).map((i) => i.questionId),
  );

  return suspect.interviewResponses.map((q) => {
    const isAsked = askedQuestionIds.has(q.id);
    const required = q.requiresEvidenceIds ?? [];
    const firstMissing = required.find((eid) => !discoveredEvidenceIds.has(eid));
    const isAvailable = firstMissing === undefined;

    return {
      question: q,
      isAvailable,
      isAsked,
      blockedByEvidenceId: firstMissing,
    };
  });
}

// ─── Interview Lookup ─────────────────────────────────────────────────────────

/** Find the deterministic response for a given question ID on a given suspect. */
export function getInterviewResponse(
  caseData: Case,
  suspectId: SuspectId,
  questionId: string,
): InterviewQuestion | null {
  const suspect = caseData.suspects.find((s) => s.id === suspectId);
  if (!suspect) return null;
  return suspect.interviewResponses.find((q) => q.id === questionId) ?? null;
}

/** Return all interview entries for a specific suspect, ordered by timestamp. */
export function getSuspectInterviewHistory(
  interviews: InterviewEntry[],
  suspectId: SuspectId,
): InterviewEntry[] {
  return interviews
    .filter((i) => i.suspectId === suspectId)
    .sort((a, b) => a.timestamp - b.timestamp);
}

/** Return all suspects that have at least one interview entry. */
export function getInterviewedSuspectIds(
  interviews: InterviewEntry[],
): Set<SuspectId> {
  return new Set(interviews.map((i) => i.suspectId));
}

// ─── Interview Entry Builder ──────────────────────────────────────────────────

/** Build a complete InterviewEntry from a suspect + question (deterministic). */
export function buildInterviewEntry(
  suspectId: SuspectId,
  question: InterviewQuestion,
): Omit<InterviewEntry, 'id'> {
  return {
    suspectId,
    questionId: question.id,
    question: question.question,
    response: question.answer,
    timestamp: Date.now(),
  };
}

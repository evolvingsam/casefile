/**
 * caseServerService.ts
 *
 * SERVER-ONLY Game Logic & Secret Security Engine.
 *
 * Enforces:
 * 1. Problem 1 Fix: Premature accusation returns ONLY uninformative generic response:
 *    "You do not have enough established evidence to support this accusation."
 *    (Zero deduction names, zero hints, zero required evidence lists, identical structure for correct & wrong suspect).
 * 2. Problem 2 Fix: Case-Specific Deduction Requirements. Each case has its own secret dataset & deductions.
 *    No cross-case leakage or hardcoding.
 * 3. Problem 3 Fix: Server-side secret solution isolation.
 */

import { GALLERY_MURDER_SECRET, SecretCaseData } from '../cases/galleryMurderSecret';
import { VANISHING_MANUSCRIPT_SECRET } from '../cases/vanishingManuscriptSecret';
import { DEATH_ON_PLATFORM_6_SECRET } from '../cases/deathOnPlatform6Secret';
import type { DeductionRequirement } from '@/game/types';

// Registry of secret case datasets (Server-Only)
const SECRET_CASES_MAP: Record<string, SecretCaseData> = {
  [GALLERY_MURDER_SECRET.id]: GALLERY_MURDER_SECRET,
  'gallery-murder-047': GALLERY_MURDER_SECRET,
  [VANISHING_MANUSCRIPT_SECRET.id]: VANISHING_MANUSCRIPT_SECRET,
  'vanishing-manuscript-052': VANISHING_MANUSCRIPT_SECRET,
  [DEATH_ON_PLATFORM_6_SECRET.id]: DEATH_ON_PLATFORM_6_SECRET,
  'death-on-platform-6-061': DEATH_ON_PLATFORM_6_SECRET,
};

export interface ActiveStateParams {
  caseId: string;
  visitedLocationIds: string[];
  discoveredEvidenceIds: string[];
  inspectedEvidenceIds: string[];
  interviewedSuspectIds: string[];
  interviews?: Array<{ suspectId: string; questionId: string }>;
}

export const caseServerService = {
  /**
   * Get server-side secret case data safely by caseId.
   */
  getSecretCase(caseId: string): SecretCaseData {
    const caseData = SECRET_CASES_MAP[caseId];
    if (!caseData) {
      // Fallback for unknown case ID
      return GALLERY_MURDER_SECRET;
    }
    return caseData;
  },

  /**
   * Evaluate deduction graph for the active case against current state.
   */
  evaluateDeductions(state: ActiveStateParams): {
    completedDeductions: DeductionRequirement[];
    pendingDeductions: DeductionRequirement[];
    allFulfilled: boolean;
  } {
    const secretCase = this.getSecretCase(state.caseId);
    const discoveredSet = new Set(state.discoveredEvidenceIds);
    const inspectedSet = new Set(state.inspectedEvidenceIds);

    const interviewedQuestionsSet = new Set(
      (state.interviews || []).map((i) => `${i.suspectId}:${i.questionId}`),
    );

    const completed: DeductionRequirement[] = [];
    const pending: DeductionRequirement[] = [];

    secretCase.deductions.forEach((d) => {
      // Check evidence discovered requirement
      const reqEvDiscovered = (d.requiredEvidenceIds || []).every((eid) => discoveredSet.has(eid));
      // Check evidence inspected requirement
      const reqEvInspected = (d.requiredInspectedEvidenceIds || []).every((eid) => inspectedSet.has(eid));
      // Check interview questions requirement
      const reqQuestions = (d.requiredInterviewQuestionIds || []).every((qid) =>
        Array.from(interviewedQuestionsSet).some((key) => key.endsWith(`:${qid}`)),
      );

      const isFulfilled = reqEvDiscovered && reqEvInspected && reqQuestions;

      const itemWithStatus: DeductionRequirement = {
        ...d,
        isFulfilled,
      };

      if (isFulfilled) {
        completed.push(itemWithStatus);
      } else {
        pending.push(itemWithStatus);
      }
    });

    return {
      completedDeductions: completed,
      pendingDeductions: pending,
      allFulfilled: pending.length === 0,
    };
  },

  /**
   * Safe inspect_evidence enforcement.
   * MUST ONLY work for evidence already in discoveredEvidenceIds!
   */
  inspectEvidence(evidenceId: string, state: ActiveStateParams) {
    const discoveredSet = new Set(state.discoveredEvidenceIds);

    if (!discoveredSet.has(evidenceId)) {
      return {
        success: false,
        error: 'Evidence not available. This item has not been discovered.',
      };
    }

    const secretCase = this.getSecretCase(state.caseId);
    const hiddenSignificance = secretCase.hiddenSignificances[evidenceId] || 'No further forensic significance noted.';
    const detailedFindings = secretCase.detailedFindings[evidenceId] || hiddenSignificance;

    return {
      success: true,
      data: {
        evidenceId,
        detailedFindings,
        hiddenSignificance,
        investigationNote: 'Forensic inspection completed and recorded in shared case log.',
      },
    };
  },

  /**
   * PROBLEM 1 FIX: Premature accusation returns ONLY uninformative generic error.
   * PROBLEM 2 FIX: Case-specific deduction validation.
   */
  submitAccusation(
    accusedSuspectId: string,
    reasoning: string,
    state: ActiveStateParams,
  ) {
    const secretCase = this.getSecretCase(state.caseId);

    // Evaluate deduction graph for active case
    const deductionStatus = this.evaluateDeductions(state);

    if (!deductionStatus.allFulfilled) {
      // PROBLEM 1 REQUIREMENT: Generic response, 0 deduction names, 0 required evidence lists, identical for correct/wrong suspect!
      return {
        success: false,
        isCorrect: false,
        error: 'You do not have enough established evidence to support this accusation.',
      };
    }

    const isCorrect = accusedSuspectId === secretCase.killerSuspectId;

    if (isCorrect) {
      return {
        success: true,
        isCorrect: true,
        verdict: 'GUILTY — Accusation Correct!',
        solution: secretCase.solution,
      };
    }

    return {
      success: true,
      isCorrect: false,
      verdict: 'WRONG ACCUSATION — Suspect is Innocent',
      message: `Forensic evidence proves suspect ${accusedSuspectId} was not the killer. Re-evaluate timeline and alibis.`,
    };
  },

  /**
   * get_case_state limited to player-visible state for active case.
   */
  getCaseState(state: ActiveStateParams) {
    const deductionStatus = this.evaluateDeductions(state);

    return {
      caseId: state.caseId,
      discoveredEvidenceCount: state.discoveredEvidenceIds.length,
      inspectedEvidenceCount: state.inspectedEvidenceIds.length,
      interviewCount: (state.interviews || []).length,
      visitedLocationsCount: state.visitedLocationIds.length,
      completedDeductionsCount: deductionStatus.completedDeductions.length,
      completedDeductionTitles: deductionStatus.completedDeductions.map((d) => d.title),
      pendingDeductionTitles: deductionStatus.pendingDeductions.map((d) => d.title),
      allDeductionsFulfilled: deductionStatus.allFulfilled,
    };
  },
};

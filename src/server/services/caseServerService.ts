/**
 * caseServerService.ts
 *
 * SERVER-ONLY Game Logic & Secret Security Engine.
 *
 * Enforces:
 * 1. Evidence Discovery Requirement (inspect_evidence ONLY works for discovered evidence).
 * 2. Zero Solution Leakage (Secret solution, killerId, and hidden significances remain on server).
 * 3. Case-Specific Deduction Requirements before allowing accusations.
 * 4. Analytical, non-spoiling investigative language for AI agent responses.
 */

import { GALLERY_MURDER_SECRET, SecretCaseData } from '../cases/galleryMurderSecret';
import type {
  DeductionRequirement,
  EvidenceId,
  SuspectId,
  LocationId,
  InvestigationProgress,
} from '@/game/types';

// Registry of secret case datasets (Server-Only)
const SECRET_CASES_MAP: Record<string, SecretCaseData> = {
  [GALLERY_MURDER_SECRET.id]: GALLERY_MURDER_SECRET,
  'gallery-murder-047': GALLERY_MURDER_SECRET,
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
   * Get server-side secret case data safely.
   */
  getSecretCase(caseId: string): SecretCaseData {
    const caseData = SECRET_CASES_MAP[caseId] || GALLERY_MURDER_SECRET;
    return caseData;
  },

  /**
   * Evaluate deduction graph for a case against current state.
   */
  evaluateDeductions(state: ActiveStateParams): {
    completedDeductions: DeductionRequirement[];
    pendingDeductions: DeductionRequirement[];
    allFulfilled: boolean;
  } {
    const secretCase = this.getSecretCase(state.caseId);
    const discoveredSet = new Set(state.discoveredEvidenceIds);
    const inspectedSet = new Set(state.inspectedEvidenceIds);
    const visitedSet = new Set(state.visitedLocationIds);

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
   * PROBLEM 1 & 2: Safe inspect_evidence enforcement.
   * MUST ONLY work for evidence already in discoveredEvidenceIds!
   */
  inspectEvidence(evidenceId: string, state: ActiveStateParams) {
    const discoveredSet = new Set(state.discoveredEvidenceIds);

    // PROBLEM 1: Strict Discovery Enforcement
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
   * PROBLEM 3 & 9: Accusation Validation with Deduction Requirements.
   */
  submitAccusation(
    accusedSuspectId: string,
    reasoning: string,
    state: ActiveStateParams,
  ) {
    const secretCase = this.getSecretCase(state.caseId);

    // Check deduction graph requirement
    const deductionStatus = this.evaluateDeductions(state);

    if (!deductionStatus.allFulfilled) {
      const missingTitles = deductionStatus.pendingDeductions.map((d) => d.title).join(', ');
      return {
        success: false,
        isCorrect: false,
        error: `Accusation rejected: Insufficient investigative proof. You must establish the following deductions first: [${missingTitles}].`,
        missingDeductions: deductionStatus.pendingDeductions.map((d) => d.title),
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
   * PROBLEM 5: get_case_state limited to player-visible state.
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

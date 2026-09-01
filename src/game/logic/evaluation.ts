import type { Case, AccusationSubmission, AccusationEvaluation, CaseSolution } from '@/game/types';
import { GALLERY_MURDER_SECRET } from '@/server/cases/galleryMurderSecret';

/**
 * Evaluates a player's complete theory accusation against the case's hidden solution.
 * Uses a partial scoring system (100 pts total):
 *   - Perpetrator : 30 pts
 *   - Method      : 20 pts
 *   - Motive      : 20 pts
 *   - Timeline    : 15 pts
 *   - Evidence    : 15 pts
 *
 * Total >= 80 required to pass and unlock the full solution comparison.
 * Failed submissions (< 80) output targeted spoil-free feedback without leaking the solution.
 */
export function evaluateAccusation(
  caseData: Case,
  submission: AccusationSubmission,
  secretSolution?: CaseSolution,
): AccusationEvaluation {
  const solution: CaseSolution = secretSolution || caseData.solution || GALLERY_MURDER_SECRET.solution;
  const accusedSuspect = caseData.suspects.find((s) => s.id === submission.suspectId);
  const actualKillerName = 'Victoria Adeyemi';

  const subMethod = submission.method || '';
  const subMotive = submission.motive || '';
  const subTime = submission.approximateTime || '';
  const subExplanation = submission.explanation || subMethod + ' ' + subMotive;

  // 1. Perpetrator Scoring (30 points)
  const isPerpetratorCorrect = submission.suspectId === solution.killerId;
  const perpetratorScore = isPerpetratorCorrect ? 30 : 0;

  // 2. Method Scoring (20 points)
  const methodLower = (subMethod + ' ' + subExplanation).toLowerCase();
  const solutionMethodLower = solution.method.toLowerCase();

  let methodHits = 0;
  const methodTerms = [
    'cyanide',
    'poison',
    'whiskey',
    'tumbler',
    'keycard',
    'cctv',
    'bribe',
  ];
  methodTerms.forEach((term) => {
    if (methodLower.includes(term) && solutionMethodLower.includes(term)) {
      methodHits++;
    }
  });

  let methodScore = 0;
  let methodRating: 'Correct' | 'Partial' | 'Incorrect' = 'Incorrect';
  if (methodHits >= 2 || (methodHits >= 1 && subMethod.length > 15)) {
    methodScore = 20;
    methodRating = 'Correct';
  } else if (methodHits >= 1 || subMethod.length > 5) {
    methodScore = 10;
    methodRating = 'Partial';
  }

  // 3. Motive Scoring (20 points)
  const motiveLower = (subMotive + ' ' + subExplanation).toLowerCase();
  const solutionMotiveLower = solution.motive.toLowerCase();

  let motiveHits = 0;
  const motiveTerms = ['divorce', 'will', 'estate', 'daughter', 'marriage', 'money', 'inheritance'];
  motiveTerms.forEach((term) => {
    if (motiveLower.includes(term) && solutionMotiveLower.includes(term)) {
      motiveHits++;
    }
  });

  let motiveScore = 0;
  let motiveRating: 'Correct' | 'Partial' | 'Incorrect' = 'Incorrect';
  if (motiveHits >= 2 || (motiveHits >= 1 && subMotive.length > 15)) {
    motiveScore = 20;
    motiveRating = 'Correct';
  } else if (motiveHits >= 1 || subMotive.length > 5) {
    motiveScore = 10;
    motiveRating = 'Partial';
  }

  // 4. Timeline Scoring (15 points)
  let timelineScore = 0;
  let timelineRating: 'Correct' | 'Partial' | 'Incorrect' = 'Incorrect';
  const timeLower = (subTime + ' ' + subExplanation).toLowerCase();

  if (timeLower.includes('10:19') || timeLower.includes('10:15') || timeLower.includes('10:30') || timeLower.includes('10:45')) {
    timelineScore = 15;
    timelineRating = 'Correct';
  } else if (subTime.length > 2) {
    timelineScore = 8;
    timelineRating = 'Partial';
  }

  // 5. Supporting Evidence Scoring (15 points)
  const keyEvidenceSet = new Set(solution.keyEvidenceIds);
  const submittedSet = new Set(submission.supportingEvidenceIds);

  let keyMatches = 0;
  const evidenceNames: string[] = [];
  submittedSet.forEach((eid) => {
    const ev = caseData.evidence.find((e) => e.id === eid);
    if (ev) evidenceNames.push(ev.name);
    if (keyEvidenceSet.has(eid)) keyMatches++;
  });

  let evidenceScore = 0;
  let evidenceRating: 'Correct' | 'Partial' | 'Incorrect' = 'Incorrect';
  if (keyMatches >= 3) {
    evidenceScore = 15;
    evidenceRating = 'Correct';
  } else if (keyMatches >= 1) {
    evidenceScore = 8;
    evidenceRating = 'Partial';
  }

  const totalScore = perpetratorScore + methodScore + motiveScore + timelineScore + evidenceScore;
  const passedThreshold = totalScore >= 80;

  const feedbackLines: string[] = [];
  if (!isPerpetratorCorrect) {
    feedbackLines.push('Perpetrator: The evidence does not point to this suspect as the primary actor.');
  } else {
    feedbackLines.push('Perpetrator: Correct suspect identified.');
  }

  if (methodRating === 'Incorrect') {
    feedbackLines.push('Method: Re-examine physical evidence for the mechanism of death.');
  }
  if (motiveRating === 'Incorrect') {
    feedbackLines.push('Motive: Review financial and legal documents for the killer\'s true incentive.');
  }
  if (timelineRating === 'Incorrect') {
    feedbackLines.push('Timeline: Cross-reference electronic access logs against stated arrival times.');
  }

  const keyEvidenceNames = solution.keyEvidenceIds
    .map((eid) => caseData.evidence.find((e) => e.id === eid)?.name ?? eid);

  return {
    passedThreshold,
    totalScore,
    perpetratorScore,
    methodScore,
    motiveScore,
    timelineScore,
    evidenceScore,
    elementBreakdown: {
      perpetrator: isPerpetratorCorrect ? 'Correct' : 'Incorrect',
      method: methodRating,
      motive: motiveRating,
      timeline: timelineRating,
      evidence: evidenceRating,
    },
    feedbackLines,
    comparison: {
      playerTheory: {
        suspectName: accusedSuspect?.name ?? submission.suspectId,
        method: subMethod || subExplanation.slice(0, 60),
        motive: subMotive || subExplanation.slice(0, 60),
        timeline: subTime || '10:30 PM',
        explanation: subExplanation,
        evidenceNames,
      },
      actualSolution: {
        killerName: passedThreshold ? actualKillerName : '???',
        method: passedThreshold ? solution.method : '???',
        motive: passedThreshold ? solution.motive : '???',
        opportunity: passedThreshold ? solution.opportunity : '???',
        explanation: passedThreshold ? solution.fullExplanation : '???',
        keyEvidenceNames: passedThreshold ? keyEvidenceNames : [],
      },
    },
  };
}

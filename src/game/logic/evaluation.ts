import type { Case, AccusationSubmission, AccusationEvaluation } from '@/game/types';

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
): AccusationEvaluation {
  const solution = caseData.solution;
  const accusedSuspect = caseData.suspects.find((s) => s.id === submission.suspectId);
  const actualKiller = caseData.suspects.find((s) => s.id === solution.killerId);

  // 1. Perpetrator Scoring (30 points)
  const isPerpetratorCorrect = submission.suspectId === solution.killerId;
  const perpetratorScore = isPerpetratorCorrect ? 30 : 0;

  // 2. Method Scoring (20 points)
  const methodLower = (submission.method + ' ' + submission.explanation).toLowerCase();
  const solutionMethodLower = solution.method.toLowerCase();

  let methodHits = 0;
  const methodTerms = [
    'substitut',
    'duplicate',
    'key',
    'blackout',
    'outage',
    'poison',
    'thermos',
    'swap',
    'cctv',
    'digitizer',
    'curtain',
    'revolver',
  ];
  methodTerms.forEach((term) => {
    if (methodLower.includes(term) && solutionMethodLower.includes(term)) {
      methodHits++;
    }
  });

  let methodScore = 0;
  let methodRating: 'Correct' | 'Partial' | 'Incorrect' = 'Incorrect';
  if (methodHits >= 3 || (methodHits >= 1 && submission.method.length > 20)) {
    methodScore = 20;
    methodRating = 'Correct';
  } else if (methodHits >= 1 || submission.method.length > 10) {
    methodScore = 10;
    methodRating = 'Partial';
  }

  // 3. Motive Scoring (20 points)
  const motiveLower = (submission.motive + ' ' + submission.explanation).toLowerCase();
  const solutionMotiveLower = solution.motive.toLowerCase();

  let motiveHits = 0;
  const motiveTerms = [
    'buyout',
    'patent',
    'restructur',
    'manuscript',
    'money',
    'publish',
    'financial',
    'insurance',
    'debt',
    'fame',
    'rival',
    'art',
    'gallery',
  ];
  motiveTerms.forEach((term) => {
    if (motiveLower.includes(term) && solutionMotiveLower.includes(term)) {
      motiveHits++;
    }
  });

  let motiveScore = 0;
  let motiveRating: 'Correct' | 'Partial' | 'Incorrect' = 'Incorrect';
  if (motiveHits >= 2 || (motiveHits >= 1 && submission.motive.length > 20)) {
    motiveScore = 20;
    motiveRating = 'Correct';
  } else if (motiveHits >= 1 || submission.motive.length > 10) {
    motiveScore = 10;
    motiveRating = 'Partial';
  }

  // 4. Timeline Scoring (15 points)
  const timelineLower = (submission.approximateTime + ' ' + submission.explanation).toLowerCase();
  let timelineScore = 0;
  let timelineRating: 'Correct' | 'Partial' | 'Incorrect' = 'Incorrect';

  if (caseData.id === 'death-on-platform-6-061') {
    if (
      timelineLower.includes('6:44') ||
      timelineLower.includes('6:42') ||
      timelineLower.includes('6:45') ||
      timelineLower.includes('blackout') ||
      timelineLower.includes('6:50')
    ) {
      timelineScore = 15;
      timelineRating = 'Correct';
    } else if (timelineLower.includes('6:') || timelineLower.includes('7:')) {
      timelineScore = 8;
      timelineRating = 'Partial';
    }
  } else if (caseData.id === 'vanishing-manuscript-052') {
    if (
      timelineLower.includes('10:12') ||
      timelineLower.includes('10:15') ||
      timelineLower.includes('blackout') ||
      timelineLower.includes('10:10')
    ) {
      timelineScore = 15;
      timelineRating = 'Correct';
    } else if (timelineLower.includes('10:')) {
      timelineScore = 8;
      timelineRating = 'Partial';
    }
  } else {
    // Case #047
    if (
      timelineLower.includes('8:15') ||
      timelineLower.includes('8:20') ||
      timelineLower.includes('gala') ||
      timelineLower.includes('8:')
    ) {
      timelineScore = 15;
      timelineRating = 'Correct';
    } else {
      timelineScore = 8;
      timelineRating = 'Partial';
    }
  }

  // 5. Evidence/Reasoning Scoring (15 points)
  const keyClues = solution.keyEvidenceIds;
  const providedKeyClues = keyClues.filter((id) => submission.supportingEvidenceIds.includes(id));
  const evidenceRatio = keyClues.length > 0 ? providedKeyClues.length / keyClues.length : 0;
  const evidenceScore = Math.round(evidenceRatio * 15);
  const evidenceRating: 'Strong' | 'Moderate' | 'Weak' =
    evidenceScore >= 12 ? 'Strong' : evidenceScore >= 6 ? 'Moderate' : 'Weak';

  const totalScore = perpetratorScore + methodScore + motiveScore + timelineScore + evidenceScore;
  const passedThreshold = totalScore >= 80;

  // Generate Targeted Spoil-Free Feedback Lines
  const feedbackLines: string[] = [];

  if (!isPerpetratorCorrect) {
    feedbackLines.push(
      '• Accusation Target: The accused suspect does not match physical evidence or entry logs.',
    );
  } else {
    feedbackLines.push(
      `• Accusation Target: Correctly identified ${accusedSuspect?.name ?? 'the perpetrator'}.`,
    );
  }

  if (methodRating === 'Incorrect') {
    feedbackLines.push(
      '• Method & Mechanism: The proposed method does not account for how physical access, key duplication, or container substitution occurred.',
    );
  } else if (methodRating === 'Partial') {
    feedbackLines.push(
      '• Method & Mechanism: The proposed method is partially plausible, but missing key physical execution details.',
    );
  }

  if (motiveRating === 'Incorrect') {
    feedbackLines.push(
      '• Motive & Drive: The proposed motive conflicts with legal, financial, or contract documents discovered.',
    );
  } else if (motiveRating === 'Partial') {
    feedbackLines.push(
      '• Motive & Drive: Motive identified, but lacks backing from financial or contractual records.',
    );
  }

  if (timelineRating === 'Incorrect') {
    feedbackLines.push(
      '• Timeline Window: The proposed timeline conflicts with electronic keycard logs and recorded blackout windows.',
    );
  } else if (timelineRating === 'Partial') {
    feedbackLines.push(
      '• Timeline Window: The timeframe is close, but does not match the exact electronic swipe timestamp.',
    );
  }

  if (evidenceRating === 'Weak') {
    feedbackLines.push(
      '• Supporting Evidence: Critical physical clues were omitted from your theory. Gather more evidence before resubmitting.',
    );
  } else if (evidenceRating === 'Moderate') {
    feedbackLines.push(
      '• Supporting Evidence: Moderate clue support. Link additional corroborating evidence items in your Deduction Workspace.',
    );
  }

  // Construct Side-by-Side Comparison ONLY if passedThreshold is true!
  let comparison: AccusationEvaluation['comparison'] = undefined;

  if (passedThreshold) {
    const playerEvidenceNames = submission.supportingEvidenceIds
      .map((id) => caseData.evidence.find((e) => e.id === id)?.name)
      .filter((n): n is string => n !== undefined);

    const actualKeyEvidenceNames = solution.keyEvidenceIds
      .map((id) => caseData.evidence.find((e) => e.id === id)?.name)
      .filter((n): n is string => n !== undefined);

    comparison = {
      playerTheory: {
        suspectName: accusedSuspect?.name ?? 'Unknown Suspect',
        method: submission.method,
        motive: submission.motive,
        timeline: submission.approximateTime,
        explanation: submission.explanation,
        evidenceNames: playerEvidenceNames,
      },
      actualSolution: {
        killerName: actualKiller?.name ?? 'Actual Perpetrator',
        method: solution.method,
        motive: solution.motive,
        opportunity: solution.opportunity,
        explanation: solution.fullExplanation,
        keyEvidenceNames: actualKeyEvidenceNames,
      },
    };
  }

  return {
    totalScore,
    passedThreshold,
    perpetratorScore,
    methodScore,
    motiveScore,
    timelineScore,
    evidenceScore,
    feedbackLines,
    elementBreakdown: {
      perpetratorCorrect: isPerpetratorCorrect,
      methodRating,
      motiveRating,
      timelineRating,
      evidenceRating,
    },
    comparison,
  };
}

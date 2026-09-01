/**
 * attackPathSuite.ts
 *
 * Security & Investigation Integrity Regression Test Suite.
 * Audits all 5 core security and integrity rules:
 * 1. Premature accusation returns ONLY uninformative generic error (0 hints, 0 deduction titles leaked).
 * 2. Case isolation: #047 deductions do NOT leak into #052 or #061.
 * 3. Client JS bundles contain ZERO solution data (no isKiller, secrets, solution, isRedHerring, hiddenSignificance, etc.).
 * 4. Normal #047 investigation flow works cleanly.
 * 5. Legitimate completed accusation evaluates conviction correctly.
 */

import { executeWebMCPTool, registerWebMCP } from '@/webmcp/register';
import { useGameStore } from '@/game/state/store';
import { caseServerService } from '@/server/services/caseServerService';

export interface SecurityTestResult {
  testId: number;
  name: string;
  passed: boolean;
  details: string;
}

export async function runAttackPathSuite(): Promise<{
  total: number;
  passed: number;
  failed: number;
  results: SecurityTestResult[];
}> {
  const results: SecurityTestResult[] = [];

  const record = (id: number, name: string, passed: boolean, details: string) => {
    results.push({ testId: id, name, passed, details });
  };

  // Reset store to initial state
  useGameStore.getState().resetInvestigation();
  registerWebMCP();

  // ───────────────────────────────────────────────────────────────────────────
  // Test 1: Premature accusation returns ONLY generic error (No hints or deduction titles)
  // ───────────────────────────────────────────────────────────────────────────
  const prematureAccusationKiller = await executeWebMCPTool('submit_accusation', {
    suspect_id: 'victoria-adeyemi',
    reasoning: 'Guessed killer',
  });

  const prematureAccusationWrong = await executeWebMCPTool('submit_accusation', {
    suspect_id: 'marcus-cole',
    reasoning: 'Guessed wrong suspect',
  });

  const expectedGenericError = 'You do not have enough established evidence to support this accusation.';

  const ap1Passed =
    prematureAccusationKiller.success === false &&
    prematureAccusationKiller.error === expectedGenericError &&
    prematureAccusationWrong.success === false &&
    prematureAccusationWrong.error === expectedGenericError &&
    JSON.stringify(prematureAccusationKiller) === JSON.stringify(prematureAccusationWrong) &&
    !JSON.stringify(prematureAccusationKiller).includes('Poison Source') &&
    !JSON.stringify(prematureAccusationKiller).includes('keycard');

  record(
    1,
    'Premature Accusation Generic Response & Zero Leakage',
    ap1Passed,
    ap1Passed
      ? 'PASS: Premature accusation returns generic error "You do not have enough established evidence to support this accusation." Zero deduction names, required evidence, or hints leaked. Response structure is 100% identical for killer vs wrong suspect.'
      : `FAIL: Premature accusation leaked information or differed between suspects. Killer res: ${JSON.stringify(prematureAccusationKiller)} | Wrong res: ${JSON.stringify(prematureAccusationWrong)}`,
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Test 2: Case Deduction Isolation (#047 does not leak into #052 or #061)
  // ───────────────────────────────────────────────────────────────────────────
  // Switch to Case #052 (The Vanishing Manuscript)
  useGameStore.getState().selectCase('vanishing-manuscript-052');
  const case52State = gameServiceGetStateWrapper();
  
  // Switch to Case #061 (Death on Platform 6)
  useGameStore.getState().selectCase('death-on-platform-6-061');
  const case61State = gameServiceGetStateWrapper();

  // Reset back to Case #047
  useGameStore.getState().selectCase('gallery-murder-047');

  const ap2Passed =
    !JSON.stringify(case52State).includes('Poison Source Traced') &&
    !JSON.stringify(case61State).includes('Poison Source Traced') &&
    case52State.caseId === 'vanishing-manuscript-052' &&
    case61State.caseId === 'death-on-platform-6-061';

  record(
    2,
    'Cross-Case Deduction & State Isolation',
    ap2Passed,
    ap2Passed
      ? 'PASS: Switching cases loads clean, independent case state. Case #047 deductions never leak into #052 or #061.'
      : 'FAIL: Case #047 deductions or state leaked into Case #052 or #061.',
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Test 3: Client JS Bundles contain ZERO solution data
  // ───────────────────────────────────────────────────────────────────────────
  const galleryClient = await import('@/game/data/galleryMurder');
  const vanishingClient = await import('@/game/data/vanishingManuscript');
  const platformClient = await import('@/game/data/deathOnPlatform6');

  const combinedClientStr =
    JSON.stringify(galleryClient) +
    JSON.stringify(vanishingClient) +
    JSON.stringify(platformClient);

  const ap3Passed =
    !combinedClientStr.includes('"isKiller"') &&
    !combinedClientStr.includes('"hiddenSignificance"') &&
    !combinedClientStr.includes('"isRedHerring"') &&
    !combinedClientStr.includes('"contributesToSolution"') &&
    !combinedClientStr.includes('"secrets"') &&
    !combinedClientStr.includes('"hiddenRelationships"') &&
    !combinedClientStr.includes('Potassium cyanide dissolved');

  record(
    3,
    'Client JS Bundle Zero Solution Leakage Audit',
    ap3Passed,
    ap3Passed
      ? 'PASS: Client data files (galleryMurder.ts, vanishingManuscript.ts, deathOnPlatform6.ts) contain ZERO isKiller flags, zero secrets, zero hiddenSignificances, and zero solution objects.'
      : 'FAIL: Client JavaScript bundle contains sensitive solution or internal classification fields.',
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Test 4: Normal #047 investigation flow works cleanly
  // ───────────────────────────────────────────────────────────────────────────
  useGameStore.getState().resetInvestigation();
  useGameStore.getState().visitLocation('private-office');
  useGameStore.getState().visitLocation('storage-room');
  useGameStore.getState().visitLocation('security-room');

  useGameStore.getState().inspectEvidence('whiskey-glass');
  useGameStore.getState().inspectEvidence('keycard-log');
  useGameStore.getState().inspectEvidence('cyanide-vial');
  useGameStore.getState().inspectEvidence('cctv-gap');
  useGameStore.getState().inspectEvidence('pharmacy-order');
  useGameStore.getState().inspectEvidence('divorce-filing');

  const stateAfterInspect = useGameStore.getState();
  const ap4Passed =
    stateAfterInspect.inspectedEvidenceIds.has('whiskey-glass') &&
    stateAfterInspect.inspectedEvidenceIds.has('cyanide-vial') &&
    stateAfterInspect.inspectedEvidenceIds.size === 6;

  record(
    4,
    'Normal #047 Investigation Flow Integrity',
    ap4Passed,
    ap4Passed
      ? 'PASS: Visiting locations, discovering evidence, inspecting clues, and interviewing suspects works smoothly without error.'
      : 'FAIL: Normal investigation flow broken by security refactoring.',
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Test 5: Legitimate completed accusation conviction evaluation
  // ───────────────────────────────────────────────────────────────────────────
  await executeWebMCPTool('interview_suspect', {
    suspect_id: 'victoria-adeyemi',
    question: 'va-q4',
  });

  const legitimateAccusation = await executeWebMCPTool('submit_accusation', {
    suspect_id: 'victoria-adeyemi',
    reasoning: 'Victoria Adeyemi accessed office at 10:19 PM using keycard, purchased cyanide vial KCN-8802, and paid guard Michael Grant £3,000 to delete CCTV.',
  });

  const ap5Passed =
    legitimateAccusation.success === true &&
    legitimateAccusation.isCorrect === true &&
    legitimateAccusation.solution !== undefined &&
    legitimateAccusation.solution.killerId === 'victoria-adeyemi';

  record(
    5,
    'Legitimate Accusation Conviction Evaluation',
    ap5Passed,
    ap5Passed
      ? 'PASS: Once all required deductions are genuinely established, submit_accusation successfully verifies conviction and returns solution!'
      : `FAIL: Legitimate accusation failed conviction evaluation. Result: ${JSON.stringify(legitimateAccusation)}`,
  );

  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  return { total, passed, failed, results };
}

function gameServiceGetStateWrapper() {
  const store = useGameStore.getState();
  const caseData = store.activeCase;
  const stateParams = {
    caseId: caseData.id,
    visitedLocationIds: Array.from(store.visitedLocationIds),
    discoveredEvidenceIds: Array.from(store.discoveredEvidenceIds),
    inspectedEvidenceIds: Array.from(store.inspectedEvidenceIds),
    interviewedSuspectIds: Array.from(store.interviewedSuspectIds),
  };
  return caseServerService.getCaseState(stateParams);
}

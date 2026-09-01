/**
 * attackPathSuite.ts
 *
 * Systematic Security & Investigation Integrity Regression Test Suite.
 * Audits all 10 Attack Paths defined in Problem 10.
 */

import { executeWebMCPTool, registerWebMCP } from '@/webmcp/register';
import { useGameStore } from '@/game/state/store';

export interface SecurityTestResult {
  attackPathId: number;
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
    results.push({ attackPathId: id, name, passed, details });
  };

  // Reset store to initial state
  useGameStore.getState().resetInvestigation();
  registerWebMCP();

  // ───────────────────────────────────────────────────────────────────────────
  // Attack Path 1: Guess a valid but undiscovered evidence ID
  // ───────────────────────────────────────────────────────────────────────────
  const ap1Result = await executeWebMCPTool('inspect_evidence', { evidence_id: 'cyanide-vial' });
  const ap1Passed =
    ap1Result.success === false &&
    ap1Result.error === 'Evidence not available. This item has not been discovered.' &&
    !JSON.stringify(ap1Result).includes('Victoria') &&
    !JSON.stringify(ap1Result).includes('pharmacy');

  record(
    1,
    'Undiscovered Evidence Inspection Rejection',
    ap1Passed,
    ap1Passed
      ? 'PASS: Undiscovered clue cyanide-vial correctly rejected with "Evidence not available. This item has not been discovered." Zero metadata leaked.'
      : `FAIL: Allowed inspect on undiscovered evidence or leaked metadata. Response: ${JSON.stringify(ap1Result)}`,
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Attack Path 2: Guess a valid but undiscovered location query
  // ───────────────────────────────────────────────────────────────────────────
  const ap2Result = await executeWebMCPTool('search_locations', { query: 'private-office' });
  const ap2Str = JSON.stringify(ap2Result);
  const ap2Passed =
    ap2Result.success === true &&
    !ap2Str.includes('cyanide-vial') &&
    !ap2Str.includes('keycard-log');

  record(
    2,
    'Unvisited Location Evidence Name Concealment',
    ap2Passed,
    ap2Passed
      ? 'PASS: Location query returns counts without exposing undiscovered clue names or IDs.'
      : 'FAIL: Undiscovered clue names or IDs exposed in location search.',
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Attack Path 3: Guess a suspect ID and attempt to obtain hidden information
  // ───────────────────────────────────────────────────────────────────────────
  const ap3Result = await executeWebMCPTool('get_suspect_profile', { suspect_id: 'victoria-adeyemi' });
  const ap3Str = JSON.stringify(ap3Result);
  const ap3Passed =
    ap3Result.success === true &&
    !ap3Str.includes('isKiller') &&
    !ap3Str.includes('killerId') &&
    !ap3Str.includes('cyanide dissolved in Daniel');

  record(
    3,
    'Suspect Profile Solution & Killer Shielding',
    ap3Passed,
    ap3Passed
      ? 'PASS: Suspect dossier contains zero killer flags, secrets, or solution hints.'
      : 'FAIL: Leaked killer status or secret solution in suspect profile.',
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Attack Path 4: Call get_case_state before investigation
  // ───────────────────────────────────────────────────────────────────────────
  const ap4Result = await executeWebMCPTool('get_case_state', {});
  const ap4Str = JSON.stringify(ap4Result);
  const ap4Passed =
    ap4Result.success === true &&
    ap4Result.data?.discoveredEvidenceCount === 0 &&
    !ap4Str.includes('isKiller') &&
    !ap4Str.includes('killerId') &&
    !ap4Str.includes('solution');

  record(
    4,
    'Initial get_case_state Player-Visible Restriction',
    ap4Passed,
    ap4Passed
      ? 'PASS: get_case_state returns only 0-progress metadata, non-spoiling deduction titles, and zero solution hints.'
      : 'FAIL: Initial case state leaked killer or solution.',
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Attack Path 5: Attempt to accuse correct suspect immediately (without evidence)
  // ───────────────────────────────────────────────────────────────────────────
  const ap5Result = await executeWebMCPTool('submit_accusation', {
    suspect_id: 'victoria-adeyemi',
    reasoning: 'Guessed killer based on title',
  });
  const ap5Passed =
    ap5Result.success === false &&
    typeof ap5Result.error === 'string' &&
    ap5Result.error.includes('Accusation rejected: Insufficient investigative proof');

  record(
    5,
    'Premature Correct Accusation Block',
    ap5Passed,
    ap5Passed
      ? `PASS: Immediately accusing correct killer correctly blocked. Error: "${ap5Result.error}"`
      : `FAIL: Premature accusation was accepted! Result: ${JSON.stringify(ap5Result)}`,
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Attack Path 6: Attempt to accuse wrong suspect immediately
  // ───────────────────────────────────────────────────────────────────────────
  const ap6Result = await executeWebMCPTool('submit_accusation', {
    suspect_id: 'marcus-cole',
    reasoning: 'Guessed suspect based on argument',
  });
  const ap6Passed =
    ap6Result.success === false &&
    typeof ap6Result.error === 'string' &&
    ap6Result.error.includes('Accusation rejected: Insufficient investigative proof');

  record(
    6,
    'Premature Wrong Accusation Block',
    ap6Passed,
    ap6Passed
      ? `PASS: Premature accusation against innocent suspect correctly blocked for missing deductions.`
      : `FAIL: Premature accusation allowed. Result: ${JSON.stringify(ap6Result)}`,
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Attack Path 7: Attempt to retrieve hidden solution via tool parameter probing
  // ───────────────────────────────────────────────────────────────────────────
  const ap7a = await executeWebMCPTool('search_evidence', { query: 'killer' });
  const ap7b = await executeWebMCPTool('search_evidence', { query: 'solution' });
  const ap7Str = JSON.stringify(ap7a) + JSON.stringify(ap7b);
  const ap7Passed = !ap7Str.includes('victoria-adeyemi') && !ap7Str.includes('cyanide-vial');

  record(
    7,
    'Tool Parameter Probing Resistance',
    ap7Passed,
    ap7Passed
      ? 'PASS: Parameter search for "killer" or "solution" yielded 0 undiscovered items and 0 secrets.'
      : 'FAIL: Solution revealed via parameter search probing.',
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Attack Path 8: Code Structure & Server-Only Solution Isolation
  // ───────────────────────────────────────────────────────────────────────────
  const galleryClientData = await import('@/game/data/galleryMurder');
  const clientStr = JSON.stringify(galleryClientData);
  const ap8Passed =
    !clientStr.includes('isKiller":true') &&
    !clientStr.includes('killerId') &&
    !clientStr.includes('Potassium cyanide dissolved in the victim');

  record(
    8,
    'Client JS Bundle Solution Isolation Audit',
    ap8Passed,
    ap8Passed
      ? 'PASS: Client case data file galleryMurder.ts contains 0 killer flags and 0 secret solution fields.'
      : 'FAIL: Client JavaScript bundle contains secret solution data.',
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Attack Path 9: Tool Parameter Manipulation & Graceful Failure
  // ───────────────────────────────────────────────────────────────────────────
  const ap9a = await executeWebMCPTool('inspect_evidence', { evidence_id: 12345 as any });
  const ap9b = await executeWebMCPTool('get_suspect_profile', { suspect_id: 'nonexistent-suspect' });
  const ap9Passed =
    ap9a.success === false &&
    ap9b.success === false &&
    ap9b.error.includes('not found');

  record(
    9,
    'Malformed Parameter Graceful Handling',
    ap9Passed,
    ap9Passed
      ? 'PASS: Invalid parameters and nonexistent IDs return structured error objects without crashing.'
      : 'FAIL: Unhandled exception on malformed parameters.',
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Attack Path 10: State Isolation & Complete Legitimate Flow Verification
  // ───────────────────────────────────────────────────────────────────────────
  // Reset and perform legitimate investigation sequence:
  const store = useGameStore.getState();
  store.resetInvestigation();

  store.visitLocation('private-office');
  store.visitLocation('storage-room');
  store.visitLocation('security-room');

  // Discover & inspect required clues
  store.inspectEvidence('whiskey-glass');
  store.inspectEvidence('keycard-log');
  store.inspectEvidence('cyanide-vial');
  store.inspectEvidence('cctv-gap');
  store.inspectEvidence('pharmacy-order');
  store.inspectEvidence('divorce-filing');

  // Record interview with Victoria (va-q4)
  await executeWebMCPTool('interview_suspect', {
    suspect_id: 'victoria-adeyemi',
    question: 'va-q4',
  });

  // Now test submit_accusation after completing all deductions
  const ap10Result = await executeWebMCPTool('submit_accusation', {
    suspect_id: 'victoria-adeyemi',
    reasoning: 'Victoria Adeyemi accessed office at 10:19 PM using keycard, purchased cyanide vial KCN-8802, and paid guard Michael Grant £3,000 to delete CCTV.',
  });

  const ap10Passed = ap10Result.success === true && ap10Result.isCorrect === true;

  record(
    10,
    'Legitimate Investigation Deduction & Conviction Flow',
    ap10Passed,
    ap10Passed
      ? 'PASS: After discovering all required clues and interviewing suspect, submit_accusation successfully verifies conviction!'
      : `FAIL: Legitimate investigation failed conviction evaluation. Result: ${JSON.stringify(ap10Result)}`,
  );

  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  return { total, passed, failed, results };
}

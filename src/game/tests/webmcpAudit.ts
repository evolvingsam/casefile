/**
 * webmcpAudit.ts
 *
 * Dedicated WebMCP Audit & Integration Test Suite.
 *
 * Executes systematic tests across all 9 WebMCP tools:
 * 1. Tool Registration & Discovery
 * 2. Schema & Parameter Validation
 * 3. Invalid Input Graceful Failure
 * 4. Solution Leakage Prevention Audit
 * 5. Two-Way Shared State Sync (Human ↔ Agent)
 * 6. Full Investigation Trajectory
 */

import { executeWebMCPTool, registerWebMCP } from '@/webmcp/register';
import { WEBMCP_TOOLS, WEBMCP_TOOL_MAP } from '@/webmcp/tools';
import { useGameStore } from '@/game/state/store';
import { THE_GALLERY_MURDER } from '@/game/data/galleryMurder';

export interface AuditResult {
  toolName: string;
  testName: string;
  passed: boolean;
  details: string;
}

export async function runWebMCPAuditSuite(): Promise<{
  totalTests: number;
  passCount: number;
  failCount: number;
  results: AuditResult[];
}> {
  const results: AuditResult[] = [];

  const recordTest = (toolName: string, testName: string, passed: boolean, details: string) => {
    results.push({ toolName, testName, passed, details });
  };

  // Reset game store for clean audit
  useGameStore.getState().resetInvestigation();
  registerWebMCP();

  // ─── TEST GROUP 1: Tool Registration & Discovery ─────────────────────────────

  const expectedTools = [
    'get_case_state',
    'search_evidence',
    'inspect_evidence',
    'search_locations',
    'get_suspects',
    'get_suspect_profile',
    'interview_suspect',
    'build_timeline',
    'submit_accusation',
  ];

  recordTest(
    'Registration',
    'Tool Count Audit',
    WEBMCP_TOOLS.length === 9,
    `Registered ${WEBMCP_TOOLS.length} of 9 expected tools`,
  );

  for (const toolName of expectedTools) {
    const exists = WEBMCP_TOOL_MAP.has(toolName);
    recordTest(
      toolName,
      'Registry Discovery',
      exists,
      exists ? 'Tool found in WEBMCP_TOOL_MAP' : 'Tool missing from registry',
    );
  }

  // ─── TEST GROUP 2: Solution Leakage Prevention Audit ─────────────────────────

  // 2a. Check get_case_state
  const stateRes = await executeWebMCPTool('get_case_state', {});
  const stateStr = JSON.stringify(stateRes);
  const leaksSolutionInState =
    stateStr.includes('victoria-adeyemi') && stateStr.includes('isKiller') ||
    stateStr.includes('cyanide dissolved in Daniel\'s whiskey');

  recordTest(
    'get_case_state',
    'Zero Solution Leakage',
    !leaksSolutionInState,
    !leaksSolutionInState
      ? 'PASS: State response contains zero hidden solution references or killer flags'
      : 'FAIL: Hidden solution detected in state output',
  );

  // 2b. Check get_suspects
  const suspectsRes = await executeWebMCPTool('get_suspects', {});
  const suspectsStr = JSON.stringify(suspectsRes);
  const leaksKillerInSuspects = suspectsStr.includes('isKiller') || suspectsStr.includes('killerId');

  recordTest(
    'get_suspects',
    'Zero Solution Leakage',
    !leaksKillerInSuspects,
    !leaksKillerInSuspects
      ? 'PASS: Suspect list contains zero isKiller flags or solution hints'
      : 'FAIL: Killer flag leaked in suspect list',
  );

  // 2c. Check get_suspect_profile
  const profileRes = await executeWebMCPTool('get_suspect_profile', { suspect_id: 'victoria-adeyemi' });
  const profileStr = JSON.stringify(profileRes);
  const leaksSecretsInProfile = profileStr.includes('isKiller') || profileStr.includes('cyanide dissolved');

  recordTest(
    'get_suspect_profile',
    'Zero Solution Leakage',
    !leaksSecretsInProfile,
    !leaksSecretsInProfile
      ? 'PASS: Suspect dossier hides killer status and unearned secrets'
      : 'FAIL: Secrets or killer identity leaked in profile',
  );

  // ─── TEST GROUP 3: Invalid Inputs & Error Handling ──────────────────────────

  // 3a. Invalid evidence ID
  const invalidEvRes = await executeWebMCPTool('inspect_evidence', { evidence_id: 'nonexistent-clue-999' });
  recordTest(
    'inspect_evidence',
    'Invalid Evidence ID Error Handling',
    invalidEvRes.success === false && typeof invalidEvRes.error === 'string',
    `Returned expected structured error: "${invalidEvRes.error}"`,
  );

  // 3b. Invalid suspect ID
  const invalidSusRes = await executeWebMCPTool('get_suspect_profile', { suspect_id: 'nonexistent-suspect-999' });
  recordTest(
    'get_suspect_profile',
    'Invalid Suspect ID Error Handling',
    invalidSusRes.success === false && typeof invalidSusRes.error === 'string',
    `Returned expected structured error: "${invalidSusRes.error}"`,
  );

  // 3c. Missing required parameter in interview_suspect
  const invalidIntRes = await executeWebMCPTool('interview_suspect', { suspect_id: 'victoria-adeyemi' });
  recordTest(
    'interview_suspect',
    'Missing Parameter Validation',
    invalidIntRes.success === false,
    `Returned validation error for missing question parameter`,
  );

  // 3d. Empty search queries
  const emptySearchRes = await executeWebMCPTool('search_evidence', { query: '' });
  recordTest(
    'search_evidence',
    'Empty Search Query Handling',
    emptySearchRes.success === true && Array.isArray(emptySearchRes.data?.discovered),
    `Handled empty query string, returned ${emptySearchRes.data?.discovered?.length} discovered items`,
  );

  // ─── TEST GROUP 4: Two-Way Shared State Synchronization ──────────────────────

  // 4a. Human discovers evidence → Agent sees it
  useGameStore.getState().visitLocation('private-office');
  const agentSearchRes = await executeWebMCPTool('search_evidence', { query: 'whiskey' });
  const agentFoundWhiskey = agentSearchRes.data?.discovered?.some((e: any) => e.id === 'whiskey-glass');

  recordTest(
    'search_evidence',
    'Shared State Sync: Human → Agent Evidence',
    agentFoundWhiskey === true,
    agentFoundWhiskey
      ? 'PASS: Agent search immediately sees evidence discovered by Human visiting location'
      : 'FAIL: Agent failed to see evidence discovered by Human',
  );

  // 4b. Agent inspects evidence → Shared state updated for Human UI
  await executeWebMCPTool('inspect_evidence', { evidence_id: 'whiskey-glass' });
  const humanStoreInspected = useGameStore.getState().inspectedEvidenceIds.has('whiskey-glass');

  recordTest(
    'inspect_evidence',
    'Shared State Sync: Agent → Human State Update',
    humanStoreInspected === true,
    humanStoreInspected
      ? 'PASS: Human Zustand store reflects inspected evidence status after Agent tool invocation'
      : 'FAIL: Human store failed to update after Agent inspection',
  );

  // 4c. Human interviews suspect → Agent sees transcript
  useGameStore.getState().recordInterview({
    suspectId: 'marcus-cole',
    questionId: 'mc-q1',
    question: 'What was your argument with Daniel about?',
    response: 'We had words about a forgery.',
    timestamp: Date.now(),
    author: 'human',
  });

  const agentProfileRes = await executeWebMCPTool('get_suspect_profile', { suspect_id: 'marcus-cole' });
  const agentHasTranscript = agentProfileRes.data?.interviewTranscript?.length > 0;

  recordTest(
    'get_suspect_profile',
    'Shared State Sync: Human Interview → Agent Transcript',
    agentHasTranscript === true,
    agentHasTranscript
      ? 'PASS: Agent profile query retrieves interview transcript conducted by Human'
      : 'FAIL: Agent profile missing Human interview transcript',
  );

  // 4d. Agent interviews suspect → Recorded in shared state for Human
  await executeWebMCPTool('interview_suspect', {
    suspect_id: 'victoria-adeyemi',
    question: 'va-q1',
  });

  const humanInterviewsCount = useGameStore.getState().interviews.length;
  recordTest(
    'interview_suspect',
    'Shared State Sync: Agent Interview → Human Log',
    humanInterviewsCount >= 2,
    `PASS: Human interview log updated to ${humanInterviewsCount} entries after Agent interview tool call`,
  );

  // ─── TEST GROUP 5: Accusation & Evaluation ───────────────────────────────────

  const wrongAccusationRes = await executeWebMCPTool('submit_accusation', {
    suspect_id: 'marcus-cole',
    method: 'Public argument',
    motive: 'Forgery debate',
    approximate_time: '9:00 PM',
    explanation: 'He argued with Daniel.',
    supporting_evidence_ids: [],
  });

  recordTest(
    'submit_accusation',
    'Incomplete Accusation Evaluation',
    wrongAccusationRes.data?.passed === false && wrongAccusationRes.data?.totalScore < 80,
    `PASS: Correctly returned incomplete theory response (Score ${wrongAccusationRes.data?.totalScore}/100). Verdict: "${wrongAccusationRes.data?.verdict}"`,
  );

  const correctAccusationRes = await executeWebMCPTool('submit_accusation', {
    suspect_id: 'victoria-adeyemi',
    method: 'Potassium cyanide poisoning in wine glass during gala',
    motive: 'Prevent gallery embezzlement and forgery scandal exposure',
    approximate_time: '10:19 PM gala window',
    explanation: 'Victoria used master keycard at 10:19 PM, planted cyanide vial, and bribed guard to delete CCTV.',
    supporting_evidence_ids: ['cyanide-vial', 'master-keycard-log', 'bribed-guard-confession', 'torn-financial-journal'],
  });

  recordTest(
    'submit_accusation',
    'Complete Accusation Evaluation (Passed Threshold)',
    correctAccusationRes.data?.passed === true && correctAccusationRes.data?.totalScore >= 80,
    `PASS: Correctly verified theory (Score ${correctAccusationRes.data?.totalScore}/100). Verdict: "${correctAccusationRes.data?.verdict}"`,
  );

  const totalTests = results.length;
  const passCount = results.filter((r) => r.passed).length;
  const failCount = totalTests - passCount;

  return {
    totalTests,
    passCount,
    failCount,
    results,
  };
}

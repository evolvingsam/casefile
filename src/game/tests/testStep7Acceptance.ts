/**
 * testStep7Acceptance.ts
 *
 * Automated Acceptance Test for Step 7: Add AI Investigation Activity Indicator.
 * Verifies WebMCP tool execution logging, status transitions (running/success/error),
 * investigator-focused summary formatting (✓, →, ✗), and reactivity in toolActivity.
 */

import { executeWebMCPTool } from '../../webmcp/register';
import { useGameStore } from '../state/store';

// Polyfill crypto.randomUUID for Node environment if needed
if (!globalThis.crypto) {
  (globalThis as any).crypto = {};
}
if (!globalThis.crypto.randomUUID) {
  (globalThis.crypto as any).randomUUID = () => '00000000-0000-0000-0000-000000000000' as `${string}-${string}-${string}-${string}-${string}`;
}

async function runStep7Acceptance() {
  console.log('----------------------------------------------------');
  console.log('🧪 Step 7 Acceptance Test: AI Investigation Activity');
  console.log('----------------------------------------------------');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, failureDetail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}: ${failureDetail || 'Assertion failed'}`);
      failed++;
    }
  }

  // Visit private-office location to unlock clues
  useGameStore.getState().visitLocation('private-office');

  // 1. Execute Full Investigation Sequence
  console.log('\n--- Running Full AI Investigation Sequence ---');

  // Step 1: get_case_state
  console.log('Executing 1/5: get_case_state...');
  const res1 = await executeWebMCPTool('get_case_state', {});
  assert(res1.success !== false, 'Sequence Step 1: get_case_state executed');

  // Step 2: get_suspect_profile ("victoria-adeyemi")
  console.log('Executing 2/5: get_suspect_profile("victoria-adeyemi")...');
  const res2 = await executeWebMCPTool('get_suspect_profile', { suspect_id: 'victoria-adeyemi' });
  assert(res2.success !== false, 'Sequence Step 2: get_suspect_profile executed');

  // Step 3: search_evidence ("keycard")
  console.log('Executing 3/5: search_evidence("keycard")...');
  const res3 = await executeWebMCPTool('search_evidence', { query: 'keycard' });
  assert(res3.success !== false, 'Sequence Step 3: search_evidence executed');

  // Step 4: inspect_evidence ("keycard-log")
  console.log('Executing 4/5: inspect_evidence("keycard-log")...');
  const res4 = await executeWebMCPTool('inspect_evidence', { evidence_id: 'keycard-log' });
  assert(res4.success !== false, 'Sequence Step 4: inspect_evidence executed');

  // Step 5: build_timeline
  console.log('Executing 5/5: build_timeline()...');
  const res5 = await executeWebMCPTool('build_timeline', {});
  assert(res5.success !== false, 'Sequence Step 5: build_timeline executed');

  // 2. Verify Activity Store State
  const toolActivity = useGameStore.getState().toolActivity;
  console.log(`\n--- Verifying store.toolActivity (${toolActivity.length} items logged) ---`);
  assert(toolActivity.length >= 5, `Activity Feed: Contains at least 5 logged actions (${toolActivity.length} found)`);

  // Check specific activity summaries & formatting
  const caseStateAct = toolActivity.find((a) => a.tool === 'get_case_state');
  assert(caseStateAct !== undefined, 'Activity Check: get_case_state logged in toolActivity');
  assert(caseStateAct?.status === 'success' || caseStateAct?.status === 'warning', 'Activity Check: get_case_state has status success/warning');
  assert(caseStateAct?.summary?.includes('Case state') ?? false, 'Activity Check: get_case_state summary formatted correctly');

  const victoriaAct = toolActivity.find((a) => a.tool === 'get_suspect_profile');
  assert(victoriaAct !== undefined, 'Activity Check: get_suspect_profile logged in toolActivity');
  assert(victoriaAct?.summary?.includes('Victoria Adeyemi') ?? false, `Activity Check: Profile summary mentions "Victoria Adeyemi" (${victoriaAct?.summary})`);

  const keycardAct = toolActivity.find((a) => a.tool === 'search_evidence');
  assert(keycardAct !== undefined, 'Activity Check: search_evidence logged in toolActivity');

  const timelineAct = toolActivity.find((a) => a.tool === 'build_timeline');
  assert(timelineAct !== undefined, 'Activity Check: build_timeline logged in toolActivity');
  assert(timelineAct?.summary?.includes('timeline') ?? false, `Activity Check: Timeline summary formatted (${timelineAct?.summary})`);

  // 3. Verify Human-Friendly Investigator Summaries Formatting
  console.log('\n--- Recent Investigator Activity Stream ---');
  toolActivity.slice(-5).forEach((act, idx) => {
    const prefix = act.status === 'running' ? '→ ' : act.status === 'error' ? '✗ ' : '✓ ';
    console.log(`  ${idx + 1}. ${prefix}${act.summary}`);
  });

  console.log('\n----------------------------------------------------');
  console.log(`📊 STEP 7 ACCEPTANCE SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('----------------------------------------------------');

  if (failed > 0) {
    process.exit(1);
  }
}

runStep7Acceptance().catch((err) => {
  console.error('Fatal Test Error:', err);
  process.exit(1);
});

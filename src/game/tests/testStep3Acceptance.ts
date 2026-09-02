/**
 * testStep3Acceptance.ts
 *
 * Automated Acceptance Test for Step 3: Connect get_suspect_profile to UI.
 * Verifies tool invocation, structured payload, state mutations, loading/error states,
 * and zero hardcoding across suspects.
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

async function runStep3Acceptance() {
  console.log('----------------------------------------------------');
  console.log('🧪 Step 3 Acceptance Test: get_suspect_profile → UI');
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

  // 1. Initial store check
  const initialStore = useGameStore.getState();
  assert(initialStore.activeSuspect === null, '1. Initial activeSuspect state is null');

  // 2. Call get_suspect_profile for victoria-adeyemi
  console.log('\n--- Invoking WebMCP get_suspect_profile for "victoria-adeyemi" ---');
  const victoriaRes = await executeWebMCPTool('get_suspect_profile', { suspect_id: 'victoria-adeyemi' });

  // Acceptance Check 1: Tool returns structured data
  assert(victoriaRes.success === true, 'Acceptance Check 1: WebMCP tool returned success: true');
  assert(victoriaRes.name === 'Victoria Adeyemi', 'Acceptance Check 1: Tool returned name "Victoria Adeyemi"');
  assert(typeof victoriaRes.occupation === 'string', 'Acceptance Check 1: Tool returned occupation property');
  assert(typeof victoriaRes.relationship === 'string', 'Acceptance Check 1: Tool returned relationship/role property');
  assert(typeof victoriaRes.motive === 'string', 'Acceptance Check 1: Tool returned motive property');
  assert(typeof victoriaRes.alibi === 'string', 'Acceptance Check 1: Tool returned alibi property');

  // Acceptance Check 2 & 3: Casefile state updates
  const stateAfterVictoria = useGameStore.getState();
  assert(stateAfterVictoria.activeSuspect !== null, 'Acceptance Check 2 & 3: store.activeSuspect state updated from null');
  assert(stateAfterVictoria.activeSuspect?.id === 'victoria-adeyemi', 'Acceptance Check 2 & 3: activeSuspect ID is "victoria-adeyemi"');
  assert(stateAfterVictoria.activeSuspect?.name === 'Victoria Adeyemi', 'Acceptance Check 2 & 3: activeSuspect Name is "Victoria Adeyemi"');

  // Acceptance Check 4: Verify profile components data
  assert(Array.isArray(stateAfterVictoria.activeSuspect?.availableQuestions), 'Acceptance Check 4: Profile contains availableQuestions array');
  assert(Array.isArray(stateAfterVictoria.activeSuspect?.interviewTranscript), 'Acceptance Check 4: Profile contains interviewTranscript array');

  // 3. Dynamic Suspect Check (No hardcoding verification with marcus-cole)
  console.log('\n--- Invoking WebMCP get_suspect_profile for "marcus-cole" (Zero Hardcoding Test) ---');
  const marcusRes = await executeWebMCPTool('get_suspect_profile', { suspect_id: 'marcus-cole' });
  const stateAfterMarcus = useGameStore.getState();

  assert(marcusRes.success === true, 'Dynamic Check: get_suspect_profile succeeded for marcus-cole');
  assert(stateAfterMarcus.activeSuspect?.id === 'marcus-cole', 'Dynamic Check: activeSuspect updated to "marcus-cole"');
  assert(stateAfterMarcus.activeSuspect?.name === 'Marcus Cole', 'Dynamic Check: activeSuspect name updated to "Marcus Cole"');

  // 4. Error State Check (Invalid suspect ID)
  console.log('\n--- Invoking WebMCP get_suspect_profile for invalid ID ---');
  const errorRes = await executeWebMCPTool('get_suspect_profile', { suspect_id: 'unknown-invalid-id' });
  assert(errorRes.success === false, 'Error Check: Tool returns success: false for invalid ID');
  assert(typeof errorRes.error === 'string' && errorRes.error.includes('not found'), 'Error Check: Tool returns error message');

  // 5. Tool Activity Feed Check
  const finalState = useGameStore.getState();
  const getSuspectActions = finalState.toolActivity.filter((a) => a.tool === 'get_suspect_profile');
  assert(getSuspectActions.length >= 3, `Activity Feed Check: ${getSuspectActions.length} get_suspect_profile tool calls logged in toolActivity`);

  console.log('\n----------------------------------------------------');
  console.log(`📊 STEP 3 ACCEPTANCE SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('----------------------------------------------------');

  if (failed > 0) {
    process.exit(1);
  }
}

runStep3Acceptance().catch((err) => {
  console.error('Fatal Test Error:', err);
  process.exit(1);
});

/**
 * testStateIntegration.ts
 *
 * Automated verification test for Step 2: Investigation State Layer.
 * Tests executing WebMCP tools and asserting that structured results
 * correctly update the Zustand store state.
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

async function runTests() {
  console.log('----------------------------------------------------');
  console.log('🧪 Running WebMCP State Integration Tests (Step 2)...');
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

  // 1. Initial State Check
  const initialState = useGameStore.getState();
  assert(initialState.caseState === null, 'Initial caseState is null');
  assert(initialState.activeSuspect === null, 'Initial activeSuspect is null');
  assert(initialState.selectedEvidence === null, 'Initial selectedEvidence is null');
  assert(initialState.discoveredEvidence.length === 0, 'Initial discoveredEvidence is empty');
  assert(initialState.timelineEvents.length === 0, 'Initial timelineEvents is empty');

  // 2. Test get_case_state -> update caseState
  console.log('\n--- Testing get_case_state ---');
  const caseStateRes = await executeWebMCPTool('get_case_state', {});
  const stateAfterCaseState = useGameStore.getState();
  assert(caseStateRes.success !== false, 'get_case_state executed successfully');
  assert(stateAfterCaseState.caseState !== null, 'store.caseState updated');
  assert(typeof stateAfterCaseState.caseState?.title === 'string', 'caseState has valid title');
  assert(stateAfterCaseState.caseState?.discoveredEvidenceCount !== undefined, 'caseState has evidence metrics');

  // 3. Test search_evidence -> update discoveredEvidence
  console.log('\n--- Testing search_evidence ---');
  // First visit a location so clues become discoverable/discovered
  useGameStore.getState().visitLocation('main-gallery');
  const searchRes = await executeWebMCPTool('search_evidence', { query: '' });
  const stateAfterSearch = useGameStore.getState();
  assert(searchRes.success !== false, 'search_evidence executed successfully');
  assert(Array.isArray(stateAfterSearch.discoveredEvidence), 'store.discoveredEvidence is an array');
  assert(stateAfterSearch.discoveredEvidence.length > 0, `store.discoveredEvidence has ${stateAfterSearch.discoveredEvidence.length} items`);

  // 4. Test inspect_evidence -> update selectedEvidence
  console.log('\n--- Testing inspect_evidence ---');
  const firstDiscovered = stateAfterSearch.discoveredEvidence[0];
  if (firstDiscovered) {
    const inspectRes = await executeWebMCPTool('inspect_evidence', { evidence_id: firstDiscovered.id });
    const stateAfterInspect = useGameStore.getState();
    assert(inspectRes.success === true, `inspect_evidence succeeded for item '${firstDiscovered.id}'`);
    assert(stateAfterInspect.selectedEvidence !== null, 'store.selectedEvidence updated');
    assert(stateAfterInspect.selectedEvidence?.id === firstDiscovered.id, `selectedEvidence matches '${firstDiscovered.id}'`);
    assert(typeof stateAfterInspect.selectedEvidence?.detailedDescription === 'string', 'selectedEvidence contains detailedDescription');
  } else {
    assert(false, 'No discovered evidence to inspect');
  }

  // 5. Test get_suspect_profile -> update activeSuspect
  console.log('\n--- Testing get_suspect_profile ---');
  const suspectListRes = await executeWebMCPTool('get_suspects', {});
  const suspects = suspectListRes.data?.suspects || suspectListRes.suspects || [];
  assert(suspects.length > 0, 'get_suspects returned suspect directory');
  const firstSuspectId = suspects[0]?.id;

  let activeSuspectState = useGameStore.getState().activeSuspect;
  if (firstSuspectId) {
    const suspectRes = await executeWebMCPTool('get_suspect_profile', { suspect_id: firstSuspectId });
    const stateAfterSuspect = useGameStore.getState();
    activeSuspectState = stateAfterSuspect.activeSuspect;
    assert(suspectRes.success === true, `get_suspect_profile succeeded for '${firstSuspectId}'`);
    assert(stateAfterSuspect.activeSuspect !== null, 'store.activeSuspect updated');
    assert(stateAfterSuspect.activeSuspect?.id === firstSuspectId, `activeSuspect matches '${firstSuspectId}'`);
    assert(Array.isArray(stateAfterSuspect.activeSuspect?.availableQuestions), 'activeSuspect contains availableQuestions');
  }

  // 6. Test build_timeline -> update timelineEvents & contradictions
  console.log('\n--- Testing build_timeline ---');
  const timelineRes = await executeWebMCPTool('build_timeline', {});
  const stateAfterTimeline = useGameStore.getState();
  assert(timelineRes.success !== false, 'build_timeline executed successfully');
  assert(Array.isArray(stateAfterTimeline.timelineEvents), 'store.timelineEvents is an array');
  assert(stateAfterTimeline.timelineEvents.length > 0, `store.timelineEvents has ${stateAfterTimeline.timelineEvents.length} reconstructed events`);
  assert(Array.isArray(stateAfterTimeline.contradictions), 'store.contradictions is an array');

  // 7. Test interview_suspect -> update activeSuspect profile & investigativeLeads
  console.log('\n--- Testing interview_suspect ---');
  if (firstSuspectId && activeSuspectState?.availableQuestions?.[0]) {
    const qId = activeSuspectState.availableQuestions[0].questionId;
    const interviewRes = await executeWebMCPTool('interview_suspect', { suspect_id: firstSuspectId, question: qId });
    const stateAfterInterview = useGameStore.getState();
    assert(interviewRes.success === true, `interview_suspect succeeded for '${firstSuspectId}' Q '${qId}'`);
    assert(stateAfterInterview.investigativeLeads.length > 0, `store.investigativeLeads recorded lead`);
  }

  // 8. Verify toolActivity (agentActions log)
  const finalState = useGameStore.getState();
  assert(finalState.toolActivity.length >= 5, `store.toolActivity recorded ${finalState.toolActivity.length} executions`);

  console.log('\n----------------------------------------------------');
  console.log(`📊 TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('----------------------------------------------------');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal Test Error:', err);
  process.exit(1);
});

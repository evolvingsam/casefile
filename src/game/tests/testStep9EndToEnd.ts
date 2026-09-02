/**
 * testStep9EndToEnd.ts
 *
 * Full End-to-End Integration Test for WebMCP → Casefile Architecture (Step 9).
 * Simulates the exact user request:
 * "Can you give me an overview of the current case state, pull up Victoria Adeyemi's profile,
 *  search for any evidence related to a keycard, and rebuild the timeline of events for the night of the murder?"
 *
 * Asserts both:
 * - Layer 1 (WebMCP Inspector & Tool Activity Logging)
 * - Layer 2 (Casefile UI State Layer & Structured Component Reactivity)
 * - Deduplication resilience on repeated calls
 * - Graceful error handling
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

async function runEndToEndIntegrationTest() {
  console.log('================================================================');
  console.log('🚀 STEP 9: FULL WEBMCP → CASEFILE END-TO-END INTEGRATION TEST');
  console.log('================================================================\n');

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

  // Pre-condition: Unlock private-office location to make keycard-log discoverable
  useGameStore.getState().visitLocation('private-office');

  console.log('--- 1. Executing Full Investigation Sequence ---');
  console.log('User Prompt: "Can you give me an overview of the current case state, pull up Victoria Adeyemi\'s profile, search for any evidence related to a keycard, and rebuild the timeline of events for the night of the murder?"\n');

  // Step A: get_case_state
  console.log('Executing WebMCP Tool [1/5]: get_case_state...');
  const resCaseState = await executeWebMCPTool('get_case_state', {});
  assert(resCaseState.success !== false, 'WebMCP get_case_state executed successfully');

  // Step B: get_suspect_profile("victoria-adeyemi")
  console.log('Executing WebMCP Tool [2/5]: get_suspect_profile("victoria-adeyemi")...');
  const resVictoria = await executeWebMCPTool('get_suspect_profile', { suspect_id: 'victoria-adeyemi' });
  assert(resVictoria.success !== false, 'WebMCP get_suspect_profile executed successfully');

  // Step C: search_evidence("keycard")
  console.log('Executing WebMCP Tool [3/5]: search_evidence("keycard")...');
  const resSearch = await executeWebMCPTool('search_evidence', { query: 'keycard' });
  assert(resSearch.success !== false, 'WebMCP search_evidence executed successfully');

  // Step D: inspect_evidence("keycard-log")
  console.log('Executing WebMCP Tool [4/5]: inspect_evidence("keycard-log")...');
  const resInspect = await executeWebMCPTool('inspect_evidence', { evidence_id: 'keycard-log' });
  assert(resInspect.success !== false, 'WebMCP inspect_evidence executed successfully');

  // Step E: build_timeline()
  console.log('Executing WebMCP Tool [5/5]: build_timeline()...');
  const resTimeline = await executeWebMCPTool('build_timeline', {});
  assert(resTimeline.success !== false, 'WebMCP build_timeline executed successfully');


  console.log('\n================================================================');
  console.log('🔍 LAYER 1 VERIFICATION: WEBMCP INSPECTOR & TOOL ACTIVITY LOGGING');
  console.log('================================================================');

  const toolActivity = useGameStore.getState().toolActivity;
  assert(toolActivity.length >= 5, `WebMCP Inspector: Recorded ${toolActivity.length} tool calls (>= 5 expected)`);

  const toolsExecuted = toolActivity.map((a) => a.tool);
  assert(toolsExecuted.includes('get_case_state'), 'Inspector Log: Contains get_case_state');
  assert(toolsExecuted.includes('get_suspect_profile'), 'Inspector Log: Contains get_suspect_profile');
  assert(toolsExecuted.includes('search_evidence'), 'Inspector Log: Contains search_evidence');
  assert(toolsExecuted.includes('inspect_evidence'), 'Inspector Log: Contains inspect_evidence');
  assert(toolsExecuted.includes('build_timeline'), 'Inspector Log: Contains build_timeline');

  // Verify status states
  const allSuccessful = toolActivity.every((a) => a.status === 'success' || a.status === 'warning');
  assert(allSuccessful, 'Inspector Log: All executed tools completed with success or warning status');

  console.log('\nRecorded WebMCP Inspector Live Stream:');
  toolActivity.slice(-5).forEach((act, idx) => {
    const prefix = act.status === 'running' ? '→ ' : act.status === 'error' ? '✗ ' : '✓ ';
    console.log(`  ${idx + 1}. [${act.tool}] ${prefix}${act.summary}`);
  });


  console.log('\n================================================================');
  console.log('🎨 LAYER 2 VERIFICATION: CASEFILE UI STATE LAYER & REACTIVITY');
  console.log('================================================================');

  const store = useGameStore.getState();

  // 1. Case State Overview
  assert(store.activeCase.caseNumber.includes('047'), 'UI State [Case Overview]: Case #047 loaded');
  assert(store.activeCase.title === 'The Gallery Murder', 'UI State [Case Overview]: Title "The Gallery Murder" loaded');
  assert(store.activeCase.victim === 'Daniel Adeyemi', 'UI State [Case Overview]: Victim "Daniel Adeyemi" loaded');

  // 2. Active Suspect Profile (Victoria Adeyemi)
  assert(store.activeSuspect !== null, 'UI State [Suspect Profile]: activeSuspect state populated');
  assert(store.activeSuspect?.name === 'Victoria Adeyemi', 'UI State [Suspect Profile]: Name is Victoria Adeyemi');
  assert(store.activeSuspect?.relationship.toLowerCase().includes('estranged') ?? false, 'UI State [Suspect Profile]: Relationship is Estranged spouse');
  assert(store.activeSuspect?.hasStatementContradiction === true, 'UI State [Suspect Profile]: Statement contradiction flagged');

  // 3. Discovered Evidence (Keycard Log)
  assert(store.discoveredEvidence.length > 0, `UI State [Evidence]: discoveredEvidence populated (${store.discoveredEvidence.length} items)`);
  const keycardEv = store.discoveredEvidence.find((e) => e.id === 'keycard-log' || e.name.toLowerCase().includes('keycard'));
  assert(keycardEv !== undefined, 'UI State [Evidence]: Keycard Log present in discoveredEvidence');

  // 4. Selected Evidence Detail
  assert(store.selectedEvidence !== null, 'UI State [Evidence Detail]: selectedEvidence state populated');
  assert(store.selectedEvidence?.id === 'keycard-log' || Boolean(store.selectedEvidence?.name.toLowerCase().includes('keycard')), 'UI State [Evidence Detail]: Selected evidence is Keycard Log');
  assert(store.selectedEvidence?.relevantTimestamp === '10:19 PM', 'UI State [Evidence Detail]: Relevant timestamp is 10:19 PM');
  assert(store.selectedEvidence?.contradictionNotice !== null, 'UI State [Evidence Detail]: Contradiction notice box present');

  // 5. Reconstructed Timeline
  assert(store.timelineEvents.length > 0, `UI State [Timeline]: timelineEvents populated (${store.timelineEvents.length} events)`);
  const firstEvent = store.timelineEvents[0];
  const lastEvent = store.timelineEvents[store.timelineEvents.length - 1];
  assert(firstEvent.time.includes('8:00'), `UI State [Timeline]: Earliest event sorted first (${firstEvent.time})`);
  assert(lastEvent.time.includes('11:47'), `UI State [Timeline]: Latest event sorted last (${lastEvent.time})`);

  // 6. Structured Contradictions & Leads
  assert(store.contradictions.length > 0, `UI State [Findings]: store.contradictions populated (${store.contradictions.length} items)`);
  assert(store.investigativeLeads.length > 0, `UI State [Findings]: store.investigativeLeads populated (${store.investigativeLeads.length} items)`);


  console.log('\n================================================================');
  console.log('🛡️ RESILIENCE & EDGE-CASE VERIFICATION');
  console.log('================================================================');

  // Edge-case A: Deduplication on repeated search_evidence calls
  const initialEvidenceCount = store.discoveredEvidence.length;
  await executeWebMCPTool('search_evidence', { query: 'keycard' });
  await executeWebMCPTool('search_evidence', { query: 'keycard' });
  const postRepeatCount = useGameStore.getState().discoveredEvidence.length;
  assert(initialEvidenceCount === postRepeatCount, `Deduplication Check: Repeated tool calls do NOT duplicate UI cards (${initialEvidenceCount} -> ${postRepeatCount})`);

  // Edge-case B: Graceful error handling on invalid parameters
  const errorResult = await executeWebMCPTool('get_suspect_profile', { suspect_id: 'nonexistent-suspect-999' });
  assert(errorResult.success === false || errorResult.error !== undefined || errorResult.data === null, 'Error Handling Check: Invalid suspect returns structured error without crashing');

  console.log('\n================================================================');
  console.log(`📊 END-TO-END TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runEndToEndIntegrationTest().catch((err) => {
  console.error('Fatal Test Error:', err);
  process.exit(1);
});

/**
 * testStep4Acceptance.ts
 *
 * Automated Acceptance Test for Step 4: Connect search_evidence to Casefile UI.
 * Verifies WebMCP tool invocation, structured payloads, state mutations,
 * metadata enrichment (location, suspects, contradiction badges), and ID deduplication.
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

async function runStep4Acceptance() {
  console.log('----------------------------------------------------');
  console.log('🧪 Step 4 Acceptance Test: search_evidence → UI');
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

  // Visit a location so clues become discoverable
  useGameStore.getState().visitLocation('private-office');
  useGameStore.getState().visitLocation('security-room');

  // 1. Initial State Check
  const initialStore = useGameStore.getState();
  const initialDiscoveredCount = initialStore.discoveredEvidence.length;

  // 2. Call search_evidence("keycard")
  console.log('\n--- Invoking WebMCP search_evidence({ query: "keycard" }) ---');
  const res1 = await executeWebMCPTool('search_evidence', { query: 'keycard' });

  // Acceptance Check 1: Tool returns structured payload
  const discoveredArray = res1.data?.discovered || res1.discovered;
  assert(res1.success !== false, 'Acceptance Check 1: search_evidence executed successfully');
  assert(Array.isArray(discoveredArray), 'Acceptance Check 1: Response contains discovered array');

  // Acceptance Check 2: State updates
  const stateAfterRes1 = useGameStore.getState();
  const countAfterRes1 = stateAfterRes1.discoveredEvidence.length;
  assert(countAfterRes1 > initialDiscoveredCount, `Acceptance Check 2: store.discoveredEvidence updated (${countAfterRes1} items)`);

  const keycardItem = stateAfterRes1.discoveredEvidence.find((e) => e.id === 'keycard-log');
  assert(keycardItem !== undefined, 'Acceptance Check 2: Discovered evidence array contains "keycard-log"');
  assert(typeof keycardItem?.name === 'string', 'Acceptance Check 2: Evidence item has name');
  assert(typeof keycardItem?.description === 'string', 'Acceptance Check 2: Evidence item has description');
  assert(typeof keycardItem?.location === 'string', 'Acceptance Check 2: Evidence item has location');
  assert(Array.isArray(keycardItem?.relatedSuspects), 'Acceptance Check 2: Evidence item has relatedSuspects array');
  assert(keycardItem?.hasContradiction === true, 'Acceptance Check 2: Keycard log has contradiction flag = true');

  // 3. Acceptance Check 3 & 4: Repeated Call Deduplication Test
  console.log('\n--- Invoking search_evidence({ query: "keycard" }) a SECOND time (Deduplication Test) ---');
  const res2 = await executeWebMCPTool('search_evidence', { query: 'keycard' });
  const stateAfterRes2 = useGameStore.getState();
  const countAfterRes2 = stateAfterRes2.discoveredEvidence.length;

  assert(res2.success !== false, 'Deduplication Test: Second tool call executed successfully');
  assert(countAfterRes2 === countAfterRes1, `Deduplication Test: Duplicate call did NOT increase item count (${countAfterRes2} === ${countAfterRes1})`);

  // Verify unique keys
  const ids = stateAfterRes2.discoveredEvidence.map((e) => e.id);
  const uniqueIds = new Set(ids);
  assert(ids.length === uniqueIds.size, `Deduplication Test: All ${ids.length} evidence IDs in store are unique`);

  // 4. Test search_evidence with "whiskey" and "cyanide"
  console.log('\n--- Invoking search_evidence({ query: "whiskey" }) ---');
  const whiskeyRes = await executeWebMCPTool('search_evidence', { query: 'whiskey' });
  const stateAfterWhiskey = useGameStore.getState();
  assert(whiskeyRes.success !== false, 'Search "whiskey" executed successfully');
  assert(stateAfterWhiskey.discoveredEvidence.some((e) => e.id === 'whiskey-glass'), 'store.discoveredEvidence contains "whiskey-glass"');

  // Activity Feed Check
  const searchActions = stateAfterWhiskey.toolActivity.filter((a) => a.tool === 'search_evidence');
  assert(searchActions.length >= 3, `Activity Feed Check: ${searchActions.length} search_evidence tool calls logged in toolActivity`);

  console.log('\n----------------------------------------------------');
  console.log(`📊 STEP 4 ACCEPTANCE SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('----------------------------------------------------');

  if (failed > 0) {
    process.exit(1);
  }
}

runStep4Acceptance().catch((err) => {
  console.error('Fatal Test Error:', err);
  process.exit(1);
});

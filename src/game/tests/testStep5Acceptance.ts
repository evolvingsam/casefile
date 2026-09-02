/**
 * testStep5Acceptance.ts
 *
 * Automated Acceptance Test for Step 5: Connect inspect_evidence to Casefile UI.
 * Verifies WebMCP tool invocation, structured payload, selectedEvidence state update,
 * enriched metadata (timestamp, location, what it proves, suspect links, contradiction notice),
 * and dynamic evidence inspection switching.
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

async function runStep5Acceptance() {
  console.log('----------------------------------------------------');
  console.log('🧪 Step 5 Acceptance Test: inspect_evidence → UI');
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

  // Ensure locations & evidence are discovered in store
  useGameStore.getState().visitLocation('private-office');
  useGameStore.getState().discoverEvidence('keycard-log');
  useGameStore.getState().discoverEvidence('cyanide-vial');
  useGameStore.getState().discoverEvidence('cctv-argument');

  // 1. Initial State Check
  assert(useGameStore.getState().selectedEvidence === null, 'Initial selectedEvidence state is null');

  // 2. Call inspect_evidence({ evidence_id: "keycard-log" })
  console.log('\n--- Invoking WebMCP inspect_evidence for "keycard-log" ---');
  const res1 = await executeWebMCPTool('inspect_evidence', { evidence_id: 'keycard-log' });
  const data1 = res1.data || res1;

  assert(res1.success !== false, 'Acceptance Check 1 & 2: inspect_evidence returned success: true');
  assert(data1.id === 'keycard-log', 'Acceptance Check 1 & 2: Returned object ID is "keycard-log"');
  assert(typeof data1.detailedDescription === 'string', 'Acceptance Check 1 & 2: Tool returned detailedDescription');

  const selected1 = useGameStore.getState().selectedEvidence;
  assert(selected1 !== null, 'Acceptance Check 3: store.selectedEvidence state updated from null');
  assert(selected1?.id === 'keycard-log', 'Acceptance Check 3 & 4: selectedEvidence ID is "keycard-log"');
  assert(selected1?.name === 'Electronic Keycard Access Audit Log', 'Acceptance Check 3 & 4: selectedEvidence Name is "Electronic Keycard Access Audit Log"');
  assert(selected1?.relevantTimestamp === '10:19 PM', 'Acceptance Check 4: selectedEvidence contains timestamp "10:19 PM"');
  assert(typeof selected1?.location === 'string', 'Acceptance Check 4: selectedEvidence contains location');
  assert(typeof selected1?.whatItProves === 'string', 'Acceptance Check 4: selectedEvidence contains whatItProves');
  assert(selected1?.contradictionNotice !== null && selected1?.contradictionNotice !== undefined, 'Acceptance Check 4: selectedEvidence contains contradictionNotice object');
  assert(selected1?.contradictionNotice?.suspectName === 'Victoria Adeyemi', 'Acceptance Check 4: Contradiction notice names "Victoria Adeyemi"');
  assert(selected1?.contradictionNotice?.statement?.includes('10:45 PM') ?? false, 'Acceptance Check 4: Contradiction notice mentions stated time 10:45 PM');

  // 3. Dynamic Inspection Switch Test: Call inspect_evidence for "cyanide-vial"
  console.log('\n--- Invoking WebMCP inspect_evidence for "cyanide-vial" (Inspection Switch Test) ---');
  const res2 = await executeWebMCPTool('inspect_evidence', { evidence_id: 'cyanide-vial' });
  const data2 = res2.data || res2;
  const selected2 = useGameStore.getState().selectedEvidence;

  assert(res2.success !== false, 'Switch Test: inspect_evidence succeeded for "cyanide-vial"');
  assert(selected2?.id === 'cyanide-vial', 'Switch Test: selectedEvidence updated to "cyanide-vial"');
  assert(selected2?.name === 'Empty Chemical Vial (Batch KCN-8802)', 'Switch Test: selectedEvidence name updated to "Empty Chemical Vial (Batch KCN-8802)"');
  assert(selected2?.id !== selected1?.id, 'Switch Test: UI correctly switched from keycard-log to cyanide-vial');

  // 4. Activity Log Check
  const inspectActions = useGameStore.getState().toolActivity.filter((a) => a.tool === 'inspect_evidence');
  assert(inspectActions.length >= 2, `Activity Feed Check: ${inspectActions.length} inspect_evidence tool calls logged in toolActivity`);

  console.log('\n----------------------------------------------------');
  console.log(`📊 STEP 5 ACCEPTANCE SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('----------------------------------------------------');

  if (failed > 0) {
    process.exit(1);
  }
}

runStep5Acceptance().catch((err) => {
  console.error('Fatal Test Error:', err);
  process.exit(1);
});

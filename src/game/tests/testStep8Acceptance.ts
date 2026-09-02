/**
 * testStep8Acceptance.ts
 *
 * Automated Acceptance Test for Step 8: Surface Investigative Leads and Contradictions.
 * Verifies structured contradiction and investigative lead population in state
 * driven by actual WebMCP tool execution data (keycard access at 10:19 PM vs Victoria's stated 10:45 PM arrival).
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

async function runStep8Acceptance() {
  console.log('------------------------------------------------------------');
  console.log('🧪 Step 8 Acceptance Test: Surface Leads & Contradictions');
  console.log('------------------------------------------------------------');

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

  // Visit private office location to unlock keycard evidence
  useGameStore.getState().visitLocation('private-office');

  // 1. Execute Keycard Investigation Tools
  console.log('\n--- 1. Executing Keycard Investigation Tools ---');

  console.log('Calling WebMCP get_suspect_profile("victoria-adeyemi")...');
  const profileRes = await executeWebMCPTool('get_suspect_profile', { suspect_id: 'victoria-adeyemi' });
  assert(profileRes.success !== false, 'WebMCP get_suspect_profile returned successfully');

  console.log('Calling WebMCP inspect_evidence("keycard-log")...');
  const inspectRes = await executeWebMCPTool('inspect_evidence', { evidence_id: 'keycard-log' });
  assert(inspectRes.success !== false, 'WebMCP inspect_evidence returned successfully');

  console.log('Calling WebMCP build_timeline()...');
  const timelineRes = await executeWebMCPTool('build_timeline', {});
  assert(timelineRes.success !== false, 'WebMCP build_timeline returned successfully');

  // 2. Verify State Layer Population (store.contradictions & store.investigativeLeads)
  console.log('\n--- 2. Verifying Structured Contradictions State ---');
  const state = useGameStore.getState();

  assert(state.contradictions.length > 0, `store.contradictions populated (${state.contradictions.length} item(s) found)`);
  assert(state.investigativeLeads.length > 0, `store.investigativeLeads populated (${state.investigativeLeads.length} item(s) found)`);

  const victoriaContradiction = state.contradictions.find(
    (c) =>
      c.contradictedSuspect === 'Victoria Adeyemi' ||
      c.title?.includes('Victoria') ||
      c.eventDescription?.includes('Victoria') ||
      c.observation?.includes('Victoria'),
  );

  assert(victoriaContradiction !== undefined, 'Found structured contradiction for Victoria Adeyemi');

  if (victoriaContradiction) {
    console.log('\n--- 3. Verifying Victoria Keycard Contradiction Structure ---');
    console.log(`  Title: ${victoriaContradiction.title}`);
    console.log(`  Event Time: ${victoriaContradiction.eventTime || victoriaContradiction.time}`);
    console.log(`  Stated Claim: ${victoriaContradiction.suspectClaim}`);
    console.log(`  Evidence Fact: ${victoriaContradiction.eventDescription || victoriaContradiction.description}`);
    console.log(`  Observation: ${victoriaContradiction.observation}`);

    assert(
      (victoriaContradiction.suspectClaim?.includes('10:45') ?? false) ||
      (victoriaContradiction.observation?.includes('10:45') ?? false) ||
      (victoriaContradiction.observation?.includes('stated arrival') ?? false),
      'Contradiction captures Victoria\'s stated arrival time (10:45 PM)',
    );

    assert(
      (victoriaContradiction.eventTime === '10:19 PM') ||
      (victoriaContradiction.eventDescription?.includes('10:19') ?? false) ||
      (victoriaContradiction.observation?.includes('10:19') ?? false),
      'Contradiction captures keycard physical access timestamp (10:19 PM)',
    );
  }

  const keycardLead = state.investigativeLeads.find(
    (l) => l.title?.includes('Keycard') || l.description?.includes('keycard') || l.description?.includes('Victoria'),
  );
  assert(keycardLead !== undefined, 'Found structured investigative lead for keycard access discrepancy');

  console.log('\n------------------------------------------------------------');
  console.log(`📊 STEP 8 ACCEPTANCE SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('------------------------------------------------------------');

  if (failed > 0) {
    process.exit(1);
  }
}

runStep8Acceptance().catch((err) => {
  console.error('Fatal Test Error:', err);
  process.exit(1);
});

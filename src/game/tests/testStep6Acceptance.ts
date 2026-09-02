/**
 * testStep6Acceptance.ts
 *
 * Automated Acceptance Test for Step 6: Connect build_timeline to Casefile UI.
 * Verifies WebMCP tool invocation, structured payload, timelineEvents state mutation,
 * chronological ordering, event field completeness (time, description, suspects, location, source),
 * and contradiction detection.
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

function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

async function runStep6Acceptance() {
  console.log('----------------------------------------------------');
  console.log('🧪 Step 6 Acceptance Test: build_timeline → UI');
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

  // Ensure case data has evidence & locations unlocked
  useGameStore.getState().visitLocation('private-office');
  useGameStore.getState().discoverEvidence('keycard-log');
  await executeWebMCPTool('interview_suspect', {
    suspect_id: 'victoria-adeyemi',
    question: 'Where were you between 10 PM and 11 PM?',
  });

  // 1. Initial Check
  const initialEventsCount = useGameStore.getState().timelineEvents.length;

  // 2. Call WebMCP build_timeline()
  console.log('\n--- Invoking WebMCP build_timeline() ---');
  const res = await executeWebMCPTool('build_timeline', {});
  const data = res.data || res;

  // Acceptance Check 1 & 2: Inspector records call & tool returns structured data
  assert(res.success !== false, 'Acceptance Check 1 & 2: build_timeline executed successfully');
  assert(Array.isArray(data.reconstructedEvents), 'Acceptance Check 2: Response contains reconstructedEvents array');
  assert(data.reconstructedEvents.length > 0, `Acceptance Check 2: Reconstructed events count is > 0 (${data.reconstructedEvents.length} events)`);

  // Acceptance Check 3: State updates
  const stateAfter = useGameStore.getState();
  assert(stateAfter.timelineEvents.length > 0, `Acceptance Check 3: store.timelineEvents updated (${stateAfter.timelineEvents.length} items)`);

  // Acceptance Check 4: Chronological Ordering
  const times = stateAfter.timelineEvents.map((e) => e.time);
  let isChronological = true;
  for (let i = 0; i < times.length - 1; i++) {
    const min1 = parseTimeToMinutes(times[i]);
    const min2 = parseTimeToMinutes(times[i + 1]);
    if (min1 > min2) {
      isChronological = false;
      break;
    }
  }
  assert(isChronological, `Acceptance Check 4: Events are strictly sorted chronologically (${times.join(' → ')})`);

  // Acceptance Check 5: Event Field Completeness
  const sampleEvent = stateAfter.timelineEvents[0];
  assert(typeof sampleEvent.time === 'string', 'Event Field Check: Event contains time');
  assert(typeof sampleEvent.description === 'string', 'Event Field Check: Event contains description');
  assert(Array.isArray(sampleEvent.suspectsInvolved), 'Event Field Check: Event contains suspectsInvolved array');
  assert(typeof sampleEvent.source === 'string', 'Event Field Check: Event contains source/evidence');
  assert(typeof sampleEvent.location === 'string', 'Event Field Check: Event contains location');

  // Contradiction Check
  const keycardEvent = stateAfter.timelineEvents.find((e) => e.time === '10:19 PM' || (e.description && e.description.includes('Keycard')));
  assert(keycardEvent !== undefined, 'Contradiction Check: Keycard 10:19 PM event present in timeline');
  assert(keycardEvent?.isContradiction === true, 'Contradiction Check: Keycard 10:19 PM event flagged as contradiction = true');

  // Activity Feed Check
  const timelineActions = stateAfter.toolActivity.filter((a) => a.tool === 'build_timeline');
  assert(timelineActions.length >= 1, `Activity Feed Check: ${timelineActions.length} build_timeline tool call logged in toolActivity`);

  console.log('\n----------------------------------------------------');
  console.log(`📊 STEP 6 ACCEPTANCE SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('----------------------------------------------------');

  if (failed > 0) {
    process.exit(1);
  }
}

runStep6Acceptance().catch((err) => {
  console.error('Fatal Test Error:', err);
  process.exit(1);
});

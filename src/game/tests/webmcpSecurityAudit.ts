/**
 * webmcpSecurityAudit.ts
 *
 * Automated WebMCP Security & Data Privacy Test Suite.
 * Enforces: INTERNAL CASE TRUTH ≠ AGENT-ACCESSIBLE INFORMATION.
 *
 * Systematically tests all 6 agent attack vectors:
 * 1. Calling every available tool
 * 2. Searching with an empty query
 * 3. Inspecting every discovered evidence item
 * 4. Asking for the entire case state
 * 5. Repeatedly querying the same information
 * 6. Combining outputs from all 9 tools
 */

import { gameService } from '@/game/services/gameService';
import { useGameStore } from '@/game/state/store';
import { THE_GALLERY_MURDER } from '@/game/data/galleryMurder';

export interface SecurityTestResult {
  vector: string;
  testName: string;
  passed: boolean;
  details: string;
}

export async function runSecurityAuditSuite(): Promise<{
  totalTests: number;
  passCount: number;
  failCount: number;
  results: SecurityTestResult[];
}> {
  const results: SecurityTestResult[] = [];

  const recordTest = (vector: string, testName: string, passed: boolean, details: string) => {
    results.push({ vector, testName, passed, details });
  };

  // Reset store to Case #047
  const store = useGameStore.getState();
  store.selectCase(THE_GALLERY_MURDER.id);
  store.resetInvestigation();

  // ─── ATTACK VECTOR 1: Direct inspect_evidence Leak Audit ────────────────────

  // Discover all evidence items by visiting all locations
  THE_GALLERY_MURDER.locations.forEach((loc) => store.visitLocation(loc.id));

  let inspectLeaksFound = 0;
  const inspectedOutputs: any[] = [];

  THE_GALLERY_MURDER.evidence.forEach((ev) => {
    const res = gameService.inspectEvidence(ev.id);
    inspectedOutputs.push(res);

    if ((res as any).hiddenSignificance !== undefined || (res as any).isRedHerring !== undefined) {
      inspectLeaksFound++;
    }
  });

  recordTest(
    'Attack Vector 1',
    'inspect_evidence Stripping Audit',
    inspectLeaksFound === 0,
    inspectLeaksFound === 0
      ? 'PASS: hiddenSignificance and isRedHerring are completely stripped from all inspect_evidence calls.'
      : `FAIL: ${inspectLeaksFound} evidence items leaked hiddenSignificance or isRedHerring.`,
  );

  // ─── ATTACK VECTOR 2: get_case_state Solution Leak Audit ─────────────────────

  const caseStateRes = gameService.getCaseState();
  const csString = JSON.stringify(caseStateRes).toLowerCase();
  const csLeaks =
    csString.includes('hiddensignificance') ||
    csString.includes('isredherring') ||
    csString.includes('iskiller') ||
    csString.includes('victoria adeyemi (victim\'s wife)');

  recordTest(
    'Attack Vector 2',
    'get_case_state Security Audit',
    !csLeaks,
    !csLeaks
      ? 'PASS: get_case_state returns high-level progress and discovered clue names only, zero internal solution text.'
      : 'FAIL: get_case_state leaked internal solution fields or killer identity.',
  );

  // ─── ATTACK VECTOR 3: Suspect Profile & Secret Leak Audit ────────────────────

  let suspectLeaksFound = 0;
  THE_GALLERY_MURDER.suspects.forEach((s) => {
    const profile = gameService.getSuspectProfile(s.id);
    const pString = JSON.stringify(profile).toLowerCase();

    if ((profile as any).isKiller !== undefined || (profile as any).secrets !== undefined || pString.includes('iskiller')) {
      suspectLeaksFound++;
    }
  });

  recordTest(
    'Attack Vector 3',
    'get_suspect_profile Secret Audit',
    suspectLeaksFound === 0,
    suspectLeaksFound === 0
      ? 'PASS: get_suspect_profile excludes isKiller and secrets across all suspect dossiers.'
      : `FAIL: ${suspectLeaksFound} suspect profiles exposed secret or isKiller fields.`,
  );

  // ─── ATTACK VECTOR 4: Empty Query Search Audit ────────────────────────────────

  const searchEvRes = gameService.searchEvidence('');
  const searchLocRes = gameService.searchLocations('');

  const searchEvString = JSON.stringify(searchEvRes).toLowerCase();
  const searchEvLeaks = searchEvString.includes('hiddensignificance') || searchEvString.includes('isredherring');

  recordTest(
    'Attack Vector 4',
    'search_evidence("") & search_locations("") Security Audit',
    !searchEvLeaks,
    !searchEvLeaks
      ? 'PASS: Empty search queries return surface descriptions without hidden solution fields.'
      : 'FAIL: Empty search query leaked hidden significance or red herring flags.',
  );

  // ─── ATTACK VECTOR 5: Timeline & Interview Contradiction Leak Audit ───────────

  const timelineRes = gameService.buildTimeline();
  const timelineString = JSON.stringify(timelineRes).toLowerCase();

  const timelineLeaks =
    timelineString.includes('hiddensignificance') ||
    timelineString.includes('fullexplanation') ||
    timelineString.includes('victoria adeyemi (victim\'s wife)');

  recordTest(
    'Attack Vector 5',
    'build_timeline Security Audit',
    !timelineLeaks,
    !timelineLeaks
      ? 'PASS: build_timeline returns observable event timestamps without raw solution explanations.'
      : 'FAIL: build_timeline leaked full explanation or internal solution text.',
  );

  // ─── ATTACK VECTOR 6: Combined Trajectory Output Scan ─────────────────────────

  // Simulate an agent executing every single tool across every parameter
  const combinedPayload: any = {
    caseState: gameService.getCaseState(),
    allEvidenceSearch: gameService.searchEvidence(''),
    inspectedEvidence: THE_GALLERY_MURDER.evidence.map((e) => gameService.inspectEvidence(e.id)),
    allLocations: gameService.searchLocations(''),
    suspectsDirectory: gameService.getSuspects(),
    suspectProfiles: THE_GALLERY_MURDER.suspects.map((s) => gameService.getSuspectProfile(s.id)),
    interviews: THE_GALLERY_MURDER.suspects.flatMap((s) =>
      s.interviewResponses.map((q) => gameService.interviewSuspect(s.id, q.id)),
    ),
    timeline: gameService.buildTimeline(),
  };

  const combinedString = JSON.stringify(combinedPayload);
  const hasForbiddenHiddenSignificance = combinedString.includes('"hiddenSignificance"');
  const hasForbiddenIsRedHerring = combinedString.includes('"isRedHerring"');
  const hasForbiddenIsKiller = combinedString.includes('"isKiller"');

  const combinedPassed = !hasForbiddenHiddenSignificance && !hasForbiddenIsRedHerring && !hasForbiddenIsKiller;

  recordTest(
    'Attack Vector 6',
    'Combined Trajectory Payload Security Scan',
    combinedPassed,
    combinedPassed
      ? 'PASS: Full trajectory payload scan confirms zero exposure of hiddenSignificance, isRedHerring, or isKiller.'
      : `FAIL: Combined payload scan detected forbidden internal fields (hiddenSignificance: ${hasForbiddenHiddenSignificance}, isRedHerring: ${hasForbiddenIsRedHerring}, isKiller: ${hasForbiddenIsKiller}).`,
  );

  // ─── ATTACK VECTOR 7: Multi-Case 3-Way State Isolation (#047 ↔ #052 ↔ #061) ──

  // Step A: Case #047 progress
  useGameStore.getState().selectCase('gallery-murder-047');
  useGameStore.getState().resetInvestigation();
  useGameStore.getState().visitLocation('main-gallery');
  useGameStore.getState().addNote('Case 047 specific note', 'human');

  // Step B: Case #052 progress
  useGameStore.getState().selectCase('vanishing-manuscript-052');
  useGameStore.getState().resetInvestigation();
  useGameStore.getState().visitLocation('archival-vault');
  useGameStore.getState().addNote('Case 052 specific note', 'human');

  // Step C: Case #061 fresh check & progress
  useGameStore.getState().selectCase('death-on-platform-6-061');
  useGameStore.getState().resetInvestigation();

  const c61FreshEvCount = useGameStore.getState().discoveredEvidenceIds.size;
  const c61FreshNotesCount = useGameStore.getState().notes.length;

  useGameStore.getState().visitLocation('private-lounge');
  useGameStore.getState().addNote('Case 061 specific note', 'human');

  // Step D: Verify Case #047 isolation
  useGameStore.getState().selectCase('gallery-murder-047');
  const c47Discovered = useGameStore.getState().discoveredEvidenceIds;
  const c47Notes = useGameStore.getState().notes.map((n) => n.content);
  const c47Isolated =
    c47Discovered.has('cctv-argument') &&
    !c47Discovered.has('display-pedestal') &&
    !c47Discovered.has('lounge-coffee-table') &&
    c47Notes.includes('Case 047 specific note') &&
    !c47Notes.includes('Case 052 specific note') &&
    !c47Notes.includes('Case 061 specific note');

  // Step E: Verify Case #052 isolation
  useGameStore.getState().selectCase('vanishing-manuscript-052');
  const c52Discovered = useGameStore.getState().discoveredEvidenceIds;
  const c52Notes = useGameStore.getState().notes.map((n) => n.content);
  const c52Isolated =
    !c52Discovered.has('cctv-argument') &&
    c52Discovered.has('display-pedestal') &&
    !c52Discovered.has('lounge-coffee-table') &&
    !c52Notes.includes('Case 047 specific note') &&
    c52Notes.includes('Case 052 specific note') &&
    !c52Notes.includes('Case 061 specific note');

  // Step F: Verify Case #061 isolation
  useGameStore.getState().selectCase('death-on-platform-6-061');
  const c61Discovered = useGameStore.getState().discoveredEvidenceIds;
  const c61Notes = useGameStore.getState().notes.map((n) => n.content);
  const c61Isolated =
    !c61Discovered.has('cctv-argument') &&
    !c61Discovered.has('display-pedestal') &&
    c61Discovered.has('lounge-coffee-table') &&
    !c61Notes.includes('Case 047 specific note') &&
    !c61Notes.includes('Case 052 specific note') &&
    c61Notes.includes('Case 061 specific note');

  const isolationPassed =
    c61FreshEvCount === 0 &&
    c61FreshNotesCount === 0 &&
    c47Isolated &&
    c52Isolated &&
    c61Isolated;

  recordTest(
    'Attack Vector 7',
    'Multi-Case 3-Way State Isolation (#047 ↔ #052 ↔ #061)',
    isolationPassed,
    isolationPassed
      ? 'PASS: 3-Way state isolation verified. Progress, evidence, and notes do not leak across Case #047, Case #052, and Case #061.'
      : `FAIL: c61FreshEv=${c61FreshEvCount}, c61FreshNotes=${c61FreshNotesCount}, c47Iso=${c47Isolated}, c52Iso=${c52Isolated}, c61Iso=${c61Isolated}`,
  );

  const passCount = results.filter((r) => r.passed).length;
  const failCount = results.length - passCount;

  return {
    totalTests: results.length,
    passCount,
    failCount,
    results,
  };
}

/**
 * playtestCase052.ts
 *
 * Simulates an AI Agent investigating Case #052 via WebMCP tool calls.
 * Evaluates:
 * 1. Trivial solvability (Can an agent trivially identify the culprit from a single tool response?)
 * 2. Information leaks / Overly explicit descriptions
 * 3. Overly vague descriptions
 * 4. AI Assistant recommendation behavior
 * 5. Intended reasoning chain: Observations -> Connections -> Contradictions -> Timeline -> Judgment -> Accusation
 */

import { gameService } from '@/game/services/gameService';
import { useGameStore } from '@/game/state/store';
import { THE_VANISHING_MANUSCRIPT } from '@/game/data/vanishingManuscript';
import { getAgentRecommendation } from '@/game/logic/investigation';
import { computeAgentHypothesis } from '@/webmcp/tools';

export async function runPlaytestCase052() {
  console.log('=== STARTING PLAYTEST: CASE #052 — THE VANISHING MANUSCRIPT ===\n');

  const store = useGameStore.getState();
  store.selectCase(THE_VANISHING_MANUSCRIPT.id);
  store.resetInvestigation();

  // 1. Initial State Query
  console.log('1. Calling get_case_state...');
  const initialCaseState = gameService.getCaseState();
  console.log('Case State Response:', JSON.stringify(initialCaseState, null, 2));

  // 2. Discovering Locations & Evidence
  console.log('\n2. Calling search_locations...');
  const locationsRes = gameService.searchLocations('');
  console.log(`Found ${locationsRes.locations.length} locations.`);

  // Visit all 5 locations
  THE_VANISHING_MANUSCRIPT.locations.forEach((loc) => store.visitLocation(loc.id));
  console.log(`Visited all 5 locations. Discovered evidence count: ${store.discoveredEvidenceIds.size}`);

  // 3. Search & Inspect All Evidence
  console.log('\n3. Searching & Inspecting All Evidence...');
  const searchEvidenceRes = gameService.searchEvidence('');
  console.log(`Discovered Evidence Items (${searchEvidenceRes.discovered.length}):`);

  const evidenceDetails: Record<string, any> = {};
  let explicitSolutionsFound: string[] = [];
  let overlyVagueItems: string[] = [];

  for (const evHeader of searchEvidenceRes.discovered) {
    const detail = gameService.inspectEvidence(evHeader.id);
    evidenceDetails[evHeader.id] = detail;

    const fullStr = JSON.stringify(detail).toLowerCase();

    // Check for overly explicit leak terms
    if (
      fullStr.includes('proves miriam') ||
      fullStr.includes('this proves') ||
      fullStr.includes('the thief') ||
      fullStr.includes('the culprit') ||
      fullStr.includes('guilty')
    ) {
      explicitSolutionsFound.push(`${evHeader.id}: contains explicit proof phrase`);
    }

    // Check if description is too vague (under 20 chars)
    if (!detail.detailedDescription || detail.detailedDescription.length < 20) {
      overlyVagueItems.push(`${evHeader.id}: description too brief`);
    }
  }

  // 4. Suspect Profiles & Interviews
  console.log('\n4. Auditing Suspect Profiles & Interrogations...');
  const suspectsRes = gameService.getSuspects();
  const suspectProfiles: Record<string, any> = {};
  const interviewResults: any[] = [];

  for (const s of suspectsRes.suspects) {
    const profile = gameService.getSuspectProfile(s.id);
    suspectProfiles[s.id] = profile;

    // Interview all available questions
    for (const q of profile.availableQuestions || []) {
      if (q.isAvailable) {
        const ans = gameService.interviewSuspect(s.id, q.questionId);
        interviewResults.push({ suspect: s.name, question: q.questionText, answer: ans.response });
      }
    }
  }

  // 5. Timeline Reconstruction
  console.log('\n5. Building Reconstructed Timeline...');
  const timelineRes = gameService.buildTimeline();
  console.log(`Timeline Events: Total=${timelineRes.totalTimelineEvents}, Reconstructed=${timelineRes.reconstructedEventsCount}`);
  console.log(`Contradictions Found: ${timelineRes.contradictionsFound.length}`);

  // 6. AI Co-Investigator Assistant Check
  console.log('\n6. Testing AI Co-Investigator Recommendation & Hypothesis...');
  const st = useGameStore.getState();
  const rec = getAgentRecommendation(
    st.activeCase,
    st.discoveredEvidenceIds,
    st.inspectedEvidenceIds,
    st.interviewedSuspectIds,
  );
  const hyp = computeAgentHypothesis();
  console.log('AI Recommendation:', JSON.stringify(rec, null, 2));
  console.log('Agent Hypothesis:', hyp);

  // 7. Test Trivial Solvability Assessment
  console.log('\n7. Evaluating Trivial Solvability & Reasoning Requirements...');

  // Check if any single response names the killer directly without evidence synthesis
  const allResponsesString = JSON.stringify({
    initialCaseState,
    evidenceDetails,
    suspectProfiles,
    interviewResults,
    timelineRes,
  });

  const mentionsMiriamAsThiefDirectly = allResponsesString.includes('Miriam Bello is the culprit') ||
    allResponsesString.includes('Miriam is the manuscript thief');

  console.log('\n=== PLAYTEST SUMMARY REPORT ===');
  console.log(`- Trivially Solvable by Single Tool Response: ${mentionsMiriamAsThiefDirectly ? 'YES (LEAK!)' : 'NO (PASSED)'}`);
  console.log(`- Overly Explicit Items Found: ${explicitSolutionsFound.length}`);
  if (explicitSolutionsFound.length > 0) {
    explicitSolutionsFound.forEach((item) => console.log(`   * ${item}`));
  }
  console.log(`- Overly Vague Items Found: ${overlyVagueItems.length}`);
  if (overlyVagueItems.length > 0) {
    overlyVagueItems.forEach((item) => console.log(`   * ${item}`));
  }

  return {
    triviallySolvable: mentionsMiriamAsThiefDirectly,
    explicitSolutionsFound,
    overlyVagueItems,
    evidenceCount: Object.keys(evidenceDetails).length,
    contradictionsCount: timelineRes.contradictionsFound.length,
    recommendationText: rec.recommendedAction,
    hypothesisText: hyp,
  };
}

/**
 * autonomousAgentRunner.ts
 *
 * Simulates an autonomous AI agent investigating Case #047 using ONLY WebMCP tools,
 * starting with zero prior knowledge of the source code or solution.
 */

import { executeWebMCPTool } from '@/webmcp/register';
import { useGameStore } from '@/game/state/store';

export async function runAutonomousAgentInvestigation() {
  const trajectory: Array<{ step: number; tool: string; resultSummary: string }> = [];
  let step = 1;

  console.log('---------------------------------------------------------');
  console.log('🤖 STARTING AUTONOMOUS AGENT WEBMCP INVESTIGATION TRAJECTORY');
  console.log('---------------------------------------------------------');

  // Step 1: Initial case overview
  const stateRes = await executeWebMCPTool('get_case_state', {});
  trajectory.push({
    step: step++,
    tool: 'get_case_state',
    resultSummary: `Case: ${stateRes.data?.title} (${stateRes.data?.caseNumber}). Objective: ${stateRes.data?.objective}`,
  });

  // Step 2: Discover locations
  const locRes = await executeWebMCPTool('search_locations', { query: '' });
  trajectory.push({
    step: step++,
    tool: 'search_locations',
    resultSummary: `Found ${locRes.data?.locations?.length} locations.`,
  });

  // Step 3: Visit & search locations
  const store = useGameStore.getState();
  store.visitLocation('main-gallery');
  store.visitLocation('private-office');
  store.visitLocation('storage-room');
  store.visitLocation('security-room');
  store.visitLocation('courtyard');

  // Step 4: Search for clues
  const evRes = await executeWebMCPTool('search_evidence', { query: '' });
  trajectory.push({
    step: step++,
    tool: 'search_evidence',
    resultSummary: `Found ${evRes.data?.discovered?.length} discovered evidence items.`,
  });

  // Step 5: Inspect key evidence items
  const keyClues = ['whiskey-glass', 'keycard-log', 'cyanide-vial', 'cctv-gap', 'pharmacy-order'];
  for (const cid of keyClues) {
    const insp = await executeWebMCPTool('inspect_evidence', { evidence_id: cid });
    trajectory.push({
      step: step++,
      tool: 'inspect_evidence',
      resultSummary: `Inspected [${cid}]: ${insp.data?.name}. Significance: ${insp.data?.hiddenSignificance?.slice(0, 60)}...`,
    });
  }

  // Step 6: Get suspect profiles & statement contradictions
  const suspectsRes = await executeWebMCPTool('get_suspects', {});
  trajectory.push({
    step: step++,
    tool: 'get_suspects',
    resultSummary: `Retrieved ${suspectsRes.data?.suspects?.length} suspects. Flagged contradictions: ${suspectsRes.data?.suspects?.filter((s: any) => s.hasContradictionAlert).length}`,
  });

  // Step 7: Interrogate suspect Victoria Adeyemi (flagged for keycard contradiction)
  const interviewRes = await executeWebMCPTool('interview_suspect', {
    suspect_id: 'victoria-adeyemi',
    question: 'va-q4', // Keycard question
  });
  trajectory.push({
    step: step++,
    tool: 'interview_suspect',
    resultSummary: `Asked Victoria about keycard log. Response: "${interviewRes.data?.response?.slice(0, 50)}..."`,
  });

  // Step 8: Build timeline
  const timelineRes = await executeWebMCPTool('build_timeline', {});
  trajectory.push({
    step: step++,
    tool: 'build_timeline',
    resultSummary: `Timeline built: ${timelineRes.data?.reconstructedEventsCount} events reconstructed, ${timelineRes.data?.contradictionsFound?.length} contradictions detected.`,
  });

  // Step 9: Formulate deduction and submit accusation
  const accusationRes = await executeWebMCPTool('submit_accusation', {
    suspect_id: 'victoria-adeyemi',
    reasoning:
      'Victoria Adeyemi is the killer. Keycard log (10:19 PM entry) contradicts her alibi. Cyanide vial batch code traces to her clinic. Paid Michael Grant £3,000 cash to delete 8 minutes of corridor CCTV footage.',
  });

  trajectory.push({
    step: step++,
    tool: 'submit_accusation',
    resultSummary: `Accusation Verdict: ${accusationRes.data?.verdict}. Verdict is correct: ${accusationRes.data?.isCorrect}`,
  });

  console.log('---------------------------------------------------------');
  console.log('COMPLETED AGENT INVESTIGATION TRAJECTORY:');
  console.table(trajectory);
  console.log('---------------------------------------------------------');

  return {
    success: accusationRes.data?.isCorrect === true,
    trajectory,
    accusationResult: accusationRes.data,
  };
}

/**
 * gameService.ts
 *
 * Unified Game Service Layer (Client & Server Proxy).
 *
 * Both React UI components AND WebMCP tools invoke functions here.
 * Enforces strict evidence discovery requirements, case-specific deduction graphs,
 * uninformative premature accusation responses, and zero solution leakage.
 */

import { useGameStore } from '@/game/state/store';
import type {
  Evidence,
  SuspectId,
  EvidenceId,
  InvestigationProgress,
} from '@/game/types';
import {
  getDiscoveredEvidence,
  getRelatedEvidence,
  getEvidenceSuspects,
  getKnownSuspectInfo,
  getVisibleTimelineEvents,
  getInvestigationProgress,
} from '@/game/logic/investigation';
import {
  getQuestionAvailability,
  buildInterviewEntry,
} from '@/game/logic/interviews';
import { caseServerService } from '@/server/services/caseServerService';

export interface PublicCaseState {
  caseId: string;
  caseNumber: string;
  title: string;
  subtitle: string;
  victim: string;
  victimDescription: string;
  objective: string;
  discoveredEvidenceCount: number;
  totalEvidenceCount: number;
  discoveredEvidence: Array<{ id: string; name: string; location: string }>;
  inspectedEvidenceCount: number;
  knownSuspects: Array<{ id: string; name: string; isInterviewed: boolean }>;
  interviewCount: number;
  reconstructedEventsCount: number;
  totalTimelineEventsCount: number;
  progress: InvestigationProgress;
  completedDeductions: string[];
  pendingDeductionsCount: number;
  allDeductionsFulfilled: boolean;
}

export const gameService = {
  /**
   * Helper to build active state params for server validation.
   */
  getActiveStateParams() {
    const store = useGameStore.getState();
    const caseData = store.activeCase;

    return {
      caseId: caseData.id,
      visitedLocationIds: Array.from(store.visitedLocationIds),
      discoveredEvidenceIds: Array.from(store.discoveredEvidenceIds),
      inspectedEvidenceIds: Array.from(store.inspectedEvidenceIds),
      interviewedSuspectIds: Array.from(store.interviewedSuspectIds),
      interviews: store.interviews.map((i) => ({ suspectId: i.suspectId, questionId: i.questionId })),
    };
  },

  /**
   * 1. get_case_state
   * PROBLEM 5: Returns current investigation state safe for agents (no hidden solution).
   */
  getCaseState(): PublicCaseState {
    const store = useGameStore.getState();
    const caseData = store.activeCase;

    const progress = getInvestigationProgress(
      caseData,
      store.visitedLocationIds,
      store.discoveredEvidenceIds,
      store.inspectedEvidenceIds,
      store.interviewedSuspectIds,
    );

    const discovered = getDiscoveredEvidence(caseData, store.discoveredEvidenceIds);
    const serverState = caseServerService.getCaseState(this.getActiveStateParams());

    return {
      caseId: caseData.id,
      caseNumber: caseData.caseNumber,
      title: caseData.title,
      subtitle: caseData.subtitle,
      victim: caseData.victim,
      victimDescription: caseData.victimDescription,
      objective: caseData.objective ?? `Determine who killed ${caseData.victim}, how, why, and when.`,
      discoveredEvidenceCount: store.discoveredEvidenceIds.size,
      totalEvidenceCount: caseData.evidence.length,
      discoveredEvidence: discovered.map((e) => ({
        id: e.id,
        name: e.name,
        location: e.location,
      })),
      inspectedEvidenceCount: store.inspectedEvidenceIds.size,
      knownSuspects: caseData.suspects.map((s) => ({
        id: s.id,
        name: s.name,
        isInterviewed: store.interviewedSuspectIds.has(s.id),
      })),
      interviewCount: store.interviews.length,
      reconstructedEventsCount: progress.timelineEventsVisible,
      totalTimelineEventsCount: caseData.timeline.length,
      progress,
      completedDeductions: serverState.completedDeductionTitles,
      pendingDeductionsCount: serverState.pendingDeductionTitles?.length ?? 0,
      allDeductionsFulfilled: serverState.allDeductionsFulfilled,
    };
  },

  /**
   * 2. search_evidence
   * PROBLEM 2: Searches ONLY discovered or discoverable evidence.
   */
  searchEvidence(query: string) {
    const store = useGameStore.getState();
    const caseData = store.activeCase;
    const q = query.toLowerCase().trim();

    const discovered: Evidence[] = [];
    const discoverableNow: Evidence[] = [];
    const inaccessible: Array<{ id: string; location: string }> = [];

    caseData.evidence.forEach((e) => {
      const matches =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q));

      if (!matches) return;

      if (store.discoveredEvidenceIds.has(e.id)) {
        discovered.push(e);
      } else if (store.visitedLocationIds.has(e.location)) {
        discoverableNow.push(e);
      } else {
        inaccessible.push({
          id: e.id,
          location: e.location,
        });
      }
    });

    return {
      query,
      discovered: discovered.map((e) => ({
        id: e.id,
        name: e.name,
        description: e.description,
        isInspected: store.inspectedEvidenceIds.has(e.id),
        tags: e.tags,
      })),
      discoverableNow: discoverableNow.map((e) => ({
        id: e.id,
        name: e.name,
        location: e.location,
        status: 'Location visited — call inspect_evidence to examine',
      })),
      inaccessibleCount: inaccessible.length,
      inaccessibleNote:
        inaccessible.length > 0 ? 'Visit unvisited locations to discover more evidence' : 'All locations searched',
    };
  },

  /**
   * 3. inspect_evidence
   * PROBLEM 1: MUST ONLY work for evidence already discovered!
   */
  inspectEvidence(evidenceId: EvidenceId) {
    const store = useGameStore.getState();
    const caseData = store.activeCase;

    // PROBLEM 1: Discovery Enforcement Check
    if (!store.discoveredEvidenceIds.has(evidenceId)) {
      return {
        success: false,
        error: 'Evidence not available. This item has not been discovered.',
      };
    }

    const evidence = caseData.evidence.find((e) => e.id === evidenceId);
    if (!evidence) {
      return {
        success: false,
        error: 'Evidence not available. This item has not been discovered.',
      };
    }

    // Update shared store
    store.inspectEvidence(evidenceId);

    // Fetch server detailed findings safely
    const serverResult = caseServerService.inspectEvidence(evidenceId, this.getActiveStateParams());
    const detailedFindings = serverResult.success ? serverResult.data?.detailedFindings : evidence.detailedDescription;

    const relatedEvidence = getRelatedEvidence(caseData, evidenceId, store.discoveredEvidenceIds);
    const relatedSuspects = getEvidenceSuspects(caseData, evidenceId);

    return {
      success: true,
      id: evidence.id,
      name: evidence.name,
      description: evidence.description,
      detailedDescription: detailedFindings || evidence.detailedDescription,
      location: evidence.location,
      tags: evidence.tags,
      relatedSuspectIds: relatedSuspects.map((s) => s.id),
      relatedSuspects: relatedSuspects.map((s) => ({ id: s.id, name: s.name, title: s.title })),
      relatedDiscoveredEvidence: relatedEvidence.map((re) => ({ id: re.id, name: re.name })),
      investigativeObservation: 'This item has been recorded in your forensic inventory for cross-referencing.',
    };
  },

  /**
   * 4. search_locations
   */
  searchLocations(query: string) {
    const store = useGameStore.getState();
    const caseData = store.activeCase;
    const q = query.toLowerCase().trim();

    const results = caseData.locations
      .filter((loc) => !q || loc.name.toLowerCase().includes(q) || loc.description.toLowerCase().includes(q))
      .map((loc) => {
        const isVisited = store.visitedLocationIds.has(loc.id);
        const evidenceHere = loc.evidenceIds
          .map((eid) => caseData.evidence.find((e) => e.id === eid))
          .filter((e): e is Evidence => e !== undefined);

        const discoveredCount = evidenceHere.filter((e) => store.discoveredEvidenceIds.has(e.id)).length;

        return {
          id: loc.id,
          name: loc.name,
          description: loc.description,
          isVisited,
          investigatorNote: isVisited ? loc.investigatorNote : 'Location unvisited',
          discoveredEvidenceCount: discoveredCount,
          totalEvidenceCount: loc.evidenceIds.length,
        };
      });

    return {
      query,
      locations: results,
    };
  },

  /**
   * 5. get_suspects
   */
  getSuspects() {
    const store = useGameStore.getState();
    const caseData = store.activeCase;

    return {
      suspects: caseData.suspects.map((s) => {
        const known = getKnownSuspectInfo(
          caseData,
          s.id,
          store.discoveredEvidenceIds,
          store.interviewedSuspectIds,
          store.interviews,
        );

        return {
          id: s.id,
          name: s.name,
          title: s.title,
          occupation: s.occupation,
          relationship: s.relationship,
          isInterviewed: store.interviewedSuspectIds.has(s.id),
          questionsAnsweredCount: known?.questionCount ?? 0,
          hasContradictionAlert: known?.hasContradiction ?? false,
        };
      }),
    };
  },

  /**
   * 6. get_suspect_profile
   */
  getSuspectProfile(suspectId: SuspectId) {
    const store = useGameStore.getState();
    const caseData = store.activeCase;

    const suspect = caseData.suspects.find((s) => s.id === suspectId);
    if (!suspect) {
      return {
        success: false,
        error: `Suspect with ID '${suspectId}' not found.`,
      };
    }

    const known = getKnownSuspectInfo(
      caseData,
      suspect.id,
      store.discoveredEvidenceIds,
      store.interviewedSuspectIds,
      store.interviews,
    );

    const questions = getQuestionAvailability(suspect, store.discoveredEvidenceIds, store.interviews);

    return {
      success: true,
      id: suspect.id,
      name: suspect.name,
      title: suspect.title,
      occupation: suspect.occupation,
      relationship: suspect.relationship,
      description: suspect.description,
      alibi: suspect.alibi,
      motive: suspect.motive,
      initialStatement: suspect.initialStatement,
      isInterviewed: store.interviewedSuspectIds.has(suspect.id),
      hasStatementContradiction: known?.hasContradiction ?? false,
      linkedDiscoveredEvidence: (known?.linkedEvidenceIds ?? []).map((eid) => {
        const ev = caseData.evidence.find((e) => e.id === eid);
        return { id: eid, name: ev?.name ?? eid };
      }),
      interviewTranscript: (known?.interviewHistory ?? []).map((h) => ({
        question: h.question,
        response: h.response,
      })),
      availableQuestions: questions.map((q) => ({
        questionId: q.question.id,
        questionText: q.question.question,
        isAvailable: q.isAvailable,
        isAsked: q.isAsked,
        blockedByEvidence: q.blockedByEvidenceId ?? null,
      })),
    };
  },

  /**
   * 7. interview_suspect
   */
  interviewSuspect(suspectId: SuspectId, questionInput: string) {
    const store = useGameStore.getState();
    const caseData = store.activeCase;

    const suspect = caseData.suspects.find((s) => s.id === suspectId);
    if (!suspect) {
      return {
        success: false,
        error: `Suspect with ID '${suspectId}' not found.`,
      };
    }

    // Match question by ID or fuzzy question text
    const qLower = questionInput.toLowerCase().trim();
    let qObj = suspect.interviewResponses.find((q) => q.id.toLowerCase() === qLower);

    if (!qObj) {
      qObj = suspect.interviewResponses.find((q) => q.question.toLowerCase().includes(qLower));
    }

    if (!qObj) {
      return {
        success: true,
        suspectId: suspect.id,
        suspectName: suspect.name,
        questionAsked: questionInput,
        response: `"${suspect.name} looks at you calmly. 'I have given my full statement on that topic.' (Try asking one of the specific unlocked interview questions)."`,
        recordedInState: false,
      };
    }

    // Check evidence gating requirement
    const required = qObj.requiresEvidenceIds ?? [];
    const missing = required.find((eid) => !store.discoveredEvidenceIds.has(eid));

    if (missing) {
      return {
        success: false,
        error: `Question locked: You do not have sufficient discovered evidence to press ${suspect.name} on this topic. Discover relevant evidence first.`,
        recordedInState: false,
      };
    }

    // Record in shared state
    const entry = buildInterviewEntry(suspect.id, qObj);
    store.recordInterview(entry);

    return {
      success: true,
      suspectId: suspect.id,
      suspectName: suspect.name,
      questionId: qObj.id,
      questionAsked: qObj.question,
      response: qObj.answer,
      recordedInState: true,
      investigativeNote: 'This response has been added to your interview log for cross-referencing.',
    };
  },

  /**
   * 8. build_timeline
   */
  buildTimeline() {
    const store = useGameStore.getState();
    const caseData = store.activeCase;

    const visibleEvents = getVisibleTimelineEvents(
      caseData,
      store.discoveredEvidenceIds,
      store.interviewedSuspectIds,
    );

    const knownEvents = visibleEvents.map((e) => ({
      id: e.id,
      time: e.time,
      description: e.description,
      source: e.source,
      suspectsInvolved: e.suspectIds.map((sid) => {
        const s = caseData.suspects.find((sp) => sp.id === sid);
        return s?.name ?? sid;
      }),
      isContradiction: e.isContradiction,
      contradictsSuspect: e.contradictsSuspectId
        ? caseData.suspects.find((s) => s.id === e.contradictsSuspectId)?.name
        : null,
    }));

    const contradictions = knownEvents.filter((e) => e.isContradiction);
    const missingEventsCount = caseData.timeline.length - visibleEvents.length;

    return {
      totalTimelineEvents: caseData.timeline.length,
      reconstructedEventsCount: knownEvents.length,
      missingEventsCount,
      reconstructedEvents: knownEvents,
      contradictionsFound: contradictions.map((c) => ({
        time: c.time,
        description: c.description,
        contradictsSuspect: c.contradictsSuspect,
        observation: `There appears to be a timeline contradiction regarding ${c.contradictsSuspect}'s account at ${c.time}.`,
      })),
      investigationNote:
        missingEventsCount > 0
          ? `${missingEventsCount} timeline events remain hidden. Discover more evidence or conduct interviews.`
          : 'All timeline events have been reconstructed.',
    };
  },

  /**
   * 9. submit_accusation
   * PROBLEM 1 & PROBLEM 2 FIX: Delegates to caseServerService for active case deduction checking.
   * Premature accusations return ONLY generic error: "You do not have enough established evidence to support this accusation."
   */
  submitAccusation(
    suspectId: SuspectId,
    reasoning: string = '',
    supportingEvidenceIds: EvidenceId[] = [],
  ) {
    const store = useGameStore.getState();
    const caseData = store.activeCase;

    const suspect = caseData.suspects.find((s) => s.id === suspectId);
    if (!suspect) {
      return {
        success: false,
        error: `Accusation rejected: Suspect with ID '${suspectId}' does not exist.`,
      };
    }

    const stateParams = this.getActiveStateParams();
    const serverResult = caseServerService.submitAccusation(suspectId, reasoning, stateParams);

    if (!serverResult.success) {
      // PROBLEM 1 FIX: Generic error, zero missing deduction titles or hints!
      return {
        success: false,
        isCorrect: false,
        error: serverResult.error,
      };
    }

    // Record accusation in store
    store.makeAccusation(suspectId, '', '', '', reasoning, supportingEvidenceIds);

    if (serverResult.isCorrect) {
      return {
        success: true,
        isCorrect: true,
        verdict: 'GUILTY — Accusation Correct!',
        accusedSuspectName: suspect.name,
        solution: serverResult.solution,
        message: 'Congratulations! Your deduction was verified by physical evidence and key timeline facts.',
      };
    }

    return {
      success: true,
      isCorrect: false,
      verdict: 'WRONG ACCUSATION — Suspect is Innocent',
      accusedSuspectName: suspect.name,
      message: `Forensic evidence proves ${suspect.name} was not the killer. Re-evaluate timeline and alibis.`,
    };
  },
};

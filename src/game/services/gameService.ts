/**
 * gameService.ts
 *
 * Unified Game Service Layer.
 *
 * Both the React UI components AND WebMCP tools invoke functions here.
 * This guarantees a single source of truth and identical state behavior
 * regardless of whether a human or AI agent takes an action.
 */

import { useGameStore } from '@/game/state/store';
import type {
  Case,
  Evidence,
  Suspect,
  Location,
  TimelineEvent,
  EvidenceId,
  SuspectId,
  LocationId,
  InterviewEntry,
  InvestigationProgress,
} from '@/game/types';
import {
  getLocationEvidence,
  getDiscoveredEvidence,
  getEvidenceStatus,
  getRelatedEvidence,
  getEvidenceSuspects,
  getKnownSuspectInfo,
  getVisibleTimelineEvents,
  getInvestigationProgress,
} from '@/game/logic/investigation';
import {
  getQuestionAvailability,
  getInterviewResponse,
  buildInterviewEntry,
} from '@/game/logic/interviews';

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
}

export const gameService = {
  /**
   * 1. get_case_state
   * Returns current investigation state safe for agents (no hidden solution).
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

    return {
      caseId: caseData.id,
      caseNumber: caseData.caseNumber,
      title: caseData.title,
      subtitle: caseData.subtitle,
      victim: caseData.victim,
      victimDescription: caseData.victimDescription,
      objective: 'Determine who killed Daniel Adeyemi, how, why, and when.',
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
    };
  },

  /**
   * 2. search_evidence
   * Searches evidence. Distinguishes:
   * - Already discovered
   * - Discoverable (in visited locations but not yet discovered)
   * - Inaccessible (in unvisited locations)
   */
  searchEvidence(query: string) {
    const store = useGameStore.getState();
    const caseData = store.activeCase;
    const q = query.toLowerCase().trim();

    const discovered: Evidence[] = [];
    const discoverableNow: Evidence[] = [];
    const inaccessible: Array<{ id: string; name: string; location: string }> = [];

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
          name: e.name,
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
      inaccessibleNote: inaccessible.length > 0 ? 'Visit unvisited locations to discover more evidence' : 'All locations searched',
    };
  },

  /**
   * 3. inspect_evidence
   * Examines evidence in detail and updates shared state.
   */
  inspectEvidence(evidenceId: EvidenceId) {
    const store = useGameStore.getState();
    const caseData = store.activeCase;

    const evidence = caseData.evidence.find((e) => e.id === evidenceId);
    if (!evidence) {
      throw new Error(`Evidence with ID '${evidenceId}' not found.`);
    }

    // Update shared state
    store.inspectEvidence(evidenceId);

    const relatedEvidence = getRelatedEvidence(caseData, evidenceId, store.discoveredEvidenceIds);
    const relatedSuspects = getEvidenceSuspects(caseData, evidenceId);

    return {
      id: evidence.id,
      name: evidence.name,
      description: evidence.description,
      detailedDescription: evidence.detailedDescription,
      location: evidence.location,
      tags: evidence.tags,
      relatedSuspects: relatedSuspects.map((s) => ({ id: s.id, name: s.name, title: s.title })),
      relatedDiscoveredEvidence: relatedEvidence.map((re) => ({ id: re.id, name: re.name })),
      isRedHerring: evidence.isRedHerring,
      hiddenSignificance: evidence.hiddenSignificance,
    };
  },

  /**
   * 4. search_locations
   * Searches and returns information about locations.
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
   * Returns all suspects available in the current case.
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
   * Returns available dossier for suspect based on current state.
   */
  getSuspectProfile(suspectId: SuspectId) {
    const store = useGameStore.getState();
    const caseData = store.activeCase;

    const suspect = caseData.suspects.find((s) => s.id === suspectId);
    if (!suspect) {
      throw new Error(`Suspect with ID '${suspectId}' not found.`);
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
   * Asks a question to a suspect, records it in shared state, returns response.
   */
  interviewSuspect(suspectId: SuspectId, questionInput: string) {
    const store = useGameStore.getState();
    const caseData = store.activeCase;

    const suspect = caseData.suspects.find((s) => s.id === suspectId);
    if (!suspect) {
      throw new Error(`Suspect with ID '${suspectId}' not found.`);
    }

    // Match question by ID or fuzzy question text
    const qLower = questionInput.toLowerCase().trim();
    let qObj = suspect.interviewResponses.find((q) => q.id.toLowerCase() === qLower);

    if (!qObj) {
      qObj = suspect.interviewResponses.find((q) => q.question.toLowerCase().includes(qLower));
    }

    if (!qObj) {
      // Fallback response for unmapped questions
      return {
        suspectId: suspect.id,
        suspectName: suspect.name,
        questionAsked: questionInput,
        response: `"${suspect.name} looks at you coldly. 'I've already told you everything I know about that.' (Try asking one of the specific interview topics)."`,
        recordedInState: false,
      };
    }

    // Check evidence gating
    const required = qObj.requiresEvidenceIds ?? [];
    const missing = required.find((eid) => !store.discoveredEvidenceIds.has(eid));

    if (missing) {
      const missingEv = caseData.evidence.find((e) => e.id === missing);
      return {
        suspectId: suspect.id,
        suspectName: suspect.name,
        questionAsked: qObj.question,
        response: `"${suspect.name} dodges the question. You don't have enough evidence yet to press them on this topic (requires discovering ${missingEv?.name ?? 'relevant evidence'})."`,
        recordedInState: false,
      };
    }

    // Record in shared state
    const entry = buildInterviewEntry(suspect.id, qObj);
    store.recordInterview(entry);

    return {
      suspectId: suspect.id,
      suspectName: suspect.name,
      questionId: qObj.id,
      questionAsked: qObj.question,
      response: qObj.answer,
      recordedInState: true,
    };
  },

  /**
   * 8. build_timeline
   * Returns current timeline reconstructed from discovered evidence.
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
      })),
      investigationNote:
        missingEventsCount > 0
          ? `${missingEventsCount} timeline events remain hidden. Discover more evidence or conduct interviews.`
          : 'All timeline events have been reconstructed.',
    };
  },

  /**
   * 9. submit_accusation
   * Evaluates an accusation against the actual solution.
   */
  submitAccusation(suspectId: SuspectId, reasoning: string) {
    const store = useGameStore.getState();
    const caseData = store.activeCase;
    const solution = caseData.solution;

    const suspect = caseData.suspects.find((s) => s.id === suspectId);
    if (!suspect) {
      throw new Error(`Suspect with ID '${suspectId}' not found.`);
    }

    const isCorrect = suspectId === solution.killerId;

    // Check which key solution evidence items the player/agent has discovered
    const keyDiscovered = solution.keyEvidenceIds.filter((eid) =>
      store.discoveredEvidenceIds.has(eid),
    );
    const keyMissing = solution.keyEvidenceIds.filter(
      (eid) => !store.discoveredEvidenceIds.has(eid),
    );

    const supportingEvidence = keyDiscovered.map((eid) => {
      const e = caseData.evidence.find((item) => item.id === eid);
      return { id: eid, name: e?.name ?? eid };
    });

    const missingEvidence = keyMissing.map((eid) => {
      const e = caseData.evidence.find((item) => item.id === eid);
      return { id: eid, name: e?.name ?? eid };
    });

    // Record accusation in store
    store.makeAccusation(suspectId);

    return {
      accusation: {
        accusedSuspectId: suspect.id,
        accusedSuspectName: suspect.name,
        reasoningSubmitted: reasoning,
      },
      isCorrect,
      verdict: isCorrect ? 'GUILTY — Accusation Correct!' : 'WRONG ACCUSATION — Suspect is Innocent',
      actualKiller: isCorrect ? suspect.name : '(Revealed on resolution page)',
      supportingEvidenceFound: supportingEvidence,
      keyEvidenceMissing: missingEvidence,
      caseOutcome: isCorrect
        ? `Congratulations! ${suspect.name} was successfully convicted based on key evidence.`
        : `The case remains open. ${suspect.name} has a valid defense and could not be convicted.`,
    };
  },
};

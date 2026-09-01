/**
 * registry.ts
 *
 * Central Case Registry for Casefile.
 * Registers active playable cases and metadata for upcoming cases.
 */

import type { Case, CaseMetadata } from '@/game/types';
import { THE_GALLERY_MURDER } from '@/game/data/galleryMurder';
import { THE_VANISHING_MANUSCRIPT } from '@/game/data/vanishingManuscript';
import { DEATH_ON_PLATFORM_6 } from '@/game/data/deathOnPlatform6';

// ─── Playable Cases Map ───────────────────────────────────────────────────────

const PLAYABLE_CASES: Record<string, Case> = {
  [THE_GALLERY_MURDER.id]: THE_GALLERY_MURDER,
  [THE_VANISHING_MANUSCRIPT.id]: THE_VANISHING_MANUSCRIPT,
  [DEATH_ON_PLATFORM_6.id]: DEATH_ON_PLATFORM_6,
};

// ─── Case Summaries Directory ─────────────────────────────────────────────────

export const ALL_CASE_SUMMARIES: CaseMetadata[] = [
  {
    id: THE_GALLERY_MURDER.id,
    caseNumber: THE_GALLERY_MURDER.caseNumber,
    title: THE_GALLERY_MURDER.title,
    subtitle: THE_GALLERY_MURDER.subtitle,
    difficulty: THE_GALLERY_MURDER.difficulty ?? 'Intermediate',
    estimatedTime: THE_GALLERY_MURDER.estimatedTime ?? '20-30 mins',
    status: 'available',
    victim: THE_GALLERY_MURDER.victim,
    victimDescription: THE_GALLERY_MURDER.victimDescription,
    briefing: THE_GALLERY_MURDER.briefing,
    objective: THE_GALLERY_MURDER.objective,
  },
  {
    id: THE_VANISHING_MANUSCRIPT.id,
    caseNumber: THE_VANISHING_MANUSCRIPT.caseNumber,
    title: THE_VANISHING_MANUSCRIPT.title,
    subtitle: THE_VANISHING_MANUSCRIPT.subtitle,
    difficulty: THE_VANISHING_MANUSCRIPT.difficulty ?? 'Advanced',
    estimatedTime: THE_VANISHING_MANUSCRIPT.estimatedTime ?? '25-35 mins',
    status: 'available',
    victim: THE_VANISHING_MANUSCRIPT.victim,
    victimDescription: THE_VANISHING_MANUSCRIPT.victimDescription,
    briefing: THE_VANISHING_MANUSCRIPT.briefing,
    objective: THE_VANISHING_MANUSCRIPT.objective,
  },
  {
    id: DEATH_ON_PLATFORM_6.id,
    caseNumber: DEATH_ON_PLATFORM_6.caseNumber,
    title: DEATH_ON_PLATFORM_6.title,
    subtitle: DEATH_ON_PLATFORM_6.subtitle,
    difficulty: DEATH_ON_PLATFORM_6.difficulty ?? 'Expert',
    estimatedTime: DEATH_ON_PLATFORM_6.estimatedTime ?? '30-40 mins',
    status: 'available',
    victim: DEATH_ON_PLATFORM_6.victim,
    victimDescription: DEATH_ON_PLATFORM_6.victimDescription,
    briefing: DEATH_ON_PLATFORM_6.briefing,
    objective: DEATH_ON_PLATFORM_6.objective,
  },
  {
    id: 'cryptic-heiress-048',
    caseNumber: '#048',
    title: 'The Cryptic Heiress',
    subtitle: 'A sealed room mystery',
    difficulty: 'Advanced',
    estimatedTime: '30-45 mins',
    status: 'coming_soon',
    victim: 'Elena Vance',
    victimDescription: 'Billionaire tech heiress and venture capitalist. Found unconscious in a cipher-locked vault during an estate party.',
    briefing: 'Elena Vance, 34, disappeared from her private wing during a family summit. The smart lock logs show no unauthorized entry, yet her private ledger was stolen and a lethal neurotoxin was detected in her mint tea. Three relatives and two engineers were present.',
    objective: 'Bypass the cipher trail, isolate timeline contradictions, and uncover who targeted Elena Vance.',
  },
  {
    id: 'midnight-docks-049',
    caseNumber: '#049',
    title: 'Midnight at the Docks',
    subtitle: 'Shadows over the harbor',
    difficulty: 'Expert',
    estimatedTime: '45-60 mins',
    status: 'coming_soon',
    victim: 'Captain Sean Miller',
    victimDescription: 'Veteran harbor master and logistics tycoon. Discovered dead inside Container #904 under dockside CCTV surveillance.',
    briefing: 'Captain Sean Miller was found poisoned inside a sealed shipping container at Pier 14. Customs logs indicate the container was sealed from the outside, but CCTV footage reveals a 12-minute optical loophole exploited by a professional insider.',
    objective: 'Decode maritime manifests, trace toxicological origin, and expose the dockside conspiracy.',
  },
];

// ─── Registry Helpers ─────────────────────────────────────────────────────────

export function getDefaultCaseId(): string {
  return THE_GALLERY_MURDER.id;
}

export function getCaseById(id: string): Case | undefined {
  return PLAYABLE_CASES[id];
}

export function getAllCaseSummaries(): CaseMetadata[] {
  return ALL_CASE_SUMMARIES;
}

export function getPlayableCases(): Case[] {
  return Object.values(PLAYABLE_CASES);
}

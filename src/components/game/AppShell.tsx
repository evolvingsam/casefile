'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/game/state/store';
import type { AppPhase, WorkspaceView } from '@/game/types';
import { LandingPage }             from '@/components/game/LandingPage';
import { BriefingPage }            from '@/components/game/BriefingPage';
import { InvestigationWorkspace }  from '@/components/layout/InvestigationWorkspace';
import { ResolutionPage }          from '@/components/game/ResolutionPage';

// Parse phase and view from window.location.hash
function parseHash(): { phase: AppPhase | null; view: WorkspaceView | null } {
  if (typeof window === 'undefined') return { phase: null, view: null };
  const hashStr = window.location.hash.replace(/^#/, '').trim();
  if (!hashStr) return { phase: null, view: null };

  const [phasePart, queryPart] = hashStr.split('?');
  const validPhases: AppPhase[] = ['landing', 'briefing', 'investigation', 'resolution'];
  const phase = validPhases.includes(phasePart as AppPhase) ? (phasePart as AppPhase) : null;

  let view: WorkspaceView | null = null;
  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    const v = params.get('view');
    const validViews: WorkspaceView[] = [
      'overview',
      'locations',
      'evidence',
      'suspects',
      'timeline',
      'caseboard',
      'agent',
    ];
    if (v && validViews.includes(v as WorkspaceView)) {
      view = v as WorkspaceView;
    }
  }

  return { phase, view };
}

// Build hash string from phase and view
function buildHash(phase: AppPhase, view: WorkspaceView): string {
  if (phase === 'landing') return '';
  if (phase === 'investigation') {
    return view && view !== 'overview'
      ? `#investigation?view=${view}`
      : '#investigation';
  }
  return `#${phase}`;
}

export function AppShell() {
  const phase = useGameStore((s) => s.phase);
  const activeView = useGameStore((s) => s.activeView);
  const setPhase = useGameStore((s) => s.setPhase);
  const setActiveView = useGameStore((s) => s.setActiveView);

  const [isMounted, setIsMounted] = useState(false);

  // 1. Initial Hash Hydration on Mount
  useEffect(() => {
    setIsMounted(true);
    const { phase: initialPhase, view: initialView } = parseHash();

    if (initialPhase) {
      setPhase(initialPhase);
    }
    if (initialView) {
      setActiveView(initialView);
    }
  }, [setPhase, setActiveView]);

  // 2. Sync URL Hash whenever phase or activeView changes
  useEffect(() => {
    if (!isMounted) return;
    const newHash = buildHash(phase, activeView);
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash || window.location.pathname);
    }
  }, [phase, activeView, isMounted]);

  // 3. Listen to browser back/forward hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const { phase: hPhase, view: hView } = parseHash();
      if (hPhase && hPhase !== phase) setPhase(hPhase);
      if (hView && hView !== activeView) setActiveView(hView);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [phase, activeView, setPhase, setActiveView]);

  switch (phase) {
    case 'landing':       return <LandingPage />;
    case 'briefing':      return <BriefingPage />;
    case 'investigation': return <InvestigationWorkspace />;
    case 'resolution':    return <ResolutionPage />;
    default:              return <LandingPage />;
  }
}

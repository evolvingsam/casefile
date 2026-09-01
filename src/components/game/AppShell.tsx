'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/game/state/store';
import type { AppPhase, WorkspaceView } from '@/game/types';
import { LandingPage }             from '@/components/game/LandingPage';
import { CaseSelectionPage }       from '@/components/game/CaseSelectionPage';
import { BriefingPage }            from '@/components/game/BriefingPage';
import { InvestigationWorkspace }  from '@/components/layout/InvestigationWorkspace';
import { ResolutionPage }          from '@/components/game/ResolutionPage';

import { Navbar } from '@/components/layout/Navbar';

// Parse phase and view from window.location.hash
function parseHash(): { phase: AppPhase; view: WorkspaceView } {
  if (typeof window === 'undefined') return { phase: 'landing', view: 'overview' };
  const hashStr = window.location.hash.replace(/^#/, '').trim();
  if (!hashStr) return { phase: 'landing', view: 'overview' };

  const [phasePart, queryPart] = hashStr.split('?');
  const validPhases: AppPhase[] = ['landing', 'cases', 'briefing', 'investigation', 'resolution'];
  const phase: AppPhase = validPhases.includes(phasePart as AppPhase)
    ? (phasePart as AppPhase)
    : 'landing';

  let view: WorkspaceView = 'overview';
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
      'deductions',
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
  if (phase === 'landing') return '#landing';
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
    if (initialPhase) setPhase(initialPhase);
    if (initialView) setActiveView(initialView);
  }, [setPhase, setActiveView]);

  // 2. Sync URL Hash with pushState when phase or activeView changes
  useEffect(() => {
    if (!isMounted) return;
    const targetHash = buildHash(phase, activeView);
    if (window.location.hash !== targetHash) {
      window.history.pushState({ phase, activeView }, '', targetHash);
    }
  }, [phase, activeView, isMounted]);

  // 3. Listen to browser Back / Forward buttons (popstate & hashchange)
  useEffect(() => {
    const syncFromLocation = () => {
      const { phase: hPhase, view: hView } = parseHash();
      const currentStore = useGameStore.getState();
      if (hPhase !== currentStore.phase) setPhase(hPhase);
      if (hView !== currentStore.activeView) setActiveView(hView);
    };

    window.addEventListener('popstate', syncFromLocation);
    window.addEventListener('hashchange', syncFromLocation);
    return () => {
      window.removeEventListener('popstate', syncFromLocation);
      window.removeEventListener('hashchange', syncFromLocation);
    };
  }, [setPhase, setActiveView]);

  const renderCurrentPhase = () => {
    switch (phase) {
      case 'landing':
        return <LandingPage />;
      case 'cases':
        return <CaseSelectionPage />;
      case 'briefing':
        return <BriefingPage />;
      case 'investigation':
        return <InvestigationWorkspace />;
      case 'resolution':
        return <ResolutionPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-void text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar />
      <main key={`${phase}-${activeView}`} className="flex-1 flex flex-col animate-fade-in">
        {renderCurrentPhase()}
      </main>
    </div>
  );
}

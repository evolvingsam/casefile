'use client';

import { useGameStore } from '@/game/state/store';
import { LandingPage }             from '@/components/game/LandingPage';
import { BriefingPage }            from '@/components/game/BriefingPage';
import { InvestigationWorkspace }  from '@/components/layout/InvestigationWorkspace';
import { ResolutionPage }          from '@/components/game/ResolutionPage';

export function AppShell() {
  const phase = useGameStore((s) => s.phase);

  switch (phase) {
    case 'landing':       return <LandingPage />;
    case 'briefing':      return <BriefingPage />;
    case 'investigation': return <InvestigationWorkspace />;
    case 'resolution':    return <ResolutionPage />;
    default:              return <LandingPage />;
  }
}

'use client';

import { useGameStore } from '@/game/state/store';
import { WorkspaceSidebar } from '@/components/layout/WorkspaceSidebar';
import { OverviewView }   from '@/components/game/OverviewView';
import { LocationsView }  from '@/components/game/LocationsView';
import { EvidenceView }   from '@/components/game/EvidenceView';
import { SuspectsView }   from '@/components/game/SuspectsView';
import { TimelineView }   from '@/components/game/TimelineView';
import { CaseBoardView }  from '@/components/game/CaseBoardView';
import { AgentView }      from '@/components/game/AgentView';
import { Button } from '@/components/ui/Button';

function ViewRouter() {
  const activeView = useGameStore((s) => s.activeView);

  switch (activeView) {
    case 'overview':  return <OverviewView />;
    case 'locations': return <LocationsView />;
    case 'evidence':  return <EvidenceView />;
    case 'suspects':  return <SuspectsView />;
    case 'timeline':  return <TimelineView />;
    case 'caseboard': return <CaseBoardView />;
    case 'agent':     return <AgentView />;
    default:          return <OverviewView />;
  }
}

export function InvestigationWorkspace() {
  const setPhase = useGameStore((s) => s.setPhase);
  const activeCase = useGameStore((s) => s.activeCase);

  return (
    <div
      className="flex flex-col"
      style={{ height: '100dvh', background: 'var(--color-void)' }}
    >
      {/* Top bar */}
      <header
        className="flex items-center justify-between px-5 border-b shrink-0"
        style={{
          height: 52,
          background: 'var(--color-surface-1)',
          borderColor: 'var(--color-border-subtle)',
        }}
      >
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-bold tracking-wider"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: 'var(--color-amber)',
                letterSpacing: '0.15em',
              }}
            >
              CASEFILE
            </span>
          </div>

          <div
            className="h-4 w-px"
            style={{ background: 'var(--color-border)' }}
          />

          <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {activeCase.title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="text-xs px-2 py-1 rounded font-mono"
            style={{
              background: 'oklch(52% 0.22 18 / 0.1)',
              color: 'var(--color-crimson)',
              border: '1px solid oklch(52% 0.22 18 / 0.2)',
            }}
          >
            OPEN INVESTIGATION
          </span>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setPhase('resolution')}
          >
            Make Accusation
          </Button>
        </div>
      </header>

      {/* Body: sidebar + main content */}
      <div className="flex flex-1 overflow-hidden">
        <WorkspaceSidebar />

        <main className="flex-1 overflow-y-auto" style={{ background: 'var(--color-void)' }}>
          <ViewRouter />
        </main>
      </div>
    </div>
  );
}

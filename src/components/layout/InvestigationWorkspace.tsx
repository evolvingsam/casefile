'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/game/state/store';
import { registerWebMCP } from '@/webmcp/register';
import { WorkspaceSidebar } from '@/components/layout/WorkspaceSidebar';
import { AgentActivityPanel } from '@/components/layout/AgentActivityPanel';
import { AccusationModal } from '@/components/game/AccusationModal';
import { NotificationToast } from '@/components/ui/NotificationToast';
import { OverviewView }   from '@/components/game/OverviewView';
import { LocationsView }  from '@/components/game/LocationsView';
import { EvidenceView }   from '@/components/game/EvidenceView';
import { SuspectsView }   from '@/components/game/SuspectsView';
import { TimelineView }   from '@/components/game/TimelineView';
import { DeductionView }  from '@/components/game/DeductionView';
import { CaseBoardView }  from '@/components/game/CaseBoardView';
import { AgentView }      from '@/components/game/AgentView';
import { Button } from '@/components/ui/Button';

function ViewRouter() {
  const activeView = useGameStore((s) => s.activeView);

  switch (activeView) {
    case 'overview':   return <OverviewView />;
    case 'locations':  return <LocationsView />;
    case 'evidence':   return <EvidenceView />;
    case 'suspects':   return <SuspectsView />;
    case 'timeline':   return <TimelineView />;
    case 'deductions': return <DeductionView />;
    case 'caseboard':  return <CaseBoardView />;
    case 'agent':      return <AgentView />;
    default:           return <OverviewView />;
  }
}

function HeaderActivityTicker() {
  const toolActivity = useGameStore((s) => s.toolActivity);
  const latest = toolActivity[toolActivity.length - 1];

  if (!latest) return null;

  const isRunning = latest.status === 'running';
  const isError = latest.status === 'error';

  let prefix = '✓ ';
  let badgeColor = 'var(--color-amber)';

  if (isRunning) {
    prefix = '→ ';
  } else if (isError) {
    prefix = '✗ ';
    badgeColor = 'var(--color-crimson)';
  }

  return (
    <div
      id="header-activity-ticker"
      className="hidden lg:flex items-center gap-2 px-3 py-1 rounded bg-[var(--color-surface-hover)] border border-[var(--color-border-subtle)] text-xs font-mono"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
      <span className="font-bold uppercase text-[10px] tracking-wider shrink-0" style={{ color: badgeColor }}>
        AI INVESTIGATION:
      </span>
      <span className="text-[var(--color-text-secondary)] truncate max-w-xs">
        {prefix}{latest.summary || `${latest.tool} executed`}
      </span>
    </div>
  );
}

export function InvestigationWorkspace() {
  const activeCase = useGameStore((s) => s.activeCase);
  const [showAccusationModal, setShowAccusationModal] = useState(false);

  // Register WebMCP tools when workspace mounts
  useEffect(() => {
    registerWebMCP();
  }, []);

  return (
    <div
      className="flex flex-col relative flex-1"
      style={{ background: 'var(--color-void)' }}
    >
      {/* Toast Notification Container */}
      <NotificationToast />

      {/* Accusation Modal */}
      {showAccusationModal && (
        <AccusationModal onClose={() => setShowAccusationModal(false)} />
      )}

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
          {/* Header AI Investigation Live Ticker */}
          <HeaderActivityTicker />

          <span
            className="text-xs px-2.5 py-1 rounded font-mono flex items-center gap-1.5"
            style={{
              background: 'oklch(75% 0.18 75 / 0.1)',
              color: 'var(--color-amber)',
              border: '1px solid oklch(75% 0.18 75 / 0.25)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            WEBMCP ACTIVE (9 TOOLS)
          </span>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowAccusationModal(true)}
          >
            Make Accusation
          </Button>
        </div>
      </header>

      {/* Body: sidebar + main content + persistent Agent Activity panel */}
      <div className="flex flex-1 overflow-hidden">
        <WorkspaceSidebar />

        <main className="flex-1 overflow-y-auto" style={{ background: 'var(--color-void)' }}>
          <ViewRouter />
        </main>

        <AgentActivityPanel />
      </div>
    </div>
  );
}

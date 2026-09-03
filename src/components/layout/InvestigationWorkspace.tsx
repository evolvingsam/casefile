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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Register WebMCP tools when workspace mounts
  useEffect(() => {
    registerWebMCP();
  }, []);

  return (
    <div
      className="flex flex-col relative flex-1 min-w-0"
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
        className="flex items-center justify-between px-3 md:px-5 border-b shrink-0 flex-wrap gap-y-2 py-2 md:py-0 min-h-[52px]"
        style={{
          background: 'var(--color-surface-1)',
          borderColor: 'var(--color-border-subtle)',
        }}
      >
        <div className="flex items-center gap-3">
          {/* Hamburger Menu (Mobile Only) */}
          <button
            className="md:hidden p-1 rounded hover:bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]"
            onClick={() => setIsSidebarOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

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
            className="hidden sm:block h-4 w-px"
            style={{ background: 'var(--color-border)' }}
          />

          <span className="text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[200px]" style={{ color: 'var(--color-text-muted)' }}>
            {activeCase.title}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Header AI Investigation Live Ticker */}
          <HeaderActivityTicker />

          <span
            className="hidden sm:flex text-xs px-2.5 py-1 rounded font-mono items-center gap-1.5"
            style={{
              background: 'oklch(75% 0.18 75 / 0.1)',
              color: 'var(--color-amber)',
              border: '1px solid oklch(75% 0.18 75 / 0.25)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            WEBMCP ACTIVE
          </span>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowAccusationModal(true)}
            className="text-xs sm:text-sm px-2 sm:px-4"
          >
            Accuse
          </Button>
        </div>
      </header>

      {/* Body: sidebar + main content + persistent Agent Activity panel */}
      <div className="flex flex-1 overflow-hidden min-w-0 relative">
        <WorkspaceSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto min-w-0" style={{ background: 'var(--color-void)' }}>
          <ViewRouter />
        </main>

        <AgentActivityPanel />
      </div>
    </div>
  );
}

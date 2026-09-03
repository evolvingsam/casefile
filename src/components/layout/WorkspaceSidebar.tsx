'use client';

import { useGameStore } from '@/game/state/store';
import type { WorkspaceView } from '@/game/types';

interface NavItem {
  id: WorkspaceView;
  label: string;
  icon: string;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview',   label: 'Overview',      icon: '◉', description: 'Case summary' },
  { id: 'locations',  label: 'Locations',     icon: '⌖', description: 'Crime scene & areas' },
  { id: 'evidence',   label: 'Evidence',      icon: '🔍', description: 'Physical clues' },
  { id: 'suspects',   label: 'Suspects',      icon: '👤', description: 'Persons of interest' },
  { id: 'timeline',   label: 'Timeline',      icon: '◷', description: 'Sequence of events' },
  { id: 'deductions', label: 'Deductions',    icon: '🧠', description: 'Reasoning & Hypotheses' },
  { id: 'caseboard',  label: 'Case Board',    icon: '⊞', description: 'Connect the dots' },
  { id: 'agent',      label: 'AI Agent',      icon: '◈', description: 'Agent activity' },
];

export function WorkspaceSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const activeView = useGameStore((s) => s.activeView);
  const setActiveView = useGameStore((s) => s.setActiveView);
  const activeCase = useGameStore((s) => s.activeCase);
  const agentActions = useGameStore((s) => s.agentActions);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`flex-col h-full border-r absolute md:relative z-50 md:z-auto transition-transform duration-300 ${
          isOpen ? 'translate-x-0 flex' : '-translate-x-full md:translate-x-0 hidden md:flex'
        }`}
        style={{
          width: 'var(--nav-width)',
          minWidth: 'var(--nav-width)',
          background: 'var(--color-surface-1)',
          borderColor: 'var(--color-border-subtle)',
        }}
      >
        {/* Case Identity */}
        <div className="p-4 border-b space-y-2 relative" style={{ borderColor: 'var(--color-border-subtle)' }}>
          {/* Mobile Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden absolute top-3 right-3 p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          )}
          
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2 pr-6">
              <span
                className="text-xs font-mono tracking-widest uppercase"
                style={{ color: 'var(--color-crimson)' }}
              >
                CASE FILE
              </span>
              <span
                className="text-xs font-mono truncate"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {activeCase.caseNumber}
              </span>
            </div>
          </div>
          <div>
            <h2
              className="text-sm font-semibold leading-tight break-words"
              style={{ fontFamily: 'var(--font-playfair)', color: 'var(--color-text-primary)' }}
            >
              {activeCase.title}
            </h2>
            <p className="text-xs mt-0.5 break-words" style={{ color: 'var(--color-text-muted)' }}>
              {activeCase.subtitle}
            </p>
          </div>
          <button
            onClick={() => useGameStore.getState().setPhase('cases')}
            className="text-[10px] font-mono px-2 py-0.5 rounded border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-colors w-full mt-2"
            title="Switch Investigation Case"
          >
            SWITCH CASE
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto">
          <ul className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeView === item.id;
              const hasNotif = item.id === 'agent' && agentActions.length > 0;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveView(item.id);
                      if (onClose) onClose();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all duration-150 min-w-0"
                    style={{
                      background: isActive ? 'oklch(75% 0.18 75 / 0.08)' : 'transparent',
                      color: isActive
                        ? 'var(--color-amber)'
                        : 'var(--color-text-secondary)',
                      borderLeft: isActive
                        ? '2px solid var(--color-amber)'
                        : '2px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.background =
                          'var(--color-surface-2)';
                        (e.currentTarget as HTMLElement).style.color =
                          'var(--color-text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                        (e.currentTarget as HTMLElement).style.color =
                          'var(--color-text-secondary)';
                      }
                    }}
                  >
                    <span className="text-base w-5 text-center shrink-0">{item.icon}</span>
                    <span className="flex-1 text-sm font-medium truncate min-w-0">{item.label}</span>
                    {hasNotif && (
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: 'var(--color-amber)' }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Progress Footer */}
        <div
          className="p-4 border-t"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
            <span>Evidence found</span>
            <span style={{ color: 'var(--color-amber)' }}>
              {discoveredEvidenceIds.size}/{activeCase.evidence.length}
            </span>
          </div>
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ background: 'var(--color-surface-3)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (discoveredEvidenceIds.size / Math.max(1, activeCase.evidence.length)) * 100)}%`,
                background: 'var(--color-amber)',
              }}
            />
          </div>
          <p className="text-xs mt-2 break-words" style={{ color: 'var(--color-text-muted)' }}>
            Victim: <span style={{ color: 'var(--color-text-secondary)' }}>{activeCase.victim}</span>
          </p>
        </div>
      </aside>
    </>
  );
}

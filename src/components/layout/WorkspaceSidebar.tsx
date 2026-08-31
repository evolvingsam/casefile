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
  { id: 'caseboard',  label: 'Case Board',    icon: '⊞', description: 'Connect the dots' },
  { id: 'agent',      label: 'AI Agent',      icon: '◈', description: 'Agent activity' },
];

export function WorkspaceSidebar() {
  const activeView = useGameStore((s) => s.activeView);
  const setActiveView = useGameStore((s) => s.setActiveView);
  const activeCase = useGameStore((s) => s.activeCase);
  const agentActions = useGameStore((s) => s.agentActions);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);

  return (
    <aside
      className="flex flex-col h-full border-r"
      style={{
        width: 'var(--nav-width)',
        minWidth: 'var(--nav-width)',
        background: 'var(--color-surface-1)',
        borderColor: 'var(--color-border-subtle)',
      }}
    >
      {/* Case Identity */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: 'var(--color-crimson)' }}
          >
            CASE FILE
          </span>
          <span
            className="text-xs font-mono"
            style={{ color: 'var(--color-text-muted)' }}
          >
            #001
          </span>
        </div>
        <h2
          className="text-sm font-semibold leading-tight"
          style={{ fontFamily: 'var(--font-playfair)', color: 'var(--color-text-primary)' }}
        >
          {activeCase.title}
        </h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          {activeCase.subtitle}
        </p>
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
                  onClick={() => setActiveView(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all duration-150"
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
                  <span className="flex-1 text-sm font-medium">{item.label}</span>
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
        <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
          Victim: <span style={{ color: 'var(--color-text-secondary)' }}>{activeCase.victim}</span>
        </p>
      </div>
    </aside>
  );
}

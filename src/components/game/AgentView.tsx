'use client';

import { useGameStore } from '@/game/state/store';

export function AgentView() {
  const agentActions = useGameStore((s) => s.agentActions);

  return (
    <div className="p-8 animate-fade-in space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: 'var(--color-amber)' }}
          >
            ◈ AI Agent
          </span>
          <div className="h-px flex-1" style={{ background: 'var(--color-border-subtle)' }} />
        </div>
        <h1
          className="text-3xl font-bold mb-1"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Agent Activity
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          The AI investigator operates through WebMCP tools — watching the same case you are.
        </p>
      </div>

      {/* WebMCP status card */}
      <div
        className="card p-5"
        style={{ borderColor: 'oklch(75% 0.18 75 / 0.2)' }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: agentActions.length > 0 ? 'var(--color-amber)' : 'var(--color-text-muted)' }}
          />
          <span className="text-sm font-medium">
            WebMCP Interface
          </span>
          <span className="badge badge-muted ml-auto">
            {agentActions.length > 0 ? 'Active' : 'Idle'}
          </span>
        </div>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          An external AI agent can connect via <code className="text-xs px-1 py-0.5 rounded" style={{ background: 'var(--color-surface-3)', color: 'var(--color-amber)' }}>navigator.modelContext</code> and use structured tools to investigate alongside you.
        </p>
      </div>

      {/* Activity feed */}
      {agentActions.length === 0 ? (
        <div
          className="card p-10 text-center"
          style={{ borderStyle: 'dashed' }}
        >
          <div className="text-4xl mb-4">◈</div>
          <h3
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            No agent activity yet
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            When an AI agent investigates this case, their tool calls will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {agentActions.map((action) => (
            <div key={action.id} className="card p-4 animate-slide-right">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs font-mono"
                  style={{ color: 'var(--color-amber)' }}
                >
                  {action.tool}
                </span>
                <span className="text-xs ml-auto" style={{ color: 'var(--color-text-muted)' }}>
                  {new Date(action.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {action.result}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

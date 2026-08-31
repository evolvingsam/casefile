'use client';

import { useGameStore } from '@/game/state/store';
import { Badge } from '@/components/ui/Badge';

export function AgentView() {
  const agentActions = useGameStore((s) => s.agentActions);
  const investigationLog = useGameStore((s) => s.investigationLog);

  return (
    <div className="p-6 md:p-8 animate-fade-in space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: 'var(--color-amber)' }}
          >
            🤖 AI Co-Investigator
          </span>
          <div className="h-px flex-1" style={{ background: 'var(--color-border-subtle)' }} />
        </div>
        <h1
          className="text-3xl font-bold mb-1"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Agent Collaboration Workspace
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Monitor AI co-investigator activity and shared investigation events.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: WebMCP Status */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-amber)' }}>
              WebMCP Connection
            </h3>
            <Badge variant="amber">Ready for WebMCP</Badge>
          </div>

          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            The WebMCP tool framework will expose structured tools to AI agents in Step 4. All investigation actions executed by the agent will appear here in real time.
          </p>

          <div
            className="p-4 rounded-lg text-xs space-y-2 font-mono"
            style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-muted)',
            }}
          >
            <p className="text-white font-semibold">Exposed Capabilities (Step 4 preview):</p>
            <ul className="list-disc list-inside space-y-1">
              <li>search_evidence(query)</li>
              <li>inspect_evidence(evidence_id)</li>
              <li>interview_suspect(suspect_id, question_id)</li>
              <li>reconstruct_timeline()</li>
              <li>recommend_accusation()</li>
            </ul>
          </div>
        </div>

        {/* Right: Shared Investigation Log */}
        <div className="card p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-amber)' }}>
            Investigation Activity Log ({investigationLog.length})
          </h3>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {investigationLog.length === 0 ? (
              <p className="text-xs italic py-4 text-center" style={{ color: 'var(--color-text-muted)' }}>
                No investigation events recorded yet. Start exploring locations!
              </p>
            ) : (
              [...investigationLog].reverse().map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg text-xs flex items-center justify-between"
                  style={{
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border-subtle)',
                  }}
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {event.description}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                      Type: {event.type}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

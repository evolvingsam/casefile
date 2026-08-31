'use client';

import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/game/state/store';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { executeWebMCPTool } from '@/webmcp/register';

export function AgentActivityPanel() {
  const agentActions = useGameStore((s) => s.agentActions);
  const agentHypothesis = useGameStore((s) => s.agentHypothesis);
  const setActiveView = useGameStore((s) => s.setActiveView);

  const [isExpanded, setIsExpanded] = useState(true);
  const [autoRunStep, setAutoRunStep] = useState(0);
  const [isRunningAgent, setIsRunningAgent] = useState(false);
  const feedEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when actions update
  useEffect(() => {
    if (isExpanded) {
      feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [agentActions.length, isExpanded]);

  // Automated agent sequence helper (for demoing agent operating the game)
  const runAgentSequenceStep = async () => {
    setIsRunningAgent(true);
    const steps = [
      { tool: 'get_case_state', params: {} },
      { tool: 'search_locations', params: { query: '' } },
      { tool: 'search_evidence', params: { query: 'whiskey' } },
      { tool: 'inspect_evidence', params: { evidence_id: 'whiskey-glass' } },
      { tool: 'inspect_evidence', params: { evidence_id: 'keycard-log' } },
      { tool: 'inspect_evidence', params: { evidence_id: 'cyanide-vial' } },
      { tool: 'get_suspect_profile', params: { suspect_id: 'victoria-adeyemi' } },
      { tool: 'interview_suspect', params: { suspect_id: 'victoria-adeyemi', question: 'va-q1' } },
      { tool: 'build_timeline', params: {} },
    ];

    const current = steps[autoRunStep % steps.length];
    try {
      await executeWebMCPTool(current.tool, current.params);
      setAutoRunStep((prev) => prev + 1);
    } catch {
      // Safe fallback
    } finally {
      setIsRunningAgent(false);
    }
  };

  const latestAction = agentActions[agentActions.length - 1];

  return (
    <aside
      className={`border-l flex flex-col transition-all duration-300 ${
        isExpanded ? 'w-80 lg:w-96' : 'w-12'
      }`}
      style={{
        background: 'var(--color-surface-1)',
        borderColor: 'var(--color-border-subtle)',
        height: '100%',
      }}
    >
      {/* Panel Header */}
      <div
        className="p-3 border-b flex items-center justify-between shrink-0"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        {isExpanded ? (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span
              className="text-xs font-mono font-bold uppercase tracking-widest"
              style={{ color: 'var(--color-amber)' }}
            >
              Agent Activity
            </span>
            <span className="text-[10px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
              ({agentActions.length})
            </span>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Agent Activity Stream Active" />
          </div>
        )}

        <button
          className="text-xs p-1 rounded hover:bg-surface-3 transition-colors cursor-pointer"
          style={{ color: 'var(--color-text-muted)' }}
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? 'Collapse Panel' : 'Expand Agent Activity Panel'}
        >
          {isExpanded ? '→|' : '|←'}
        </button>
      </div>

      {isExpanded && (
        <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
          {/* Quick Auto-Run WebMCP Agent Button */}
          <div className="shrink-0 flex items-center justify-between gap-2 p-3 rounded-lg" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border-subtle)' }}>
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                Simulate WebMCP Agent
              </p>
              <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                Trigger real WebMCP tool step
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={runAgentSequenceStep}
              disabled={isRunningAgent}
            >
              {isRunningAgent ? 'Running...' : '⚡ Step Agent'}
            </Button>
          </div>

          {/* Current Hypothesis Card */}
          <div
            className="p-3.5 rounded-lg text-xs leading-relaxed space-y-1 shrink-0"
            style={{
              background: 'oklch(75% 0.18 75 / 0.08)',
              border: '1px solid oklch(75% 0.18 75 / 0.25)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--color-amber)' }}>
                💡 Agent Working Hypothesis
              </span>
              <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                Live
              </span>
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {agentHypothesis ?? 'Gathering initial facts across crime scene locations.'}
            </p>
          </div>

          {/* Activity Event Stream */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {agentActions.length === 0 ? (
              <div className="text-center py-10 space-y-2 opacity-60">
                <span className="text-3xl">🤖</span>
                <p className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
                  Awaiting Agent Actions...
                </p>
                <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                  Click &quot;Step Agent&quot; above or use the WebMCP console to issue tool calls.
                </p>
              </div>
            ) : (
              agentActions.map((action, idx) => {
                const kind = action.kind ?? 'tool_call';
                const isWarning = action.status === 'warning' || kind === 'warning';
                const isDiscovery = kind === 'discovery';

                return (
                  <div
                    key={action.id || idx}
                    className="p-3 rounded-lg text-xs space-y-1.5 animate-fade-in transition-all"
                    style={{
                      background: isWarning
                        ? 'oklch(52% 0.22 18 / 0.08)'
                        : isDiscovery
                        ? 'oklch(75% 0.18 75 / 0.08)'
                        : 'var(--color-surface-2)',
                      border: isWarning
                        ? '1px solid oklch(52% 0.22 18 / 0.3)'
                        : isDiscovery
                        ? '1px solid oklch(75% 0.18 75 / 0.25)'
                        : '1px solid var(--color-border-subtle)',
                    }}
                  >
                    {/* Header line */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-semibold" style={{ color: 'var(--color-amber)' }}>
                        🛠 {action.tool}
                      </span>
                      <span className="text-[10px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
                        {new Date(action.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Parameters */}
                    {Object.keys(action.parameters || {}).length > 0 && (
                      <p className="font-mono text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                        Input: {JSON.stringify(action.parameters)}
                      </p>
                    )}

                    {/* Summary / Result */}
                    <p
                      className="text-xs leading-relaxed"
                      style={{
                        color: isWarning
                          ? 'var(--color-crimson)'
                          : isDiscovery
                          ? 'var(--color-amber)'
                          : 'var(--color-text-secondary)',
                      }}
                    >
                      {isWarning && '⚠️ '}
                      {isDiscovery && '✓ '}
                      {action.summary ?? action.result}
                    </p>
                  </div>
                );
              })
            )}
            <div ref={feedEndRef} />
          </div>

          {/* Footer CTA */}
          <div className="pt-2 border-t shrink-0 flex items-center justify-between text-[11px]" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>WebMCP Standard Active</span>
            <button
              className="underline cursor-pointer"
              style={{ color: 'var(--color-amber-dim)' }}
              onClick={() => setActiveView('agent')}
            >
              Open WebMCP Console →
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

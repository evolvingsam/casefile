'use client';

import { useState } from 'react';
import { useGameStore } from '@/game/state/store';
import { WEBMCP_TOOLS, type WebMCPToolDefinition } from '@/webmcp/tools';
import { executeWebMCPTool } from '@/webmcp/register';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function AgentView() {
  const agentActions = useGameStore((s) => s.agentActions);
  const investigationLog = useGameStore((s) => s.investigationLog);

  const [selectedTool, setSelectedTool] = useState<WebMCPToolDefinition>(WEBMCP_TOOLS[0]);
  const [paramInput, setParamInput] = useState<string>('{}');
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState<'tester' | 'logs' | 'schemas'>('tester');

  // Handle tool change and populate sample parameters
  const handleSelectTool = (tool: WebMCPToolDefinition) => {
    setSelectedTool(tool);
    setExecutionOutput(null);

    // Default sample parameters
    if (tool.name === 'search_evidence') setParamInput('{\n  "query": "whiskey"\n}');
    else if (tool.name === 'inspect_evidence') setParamInput('{\n  "evidence_id": "whiskey-glass"\n}');
    else if (tool.name === 'search_locations') setParamInput('{\n  "query": "office"\n}');
    else if (tool.name === 'get_suspect_profile') setParamInput('{\n  "suspect_id": "victoria-adeyemi"\n}');
    else if (tool.name === 'interview_suspect') setParamInput('{\n  "suspect_id": "victoria-adeyemi",\n  "question": "va-q1"\n}');
    else if (tool.name === 'submit_accusation') setParamInput('{\n  "suspect_id": "victoria-adeyemi",\n  "reasoning": "Cyanide vial matches clinic, keycard log at 10:19 PM, deleted CCTV."\n}');
    else setParamInput('{}');
  };

  const handleRunTool = async () => {
    setIsExecuting(true);
    setExecutionOutput(null);

    try {
      let parsedParams = {};
      if (paramInput.trim()) {
        parsedParams = JSON.parse(paramInput);
      }

      const res = await executeWebMCPTool(selectedTool.name, parsedParams);
      setExecutionOutput(JSON.stringify(res, null, 2));
    } catch (err: any) {
      setExecutionOutput(JSON.stringify({ error: err?.message || 'Execution error' }, null, 2));
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: 'var(--color-amber)' }}
          >
            🤖 WebMCP Console
          </span>
          <div className="h-px flex-1" style={{ background: 'var(--color-border-subtle)' }} />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1
              className="text-3xl font-bold mb-1"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              AI Agent &amp; WebMCP Workspace
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              All 9 investigation tools are exposed via WebMCP. Both AI subagents and humans operate on the exact same game state.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="amber">WebMCP 9/9 Tools Ready</Badge>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <button
          className="px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors"
          style={{
            background: activeTab === 'tester' ? 'var(--color-surface-3)' : 'transparent',
            color: activeTab === 'tester' ? 'var(--color-amber)' : 'var(--color-text-muted)',
            border: activeTab === 'tester' ? '1px solid var(--color-border)' : '1px solid transparent',
          }}
          onClick={() => setActiveTab('tester')}
        >
          ⚡ Tool Tester Console
        </button>
        <button
          className="px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors"
          style={{
            background: activeTab === 'logs' ? 'var(--color-surface-3)' : 'transparent',
            color: activeTab === 'logs' ? 'var(--color-amber)' : 'var(--color-text-muted)',
            border: activeTab === 'logs' ? '1px solid var(--color-border)' : '1px solid transparent',
          }}
          onClick={() => setActiveTab('logs')}
        >
          📜 Live Execution Log ({agentActions.length})
        </button>
        <button
          className="px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors"
          style={{
            background: activeTab === 'schemas' ? 'var(--color-surface-3)' : 'transparent',
            color: activeTab === 'schemas' ? 'var(--color-amber)' : 'var(--color-text-muted)',
            border: activeTab === 'schemas' ? '1px solid var(--color-border)' : '1px solid transparent',
          }}
          onClick={() => setActiveTab('schemas')}
        >
          📄 WebMCP Tool Schemas (9)
        </button>
      </div>

      {/* Tab 1: Tester Console */}
      {activeTab === 'tester' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tool Selector List */}
          <div className="lg:col-span-4 space-y-2">
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--color-text-muted)' }}>
              Select Tool to Invoke
            </p>
            <div className="space-y-1.5">
              {WEBMCP_TOOLS.map((t) => {
                const isSelected = selectedTool.name === t.name;
                return (
                  <button
                    key={t.name}
                    className="w-full text-left p-3 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-between"
                    style={{
                      background: isSelected ? 'oklch(75% 0.18 75 / 0.12)' : 'var(--color-surface-2)',
                      border: isSelected ? '1px solid var(--color-amber)' : '1px solid var(--color-border-subtle)',
                      color: isSelected ? 'var(--color-amber)' : 'var(--color-text-secondary)',
                    }}
                    onClick={() => handleSelectTool(t)}
                  >
                    <span className="font-mono font-semibold">{t.name}</span>
                    <span className="text-[10px] text-muted">→</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Execution Box */}
          <div className="lg:col-span-8 space-y-4">
            <div className="card p-5 space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-base font-bold font-mono" style={{ color: 'var(--color-amber)' }}>
                    {selectedTool.name}
                  </h3>
                  <Badge variant="muted">WebMCP Standard</Badge>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {selectedTool.description}
                </p>
              </div>

              {/* JSON Parameters Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                  Tool Parameters (JSON)
                </label>
                <textarea
                  className="w-full p-3 rounded-lg font-mono text-xs leading-relaxed"
                  style={{
                    background: 'var(--color-surface-1)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                    outline: 'none',
                  }}
                  rows={4}
                  value={paramInput}
                  onChange={(e) => setParamInput(e.target.value)}
                />
              </div>

              {/* Action */}
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Invokes <code className="text-amber-400">gameService.{selectedTool.name}()</code>
                </span>
                <Button variant="primary" size="sm" onClick={handleRunTool} disabled={isExecuting}>
                  {isExecuting ? 'Executing...' : '▶ Execute WebMCP Tool'}
                </Button>
              </div>

              {/* Output Display */}
              {executionOutput && (
                <div className="space-y-1.5 pt-2 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
                  <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--color-amber)' }}>
                    Structured WebMCP Response Output
                  </p>
                  <pre
                    className="p-4 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed max-h-72"
                    style={{
                      background: 'var(--color-surface-1)',
                      border: '1px solid var(--color-border-subtle)',
                      color: '#a6e22e',
                    }}
                  >
                    {executionOutput}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Execution Log */}
      {activeTab === 'logs' && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-amber)' }}>
              Shared Agent Action Log ({agentActions.length})
            </h3>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              All WebMCP tool invocations automatically update the shared game state
            </span>
          </div>

          <div className="space-y-3">
            {agentActions.length === 0 ? (
              <p className="text-xs italic py-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
                No WebMCP tool invocations recorded yet. Use the Tool Tester Console above to invoke a tool!
              </p>
            ) : (
              [...agentActions].reverse().map((action) => (
                <div
                  key={action.id}
                  className="p-4 rounded-lg text-xs space-y-2"
                  style={{
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border-subtle)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-400">
                      🤖 {action.tool}
                    </span>
                    <span className="font-mono text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                      {new Date(action.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="font-mono text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
                    Parameters: {JSON.stringify(action.parameters)}
                  </div>

                  <div
                    className="p-2.5 rounded font-mono text-[11px] overflow-x-auto"
                    style={{ background: 'var(--color-surface-1)', color: 'var(--color-text-muted)' }}
                  >
                    Result: {action.result}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Schemas */}
      {activeTab === 'schemas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WEBMCP_TOOLS.map((tool) => (
            <div key={tool.name} className="card p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-bold font-mono" style={{ color: 'var(--color-amber)' }}>
                  {tool.name}
                </h4>
                <Badge variant="muted">Schema</Badge>
              </div>

              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {tool.description}
              </p>

              <pre
                className="p-3 rounded font-mono text-[11px] overflow-x-auto leading-relaxed"
                style={{
                  background: 'var(--color-surface-1)',
                  border: '1px solid var(--color-border-subtle)',
                  color: 'var(--color-text-muted)',
                }}
              >
                {JSON.stringify(tool.inputSchema, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { useGameStore } from '@/game/state/store';

export function AIInvestigationActivity() {
  const toolActivity = useGameStore((s) => s.toolActivity);

  // Display the last 5 activities for a clean investigator view
  const recentActivities = toolActivity.slice(-5);

  return (
    <div
      id="ai-investigation-activity-container"
      className="p-3.5 rounded-xl border space-y-2.5 font-mono text-xs animate-fade-in"
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-bold tracking-widest uppercase text-[11px]" style={{ color: 'var(--color-amber)' }}>
            AI INVESTIGATION
          </span>
        </div>
        <span className="text-[10px] text-[var(--color-text-muted)] font-mono">
          WebMCP Activity
        </span>
      </div>

      {recentActivities.length === 0 ? (
        <p className="text-xs text-[var(--color-text-muted)] italic py-1">
          Awaiting investigator or agent tool execution...
        </p>
      ) : (
        <div className="space-y-1.5 pt-0.5">
          {recentActivities.map((act, idx) => {
            const isRunning = act.status === 'running';
            const isError = act.status === 'error';

            let prefix = '✓ ';
            let textColor = 'var(--color-text-secondary)';

            if (isRunning) {
              prefix = '→ ';
              textColor = 'var(--color-amber)';
            } else if (isError) {
              prefix = '✗ ';
              textColor = 'var(--color-crimson)';
            }

            return (
              <div
                key={act.id || idx}
                id={`activity-item-${act.id || idx}`}
                className="flex items-start gap-1.5 leading-snug font-mono text-[11px]"
                style={{ color: textColor }}
              >
                <span className="shrink-0 font-bold">{prefix}</span>
                <span className="truncate">{act.summary || `${act.tool} executed`}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/game/state/store';
import type { InvestigationEvent } from '@/game/types';

export function NotificationToast() {
  const investigationLog = useGameStore((s) => s.investigationLog);
  const [latestEvent, setLatestEvent] = useState<InvestigationEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (investigationLog.length === 0) return;
    const event = investigationLog[investigationLog.length - 1];

    setLatestEvent(event);
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, [investigationLog.length]);

  if (!visible || !latestEvent) return null;

  const isWarning =
    latestEvent.description.includes('Contradiction') ||
    latestEvent.description.includes('⚡');

  const isAgent = latestEvent.actor === 'agent';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-sm animate-slide-left p-4 rounded-xl shadow-2xl flex items-start gap-3 border pointer-events-auto"
      style={{
        background: isWarning
          ? 'oklch(12% 0.03 18 / 0.95)'
          : isAgent
          ? 'oklch(12% 0.03 75 / 0.95)'
          : 'var(--color-surface-2)',
        borderColor: isWarning
          ? 'var(--color-crimson)'
          : isAgent
          ? 'var(--color-amber)'
          : 'var(--color-border)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
        style={{
          background: isWarning
            ? 'oklch(52% 0.22 18 / 0.2)'
            : isAgent
            ? 'oklch(75% 0.18 75 / 0.2)'
            : 'var(--color-surface-3)',
          color: isWarning
            ? 'var(--color-crimson)'
            : isAgent
            ? 'var(--color-amber)'
            : 'var(--color-text-primary)',
        }}
      >
        {isWarning ? '⚡' : isAgent ? '🤖' : '🔍'}
      </div>

      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-widest"
            style={{
              color: isWarning
                ? 'var(--color-crimson)'
                : isAgent
                ? 'var(--color-amber)'
                : 'var(--color-text-muted)',
            }}
          >
            {isWarning
              ? 'Warning Alert'
              : isAgent
              ? 'Agent Activity'
              : 'Investigation Update'}
          </span>
          <span className="text-[9px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
            Just now
          </span>
        </div>

        <p className="text-xs leading-relaxed font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {latestEvent.description}
        </p>
      </div>

      <button
        onClick={() => setVisible(false)}
        className="text-xs text-muted hover:text-white transition-colors p-1"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
}

'use client';

import { useGameStore } from '@/game/state/store';
import { Button } from '@/components/ui/Button';

export function LandingPage() {
  const setPhase = useGameStore((s) => s.setPhase);

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center relative overflow-hidden px-4"
      style={{ background: 'var(--color-void)' }}
    >
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 40%, oklch(52% 0.22 18 / 0.06) 0%, transparent 70%)',
        }}
      />

      {/* Decorative grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-primary) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 text-center max-w-2xl w-full animate-fade-in">
        {/* Case label */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="h-px w-16"
            style={{ background: 'var(--color-crimson)' }}
          />
          <span
            className="text-xs font-mono tracking-[0.3em] uppercase"
            style={{ color: 'var(--color-crimson)' }}
          >
            Case File #001
          </span>
          <div
            className="h-px w-16"
            style={{ background: 'var(--color-crimson)' }}
          />
        </div>

        {/* Title */}
        <h1
          className="text-7xl md:text-8xl font-bold mb-4 animate-flicker"
          style={{
            fontFamily: 'var(--font-playfair)',
            color: 'var(--color-text-primary)',
            textShadow: '0 0 80px oklch(75% 0.18 75 / 0.15)',
            letterSpacing: '-0.01em',
          }}
        >
          CASEFILE
        </h1>

        {/* Divider ornament */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px flex-1 max-w-[80px]" style={{ background: 'var(--color-border)' }} />
          <span style={{ color: 'var(--color-amber)', fontSize: '10px' }}>✦</span>
          <div className="h-px flex-1 max-w-[80px]" style={{ background: 'var(--color-border)' }} />
        </div>

        {/* Subtitle */}
        <p
          className="text-lg mb-2 font-medium"
          style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-playfair)' }}
        >
          The Midnight Gala
        </p>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-muted)' }}>
          An agent-native murder mystery — investigate alongside an AI
        </p>

        {/* Agent badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-10 text-xs font-medium"
          style={{
            background: 'oklch(75% 0.18 75 / 0.07)',
            border: '1px solid oklch(75% 0.18 75 / 0.2)',
            color: 'var(--color-amber)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: 'var(--color-amber)' }}
          />
          WebMCP-enabled · AI agent co-investigates via structured tools
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setPhase('briefing')}
            className="min-w-[180px] animate-pulse-amber"
          >
            Open the Case
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setPhase('investigation')}
          >
            Skip to Investigation
          </Button>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-12">
          {['5 Suspects', '4 Locations', '10 Evidence Pieces', 'Red Herrings', 'AI Co-Detective'].map((f) => (
            <span
              key={f}
              className="text-xs px-3 py-1 rounded-full"
              style={{
                background: 'var(--color-surface-2)',
                color: 'var(--color-text-muted)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useGameStore } from '@/game/state/store';
import { Button } from '@/components/ui/Button';

export function BriefingPage() {
  const activeCase = useGameStore((s) => s.activeCase);
  const setPhase = useGameStore((s) => s.setPhase);
  const startInvestigation = useGameStore((s) => s.startInvestigation);

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-16 relative"
      style={{ background: 'var(--color-void)' }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 30%, oklch(75% 0.18 75 / 0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-2xl animate-fade-in">
        {/* Back */}
        <button
          onClick={() => setPhase('landing')}
          className="text-xs mb-8 flex items-center gap-1 transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
          onMouseEnter={(e) =>
            ((e.target as HTMLElement).style.color = 'var(--color-text-primary)')
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.color = 'var(--color-text-muted)')
          }
        >
          ← Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <span
            className="text-xs font-mono tracking-[0.25em] uppercase"
            style={{ color: 'var(--color-crimson)' }}
          >
            Detective Briefing · Case {activeCase.caseNumber}
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold mt-2 mb-3"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {activeCase.title}
          </h1>
          <p
            className="text-lg"
            style={{
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-playfair)',
            }}
          >
            {activeCase.subtitle}
          </p>
        </div>

        {/* Victim info card */}
        <div
          className="p-5 rounded-lg mb-6"
          style={{
            background: 'oklch(52% 0.22 18 / 0.07)',
            border: '1px solid oklch(52% 0.22 18 / 0.2)',
            borderLeft: '4px solid var(--color-crimson)',
          }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-2"
            style={{ color: 'var(--color-crimson)' }}
          >
            ✦ Victim
          </p>
          <p
            className="text-xl font-semibold mb-1"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {activeCase.victim}
          </p>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {activeCase.victimDescription}
          </p>
        </div>

        {/* Briefing text */}
        <div
          className="p-6 rounded-lg mb-8"
          style={{
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-xs font-mono uppercase tracking-widest"
              style={{ color: 'var(--color-amber)' }}
            >
              Case Summary
            </span>
            <div
              className="h-px flex-1"
              style={{ background: 'var(--color-border-subtle)' }}
            />
          </div>
          <p
            className="leading-relaxed text-base"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {activeCase.briefing}
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Suspects', value: activeCase.suspects.length, icon: '👤' },
            { label: 'Locations', value: activeCase.locations.length, icon: '⌖' },
            { label: 'Events', value: activeCase.timeline.length, icon: '◷' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-lg"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div
                className="text-2xl font-bold"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  color: 'var(--color-amber)',
                }}
              >
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button
          variant="primary"
          size="lg"
          onClick={startInvestigation}
          className="w-full"
        >
          Begin Investigation →
        </Button>

        <p className="text-xs text-center mt-4" style={{ color: 'var(--color-text-muted)' }}>
          An AI agent will investigate alongside you via WebMCP tools
        </p>
      </div>
    </div>
  );
}

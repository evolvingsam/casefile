'use client';

import { useGameStore } from '@/game/state/store';
import { Button } from '@/components/ui/Button';

export function LandingPage() {
  const setPhase = useGameStore((s) => s.setPhase);

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center relative overflow-hidden px-4 py-12"
      style={{ background: 'var(--color-void)' }}
    >
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 40%, oklch(52% 0.22 18 / 0.08) 0%, transparent 70%)',
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

      <div className="relative z-10 text-center max-w-3xl w-full animate-fade-in space-y-8">
        {/* Designed for humans and AI agents badge */}
        <div>
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase font-semibold"
            style={{
              background: 'oklch(75% 0.18 75 / 0.08)',
              border: '1px solid oklch(75% 0.18 75 / 0.25)',
              color: 'var(--color-amber)',
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: 'var(--color-amber)' }}
            />
            Designed for humans and AI agents
          </div>
        </div>

        {/* Title */}
        <div>
          <h1
            className="text-7xl md:text-9xl font-bold mb-3 animate-flicker tracking-tight"
            style={{
              fontFamily: 'var(--font-playfair)',
              color: 'var(--color-text-primary)',
              textShadow: '0 0 80px oklch(75% 0.18 75 / 0.2)',
            }}
          >
            CASEFILE
          </h1>

          {/* Core Tagline */}
          <blockquote
            className="text-xl md:text-2xl font-serif italic mb-2"
            style={{ color: 'var(--color-amber)', fontFamily: 'var(--font-playfair)' }}
          >
            &ldquo;Solve the mystery. Work with an AI investigator.&rdquo;
          </blockquote>
          <p className="text-sm font-mono text-muted">
            Case #047 — The Gallery Murder
          </p>
        </div>

        {/* Feature Explanations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div
            className="card p-5 space-y-2"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border-subtle)' }}
          >
            <h3 className="text-xs font-mono uppercase tracking-widest font-bold" style={{ color: 'var(--color-amber)' }}>
              🤝 Human + Agent Collaboration
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              You and an AI co-investigator operate on the exact same investigation state. Clues discovered, interviews conducted, and notes taken by either party are immediately shared in real time.
            </p>
          </div>

          <div
            className="card p-5 space-y-2"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border-subtle)' }}
          >
            <h3 className="text-xs font-mono uppercase tracking-widest font-bold" style={{ color: 'var(--color-amber)' }}>
              ⚡ Powered by WebMCP
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Exposes 9 structured WebMCP tools (<code className="text-amber-400">search_evidence</code>, <code className="text-amber-400">inspect_evidence</code>, <code className="text-amber-400">interview_suspect</code>, <code className="text-amber-400">build_timeline</code>, etc.) allowing autonomous AI agents to operate the game directly.
            </p>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            className="px-10 py-4 text-base tracking-wider font-semibold cursor-pointer shadow-xl hover:scale-105 transition-transform"
            onClick={() => setPhase('briefing')}
          >
            START INVESTIGATION →
          </Button>
        </div>

        {/* No Auth Disclaimer */}
        <p className="text-[11px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
          No login or registration required · Instant hackathon judging access
        </p>
      </div>
    </div>
  );
}

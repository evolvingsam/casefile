'use client';

import { useGameStore } from '@/game/state/store';
import { Button } from '@/components/ui/Button';

export function ResolutionPage() {
  const setPhase = useGameStore((s) => s.setPhase);
  const accusation = useGameStore((s) => s.accusation);
  const activeCase = useGameStore((s) => s.activeCase);

  const accused = activeCase.suspects.find((s) => s.id === accusation);
  const isCorrect = accusation === activeCase.solution.killerId;

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-16 relative"
      style={{ background: 'var(--color-void)' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isCorrect
            ? 'radial-gradient(ellipse 60% 50% at 50% 30%, oklch(75% 0.18 75 / 0.06) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 60% 50% at 50% 30%, oklch(52% 0.22 18 / 0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-xl text-center animate-fade-in">
        <div className="text-6xl mb-6">{isCorrect ? '🎯' : '✗'}</div>

        <h1
          className="text-4xl font-bold mb-3"
          style={{
            fontFamily: 'var(--font-playfair)',
            color: isCorrect ? 'var(--color-amber)' : 'var(--color-crimson)',
          }}
        >
          {isCorrect ? 'Case Solved' : 'Wrong Accusation'}
        </h1>

        <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          {isCorrect
            ? `Your deduction was correct. ${accused?.name ?? ''} will face justice.`
            : `You accused ${accused?.name ?? 'an innocent person'}, but they were not the killer.`}
        </p>

        {/* Placeholder for full resolution in a later step */}
        <div
          className="card p-6 text-left mb-8"
          style={{ borderStyle: 'dashed' }}
        >
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Full case reveal, solution explanation, and agent comparison will be implemented in a later step.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            variant="secondary"
            onClick={() => setPhase('investigation')}
          >
            ← Return to Investigation
          </Button>
          <Button variant="ghost" onClick={() => setPhase('landing')}>
            Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
}

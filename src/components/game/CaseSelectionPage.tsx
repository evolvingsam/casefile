'use client';

import { useGameStore } from '@/game/state/store';
import { getAllCaseSummaries } from '@/game/data/registry';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function CaseSelectionPage() {
  const activeCaseId = useGameStore((s) => s.activeCaseId);
  const selectCase = useGameStore((s) => s.selectCase);
  const setPhase = useGameStore((s) => s.setPhase);
  const caseStates = useGameStore((s) => s.caseStates);

  const cases = getAllCaseSummaries();

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ background: 'var(--color-void)' }}
    >
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 30%, oklch(75% 0.18 75 / 0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-5xl animate-fade-in space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <div>
            <button
              onClick={() => setPhase('landing')}
              className="text-xs mb-3 flex items-center gap-1 transition-colors text-muted hover:text-white"
            >
              ← Back to Main
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-[0.2em]" style={{ color: 'var(--color-crimson)' }}>
                Casefile Registry
              </span>
              <span className="text-xs font-mono text-muted">• Multi-Case Platform</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mt-1" style={{ fontFamily: 'var(--font-playfair)' }}>
              Select Investigation
            </h1>
          </div>
          <p className="text-xs font-mono text-muted max-w-sm">
            Choose a case file to begin your joint human-AI investigation. Game state and WebMCP tool parity are preserved per case.
          </p>
        </div>

        {/* Case Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map((c) => {
            const isSelected = activeCaseId === c.id;
            const isAvailable = c.status === 'available';
            const cState = caseStates[c.id];
            const hasProgress = cState && cState.discoveredEvidenceIds && cState.discoveredEvidenceIds.size > 0;

            return (
              <div
                key={c.id}
                className="card p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-amber-500/50"
                style={{
                  background: isSelected ? 'oklch(75% 0.18 75 / 0.04)' : 'var(--color-surface-2)',
                  border: isSelected
                    ? '2px solid var(--color-amber)'
                    : '1px solid var(--color-border-subtle)',
                }}
              >
                {isSelected && (
                  <div
                    className="absolute top-0 right-0 px-3 py-1 text-[10px] font-mono font-bold tracking-widest uppercase rounded-bl"
                    style={{ background: 'var(--color-amber)', color: 'var(--color-void)' }}
                  >
                    ACTIVE CASE
                  </div>
                )}

                <div className="space-y-4">
                  {/* Case Number & Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      Case {c.caseNumber}
                    </span>
                    <Badge variant={isAvailable ? 'amber' : 'muted'}>
                      {isAvailable ? 'PLAYABLE' : 'CLASSIFIED'}
                    </Badge>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h2 className="text-2xl font-bold leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {c.title}
                    </h2>
                    <p className="text-xs text-muted font-serif italic mt-1">
                      {c.subtitle}
                    </p>
                  </div>

                  {/* Metadata Pills */}
                  <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="px-2 py-1 rounded bg-black/40 border border-white/5 text-secondary">
                      🎯 {c.difficulty || 'Intermediate'}
                    </span>
                    <span className="px-2 py-1 rounded bg-black/40 border border-white/5 text-secondary">
                      ⏱ {c.estimatedTime || '25 mins'}
                    </span>
                  </div>

                  {/* Victim Card */}
                  <div
                    className="p-3 rounded text-xs space-y-1"
                    style={{ background: 'var(--color-surface-3)', borderLeft: '3px solid var(--color-crimson)' }}
                  >
                    <span className="text-[10px] font-mono uppercase text-crimson font-bold block">
                      Victim
                    </span>
                    <p className="font-semibold">{c.victim}</p>
                    <p className="text-muted line-clamp-2 text-[11px]">
                      {c.victimDescription}
                    </p>
                  </div>

                  {/* Briefing Snippet */}
                  <p className="text-xs text-secondary leading-relaxed line-clamp-3">
                    {c.briefing}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t mt-6" style={{ borderColor: 'var(--color-border-subtle)' }}>
                  {isAvailable ? (
                    <Button
                      variant={isSelected ? 'primary' : 'secondary'}
                      size="md"
                      className="w-full justify-center"
                      onClick={() => selectCase(c.id)}
                    >
                      {isSelected
                        ? hasProgress
                          ? 'CONTINUE INVESTIGATION →'
                          : 'ENTER INVESTIGATION →'
                        : 'SELECT CASE →'}
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="md"
                      disabled
                      className="w-full justify-center opacity-60 cursor-not-allowed text-xs font-mono"
                    >
                      🔒 CLASSIFIED — COMING SOON
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

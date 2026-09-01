'use client';

import { useGameStore } from '@/game/state/store';
import { getAgentRecommendation } from '@/game/logic/investigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function AgentRecommendationCard() {
  const activeCase = useGameStore((s) => s.activeCase);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);
  const inspectedEvidenceIds = useGameStore((s) => s.inspectedEvidenceIds);
  const interviewedSuspectIds = useGameStore((s) => s.interviewedSuspectIds);
  const setPhase = useGameStore((s) => s.setPhase);
  const setActiveView = useGameStore((s) => s.setActiveView);

  const recommendation = getAgentRecommendation(
    activeCase,
    discoveredEvidenceIds,
    inspectedEvidenceIds,
    interviewedSuspectIds,
  );

  const confidenceBadgeVariant =
    recommendation.confidence === 'Conclusive' || recommendation.confidence === 'High'
      ? 'amber'
      : recommendation.confidence === 'Moderate'
      ? 'muted'
      : 'crimson';

  return (
    <div
      className="card p-6 relative overflow-hidden space-y-4 animate-fade-in"
      style={{
        background: 'var(--color-surface-2)',
        border: '1px solid oklch(75% 0.18 75 / 0.3)',
      }}
    >
      {/* Background Subtle Gradient */}
      <div
        className="absolute top-0 right-0 w-48 h-48 pointer-events-none rounded-full blur-3xl"
        style={{ background: 'oklch(75% 0.18 75 / 0.05)' }}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span
            className="text-xs font-mono font-bold uppercase tracking-widest"
            style={{ color: 'var(--color-amber)' }}
          >
            AI Investigative Assistant Guidance
          </span>
        </div>

        <Badge variant={confidenceBadgeVariant}>
          {recommendation.confidence} Guidance Progress ({recommendation.confidencePercentage}%)
        </Badge>
      </div>

      {/* Guidance Focus Area */}
      <div>
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>
          Investigative Direction & Focus Area
        </p>
        <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
          {recommendation.suspectName}
        </h3>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          {recommendation.reasoning}
        </p>
      </div>

      {/* Contradiction callout */}
      {recommendation.contradictionSummary && (
        <div
          className="p-3.5 rounded-lg text-xs leading-relaxed"
          style={{
            background: 'oklch(52% 0.22 18 / 0.08)',
            border: '1px solid oklch(52% 0.22 18 / 0.25)',
            color: 'var(--color-text-primary)',
          }}
        >
          <span className="font-bold text-red-400">⚡ Key Statement Contradiction: </span>
          {recommendation.contradictionSummary}
        </div>
      )}

      {/* Supporting Evidence List */}
      <div>
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
          Supporting Evidence ({recommendation.supportingEvidenceNames.length})
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recommendation.supportingEvidenceNames.map((name) => (
            <div
              key={name}
              className="p-2.5 rounded-md text-xs flex items-center gap-2"
              style={{
                background: 'var(--color-surface-3)',
                border: '1px solid var(--color-border-subtle)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <span style={{ color: 'var(--color-amber)' }}>•</span>
              <span className="font-medium truncate">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Human Control Rule Disclaimer */}
      <p className="text-[11px] italic" style={{ color: 'var(--color-text-muted)' }}>
        Note: Human detective retains final authority. The AI agent recommends; you decide.
      </p>

      {/* Buttons */}
      <div className="pt-2 border-t flex items-center gap-3" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => setActiveView('evidence')}
        >
          [ REVIEW EVIDENCE ]
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => setPhase('resolution')}
        >
          [ MAKE ACCUSATION ]
        </Button>
      </div>
    </div>
  );
}

'use client';

import { useGameStore } from '@/game/state/store';
import { Badge } from '@/components/ui/Badge';

export function TimelineView() {
  const activeCase = useGameStore((s) => s.activeCase);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);

  return (
    <div className="p-8 animate-fade-in space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: 'var(--color-amber)' }}
          >
            ◷ Timeline
          </span>
          <div className="h-px flex-1" style={{ background: 'var(--color-border-subtle)' }} />
        </div>
        <h1
          className="text-3xl font-bold mb-1"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Sequence of Events
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          The night of{' '}
          <span style={{ fontFamily: 'var(--font-playfair)' }}>
            {activeCase.victim}
          </span>
          {'\'s '}
          murder, reconstructed.
        </p>
      </div>

      <div className="relative pl-8">
        {/* Vertical line */}
        <div
          className="absolute left-3 top-2 bottom-2 w-px"
          style={{ background: 'var(--color-border)' }}
        />

        <div className="space-y-5">
          {activeCase.timeline.map((event, index) => {
            const isContradiction = event.isContradiction;
            // Check if any related evidence has been discovered
            const hasRelatedDiscovered = event.evidenceIds.some((eid) =>
              discoveredEvidenceIds.has(eid)
            );

            return (
              <div
                key={event.id}
                className="relative animate-fade-in"
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                {/* Dot */}
                <div
                  className="absolute -left-8 top-3 w-3 h-3 rounded-full border-2"
                  style={{
                    background: isContradiction
                      ? 'var(--color-crimson)'
                      : hasRelatedDiscovered
                      ? 'var(--color-amber)'
                      : 'var(--color-surface-1)',
                    borderColor: isContradiction
                      ? 'var(--color-crimson)'
                      : 'var(--color-amber)',
                    boxShadow: isContradiction
                      ? '0 0 8px oklch(52% 0.22 18 / 0.4)'
                      : hasRelatedDiscovered
                      ? '0 0 8px oklch(75% 0.18 75 / 0.3)'
                      : 'none',
                  }}
                />

                <div
                  className="card p-4"
                  style={
                    isContradiction
                      ? { borderColor: 'oklch(52% 0.22 18 / 0.3)' }
                      : hasRelatedDiscovered
                      ? { borderColor: 'oklch(75% 0.18 75 / 0.2)' }
                      : {}
                  }
                >
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span
                      className="text-sm font-mono font-bold shrink-0"
                      style={{ color: 'var(--color-amber)' }}
                    >
                      {event.time}
                    </span>

                    {/* Source badge */}
                    <Badge variant="muted">{event.source}</Badge>

                    {/* Contradiction badge */}
                    {isContradiction && (
                      <Badge variant="crimson">⚡ Contradicts statement</Badge>
                    )}

                    {/* Evidence linked badge */}
                    {hasRelatedDiscovered && !isContradiction && (
                      <Badge variant="amber">Evidence linked</Badge>
                    )}
                  </div>

                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {event.description}
                  </p>

                  {/* Suspects involved */}
                  {event.suspectIds.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {event.suspectIds.map((sid) => {
                        const suspect = activeCase.suspects.find(
                          (s) => s.id === sid
                        );
                        return suspect ? (
                          <span
                            key={sid}
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              background: 'var(--color-surface-3)',
                              color: 'var(--color-text-muted)',
                              border: '1px solid var(--color-border-subtle)',
                            }}
                          >
                            {suspect.name}
                          </span>
                        ) : null;
                      })}
                    </div>
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

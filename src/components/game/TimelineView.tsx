'use client';

import { useGameStore } from '@/game/state/store';
import { getVisibleTimelineEvents } from '@/game/logic/investigation';
import { Badge } from '@/components/ui/Badge';

export function TimelineView() {
  const activeCase = useGameStore((s) => s.activeCase);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);
  const interviewedSuspectIds = useGameStore((s) => s.interviewedSuspectIds);
  const setActiveView = useGameStore((s) => s.setActiveView);

  const visibleEvents = getVisibleTimelineEvents(
    activeCase,
    discoveredEvidenceIds,
    interviewedSuspectIds,
  );

  const visibleIds = new Set(visibleEvents.map((e) => e.id));
  const hiddenCount = activeCase.timeline.length - visibleEvents.length;

  return (
    <div className="p-6 md:p-8 animate-fade-in space-y-6">
      {/* Header */}
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
          Reconstructed Timeline
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {visibleEvents.length} of {activeCase.timeline.length} evening events established.{' '}
          <span style={{ color: 'var(--color-text-muted)' }}>
            {hiddenCount > 0
              ? `${hiddenCount} time slots remain unverified. Discover more evidence to unlock them.`
              : 'All timeline events have been successfully verified.'}
          </span>
        </p>
      </div>

      {/* Timeline List */}
      <div className="relative pl-8">
        {/* Vertical Connecting Line */}
        <div
          className="absolute left-3 top-3 bottom-3 w-px"
          style={{ background: 'var(--color-border)' }}
        />

        <div className="space-y-4">
          {activeCase.timeline.map((event, index) => {
            const isRevealed = visibleIds.has(event.id);

            if (!isRevealed) {
              return (
                <div key={event.id} className="relative opacity-40">
                  {/* Lock Dot */}
                  <div
                    className="absolute -left-8 top-3 w-3 h-3 rounded-full border border-dashed"
                    style={{
                      background: 'var(--color-surface-1)',
                      borderColor: 'var(--color-text-muted)',
                    }}
                  />

                  <div
                    className="card p-3 text-xs flex items-center justify-between"
                    style={{ borderStyle: 'dashed' }}
                  >
                    <span className="font-mono text-muted">Time Slot #{index + 1} — [ Unverified Event ]</span>
                    <span className="italic" style={{ color: 'var(--color-text-muted)' }}>
                      Search locations &amp; interview suspects to reveal
                    </span>
                  </div>
                </div>
              );
            }

            const isContradiction = event.isContradiction;
            const relatedDiscoveredEv = event.evidenceIds.filter((eid) =>
              discoveredEvidenceIds.has(eid),
            );

            return (
              <div key={event.id} className="relative animate-fade-in">
                {/* Event Dot */}
                <div
                  className="absolute -left-8 top-3.5 w-3 h-3 rounded-full border-2 transition-colors"
                  style={{
                    background: isContradiction
                      ? 'var(--color-crimson)'
                      : relatedDiscoveredEv.length > 0
                      ? 'var(--color-amber)'
                      : 'var(--color-surface-1)',
                    borderColor: isContradiction
                      ? 'var(--color-crimson)'
                      : 'var(--color-amber)',
                    boxShadow: isContradiction
                      ? '0 0 10px oklch(52% 0.22 18 / 0.5)'
                      : 'none',
                  }}
                />

                <div
                  className="card p-5"
                  style={
                    isContradiction
                      ? { borderColor: 'oklch(52% 0.22 18 / 0.45)' }
                      : relatedDiscoveredEv.length > 0
                      ? { borderColor: 'oklch(75% 0.18 75 / 0.25)' }
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

                    <Badge variant="muted">{event.source}</Badge>

                    {isContradiction && (
                      <Badge variant="crimson">⚡ Contradicts Suspect Statement</Badge>
                    )}

                    {relatedDiscoveredEv.length > 0 && !isContradiction && (
                      <Badge variant="amber">Evidence Backed</Badge>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {event.description}
                  </p>

                  {/* Suspects involved */}
                  {event.suspectIds.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
                      <span className="text-xs mr-1" style={{ color: 'var(--color-text-muted)' }}>
                        Involved:
                      </span>
                      {event.suspectIds.map((sid) => {
                        const suspect = activeCase.suspects.find((s) => s.id === sid);
                        if (!suspect) return null;
                        return (
                          <button
                            key={sid}
                            className="text-xs px-2.5 py-0.5 rounded-full cursor-pointer hover:border-amber-500 transition-colors"
                            style={{
                              background: 'var(--color-surface-3)',
                              color: 'var(--color-text-secondary)',
                              border: '1px solid var(--color-border-subtle)',
                            }}
                            onClick={() => setActiveView('suspects')}
                          >
                            👤 {suspect.name}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Related Evidence links */}
                  {relatedDiscoveredEv.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-xs mr-1" style={{ color: 'var(--color-text-muted)' }}>
                        Corroborating Evidence:
                      </span>
                      {relatedDiscoveredEv.map((eid) => {
                        const ev = activeCase.evidence.find((e) => e.id === eid);
                        if (!ev) return null;
                        return (
                          <button
                            key={eid}
                            className="text-xs px-2.5 py-0.5 rounded-full cursor-pointer transition-colors"
                            style={{
                              background: 'oklch(75% 0.18 75 / 0.1)',
                              color: 'var(--color-amber)',
                              border: '1px solid oklch(75% 0.18 75 / 0.25)',
                            }}
                            onClick={() => setActiveView('evidence')}
                          >
                            📄 {ev.name}
                          </button>
                        );
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

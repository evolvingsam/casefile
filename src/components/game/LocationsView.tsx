'use client';

import { useState } from 'react';
import { useGameStore } from '@/game/state/store';
import { getLocationEvidence, locationDiscoveryProgress } from '@/game/logic/investigation';
import { Badge } from '@/components/ui/Badge';

// ─── Location Detail Panel ────────────────────────────────────────────────────

function LocationPanel({
  locationId,
  onClose,
}: {
  locationId: string;
  onClose: () => void;
}) {
  const activeCase = useGameStore((s) => s.activeCase);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);
  const inspectEvidence = useGameStore((s) => s.inspectEvidence);
  const setActiveView = useGameStore((s) => s.setActiveView);

  const location = activeCase.locations.find((l) => l.id === locationId);
  if (!location) return null;

  const evidence = getLocationEvidence(activeCase, locationId);
  const discovered = evidence.filter((e) => discoveredEvidenceIds.has(e.id));

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'oklch(5% 0.01 280 / 0.82)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full sm:max-w-lg animate-fade-in overflow-y-auto"
        style={{
          background: 'var(--color-surface-1)',
          border: '1px solid var(--color-border)',
          borderRadius: '1rem 1rem 0 0',
          maxHeight: '88dvh',
        }}
      >
        {/* Header */}
        <div
          className="p-5 border-b sticky top-0 z-10 flex items-center justify-between gap-3"
          style={{
            borderColor: 'var(--color-border-subtle)',
            background: 'var(--color-surface-1)',
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{location.icon}</span>
            <div>
              <p
                className="text-xs uppercase tracking-widest mb-0.5"
                style={{ color: 'var(--color-amber)' }}
              >
                Location
              </p>
              <h2
                className="text-lg font-bold"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {location.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded text-lg transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Description */}
          <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {location.description}
          </p>

          {/* Investigator note */}
          <div
            className="p-4 rounded-lg text-sm leading-relaxed"
            style={{
              background: 'oklch(75% 0.18 75 / 0.06)',
              border: '1px solid oklch(75% 0.18 75 / 0.18)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-2"
              style={{ color: 'var(--color-amber)' }}
            >
              ◉ Investigator Note
            </p>
            {location.investigatorNote}
          </div>

          {/* Discovered evidence */}
          {discovered.length > 0 && (
            <div>
              <p
                className="text-xs uppercase tracking-widest mb-3"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Evidence Found Here ({discovered.length})
              </p>
              <div className="space-y-2">
                {discovered.map((ev) => (
                  <button
                    key={ev.id}
                    className="w-full text-left p-3 rounded-lg flex items-start gap-3 transition-all duration-150 group"
                    style={{
                      background: 'var(--color-surface-2)',
                      border: '1px solid var(--color-border-subtle)',
                    }}
                    onClick={() => {
                      inspectEvidence(ev.id);
                      onClose();
                      setActiveView('evidence');
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.borderColor =
                        'var(--color-amber-dim)')
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.borderColor =
                        'var(--color-border-subtle)')
                    }
                  >
                    <div className="flex flex-wrap gap-1.5 shrink-0 pt-0.5">
                      {ev.tags.slice(0, 1).map((t) => (
                        <Badge key={t} variant="muted">{t}</Badge>
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{ev.name}</p>
                      <p
                        className="text-xs mt-0.5 leading-relaxed"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {ev.description}
                      </p>
                    </div>
                    <span
                      className="text-xs shrink-0 self-center"
                      style={{ color: 'var(--color-amber-dim)' }}
                    >
                      Inspect →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

export function LocationsView() {
  const activeCase = useGameStore((s) => s.activeCase);
  const visitedLocationIds = useGameStore((s) => s.visitedLocationIds);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);
  const visitLocation = useGameStore((s) => s.visitLocation);

  const [openLocationId, setOpenLocationId] = useState<string | null>(null);

  function handleEnterLocation(locationId: string) {
    visitLocation(locationId);
    setOpenLocationId(locationId);
  }

  return (
    <div className="p-6 md:p-8 animate-fade-in space-y-6">
      {/* Detail panel */}
      {openLocationId && (
        <LocationPanel
          locationId={openLocationId}
          onClose={() => setOpenLocationId(null)}
        />
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: 'var(--color-amber)' }}
          >
            ⌖ Locations
          </span>
          <div className="h-px flex-1" style={{ background: 'var(--color-border-subtle)' }} />
        </div>
        <h1
          className="text-3xl font-bold mb-1"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Crime Scene &amp; Areas
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Investigate each area to uncover evidence.{' '}
          <span style={{ color: 'var(--color-text-muted)' }}>
            {visitedLocationIds.size}/{activeCase.locations.length} visited
          </span>
        </p>
      </div>

      {/* Location grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeCase.locations.map((location) => {
          const isVisited = visitedLocationIds.has(location.id);
          const { found, total } = locationDiscoveryProgress(
            activeCase,
            location.id,
            discoveredEvidenceIds,
          );

          return (
            <button
              key={location.id}
              id={`location-${location.id}`}
              className="card card-interactive text-left p-5 w-full group"
              onClick={() => handleEnterLocation(location.id)}
              style={
                isVisited
                  ? { borderColor: 'oklch(75% 0.18 75 / 0.3)' }
                  : {}
              }
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{
                    background: isVisited
                      ? 'oklch(75% 0.18 75 / 0.1)'
                      : 'var(--color-surface-3)',
                  }}
                >
                  {location.icon}
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {isVisited ? (
                    <>
                      <Badge variant="amber">Visited</Badge>
                      {found > 0 && (
                        <Badge variant="crimson">
                          {found}/{total} clue{total !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </>
                  ) : (
                    <Badge variant="muted">Unexplored</Badge>
                  )}
                </div>
              </div>

              {/* Name & description */}
              <h3
                className="text-lg font-semibold mb-1.5"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {location.name}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {location.description}
              </p>

              {/* Evidence progress bar (visited only) */}
              {isVisited && total > 0 && (
                <div className="mt-4">
                  <div
                    className="h-1 rounded-full overflow-hidden"
                    style={{ background: 'var(--color-surface-3)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(found / total) * 100}%`,
                        background: 'var(--color-amber)',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* CTA */}
              <div
                className="mt-3 text-xs font-medium"
                style={{
                  color: isVisited ? 'var(--color-text-muted)' : 'var(--color-amber-dim)',
                }}
              >
                {isVisited ? 'Re-enter to review →' : 'Enter to investigate →'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

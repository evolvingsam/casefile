'use client';

import { useGameStore } from '@/game/state/store';

// Location emoji map for the gallery case
const LOCATION_ICONS: Record<string, string> = {
  'main-gallery':  '🖼️',
  'private-office': '🚪',
  'storage-room':  '📦',
  'courtyard':     '🌿',
  'security-room': '📹',
};

export function LocationsView() {
  const activeCase = useGameStore((s) => s.activeCase);
  const visitedLocationIds = useGameStore((s) => s.visitedLocationIds);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);
  const visitLocation = useGameStore((s) => s.visitLocation);

  return (
    <div className="p-8 animate-fade-in space-y-6">
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
          Investigate each location to uncover evidence.{' '}
          <span style={{ color: 'var(--color-text-muted)' }}>
            {visitedLocationIds.size}/{activeCase.locations.length} visited
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeCase.locations.map((location) => {
          const isVisited = visitedLocationIds.has(location.id);
          // Count how many of this location's evidence is discovered
          const evidenceFound = location.evidenceIds.filter((eid) =>
            discoveredEvidenceIds.has(eid)
          ).length;

          return (
            <button
              key={location.id}
              className="card card-interactive text-left p-6 w-full"
              onClick={() => visitLocation(location.id)}
              style={isVisited ? { borderColor: 'oklch(75% 0.18 75 / 0.3)' } : {}}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                  style={{ background: 'var(--color-surface-3)' }}
                >
                  {location.icon ?? LOCATION_ICONS[location.id] ?? '📍'}
                </div>
                <div className="flex items-center gap-2">
                  {isVisited ? (
                    <>
                      <span className="badge badge-amber text-xs">Visited</span>
                      {evidenceFound > 0 && (
                        <span className="badge badge-crimson text-xs">
                          {evidenceFound} clue{evidenceFound !== 1 ? 's' : ''}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="badge badge-muted text-xs">Unexplored</span>
                  )}
                </div>
              </div>

              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {location.name}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {location.description}
              </p>

              {/* Investigator note shown after visiting */}
              {isVisited && location.investigatorNote && (
                <div
                  className="mt-4 p-3 rounded text-xs leading-relaxed"
                  style={{
                    background: 'oklch(75% 0.18 75 / 0.06)',
                    border: '1px solid oklch(75% 0.18 75 / 0.15)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <span style={{ color: 'var(--color-amber)' }}>◉ Investigator note: </span>
                  {location.investigatorNote}
                </div>
              )}

              {!isVisited && (
                <div
                  className="mt-4 text-xs font-medium"
                  style={{ color: 'var(--color-amber-dim)' }}
                >
                  Click to investigate →
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

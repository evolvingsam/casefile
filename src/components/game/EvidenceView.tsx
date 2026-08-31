'use client';

import { useState } from 'react';
import { useGameStore } from '@/game/state/store';
import type { Evidence } from '@/game/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// ─── Evidence detail modal ────────────────────────────────────────────────────

function EvidenceModal({
  evidence,
  onClose,
}: {
  evidence: Evidence;
  onClose: () => void;
}) {
  const inspectEvidence = useGameStore((s) => s.inspectEvidence);

  // Mark as inspected on open
  useState(() => {
    inspectEvidence(evidence.id);
  });

  const locationName = evidence.location
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'oklch(5% 0.01 280 / 0.85)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="card w-full max-w-lg animate-fade-in"
        style={{ maxHeight: '85dvh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div
          className="p-5 border-b flex items-start justify-between gap-4"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {evidence.tags.map((tag) => (
                <Badge key={tag} variant="muted">{tag}</Badge>
              ))}
              {evidence.isRedHerring && (
                <Badge variant="muted">unverified</Badge>
              )}
            </div>
            <h2
              className="text-xl font-bold"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {evidence.name}
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Found in: {locationName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 text-lg leading-none w-8 h-8 flex items-center justify-center rounded transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = 'var(--color-text-primary)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)')
            }
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {evidence.detailedDescription}
          </p>

          {/* Related evidence */}
          {evidence.relatedEvidenceIds.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--color-amber)' }}>
                Cross-reference
              </p>
              <div className="flex flex-wrap gap-2">
                {evidence.relatedEvidenceIds.map((eid) => (
                  <span key={eid} className="badge badge-muted text-xs">
                    {eid.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-5 pt-0">
          <Button variant="secondary" size="sm" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Evidence card ────────────────────────────────────────────────────────────

function EvidenceCard({
  evidence,
  isInspected,
  onClick,
}: {
  evidence: Evidence;
  isInspected: boolean;
  onClick: () => void;
}) {
  const tagColors: Record<string, 'amber' | 'crimson' | 'muted'> = {
    forensic: 'crimson',
    physical: 'muted',
    digital: 'amber',
    document: 'muted',
    financial: 'muted',
    legal: 'muted',
    timeline: 'amber',
    witness: 'muted',
    'murder weapon': 'crimson',
    poison: 'crimson',
  };

  return (
    <button
      className="card card-interactive text-left p-4 w-full"
      onClick={onClick}
      style={isInspected ? { borderColor: 'oklch(75% 0.18 75 / 0.25)' } : {}}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex flex-wrap gap-1.5">
          {evidence.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant={tagColors[tag] ?? 'muted'}>{tag}</Badge>
          ))}
        </div>
        {isInspected && (
          <span
            className="text-xs shrink-0 font-mono"
            style={{ color: 'var(--color-amber)' }}
          >
            ✓ Inspected
          </span>
        )}
      </div>
      <h3
        className="text-sm font-semibold mb-1"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {evidence.name}
      </h3>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
        {evidence.description}
      </p>
      <div
        className="mt-3 text-xs font-medium"
        style={{ color: 'var(--color-amber-dim)' }}
      >
        Inspect →
      </div>
    </button>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

export function EvidenceView() {
  const activeCase = useGameStore((s) => s.activeCase);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);
  const inspectedEvidenceIds = useGameStore((s) => s.inspectedEvidenceIds);
  const setActiveView = useGameStore((s) => s.setActiveView);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const discoveredEvidence = activeCase.evidence.filter((e) =>
    discoveredEvidenceIds.has(e.id)
  );
  const selectedEvidence = activeCase.evidence.find((e) => e.id === selectedId);

  return (
    <div className="p-8 animate-fade-in space-y-6">
      {/* Modal */}
      {selectedEvidence && (
        <EvidenceModal
          evidence={selectedEvidence}
          onClose={() => setSelectedId(null)}
        />
      )}

      <div>
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: 'var(--color-amber)' }}
          >
            🔍 Evidence
          </span>
          <div className="h-px flex-1" style={{ background: 'var(--color-border-subtle)' }} />
        </div>
        <h1
          className="text-3xl font-bold mb-1"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Physical Evidence
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {discoveredEvidence.length} of {activeCase.evidence.length} items found.
          {' '}
          <span style={{ color: 'var(--color-text-muted)' }}>
            Investigate locations to uncover more.
          </span>
        </p>
      </div>

      {discoveredEvidence.length === 0 ? (
        <div className="card p-12 text-center" style={{ borderStyle: 'dashed' }}>
          <div className="text-4xl mb-4">🔒</div>
          <h3
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            No evidence discovered yet
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
            Visit locations to uncover physical evidence.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveView('locations')}
          >
            Go to Locations →
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {discoveredEvidence.map((evidence) => (
            <EvidenceCard
              key={evidence.id}
              evidence={evidence}
              isInspected={inspectedEvidenceIds.has(evidence.id)}
              onClick={() => setSelectedId(evidence.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

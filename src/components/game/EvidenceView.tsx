'use client';

import { useState } from 'react';
import { useGameStore } from '@/game/state/store';
import type { Evidence, EvidenceId } from '@/game/types';
import {
  getDiscoveredEvidence,
  getEvidenceStatus,
  getRelatedEvidence,
  getEvidenceSuspects,
} from '@/game/logic/investigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// ─── Evidence Detail Modal ───────────────────────────────────────────────────

function EvidenceDetailModal({
  evidenceId,
  onClose,
  onSelectEvidence,
}: {
  evidenceId: EvidenceId;
  onClose: () => void;
  onSelectEvidence: (id: EvidenceId) => void;
}) {
  const activeCase = useGameStore((s) => s.activeCase);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);
  const inspectedEvidenceIds = useGameStore((s) => s.inspectedEvidenceIds);
  const inspectEvidence = useGameStore((s) => s.inspectEvidence);
  const addNote = useGameStore((s) => s.addNote);
  const setActiveView = useGameStore((s) => s.setActiveView);

  const evidence = activeCase.evidence.find((e) => e.id === evidenceId);
  const [noteText, setNoteText] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  if (!evidence) return null;

  const isInspected = inspectedEvidenceIds.has(evidence.id);

  // Auto-inspect on view
  if (!isInspected) {
    inspectEvidence(evidence.id);
  }

  const location = activeCase.locations.find((l) => l.id === evidence.location);
  const relatedEvidence = getRelatedEvidence(activeCase, evidence.id, discoveredEvidenceIds);
  const relatedSuspects = getEvidenceSuspects(activeCase, evidence.id);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addNote(`Regarding [${evidence.name}]: ${noteText.trim()}`, 'player');
    setNoteText('');
    setShowNoteInput(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'oklch(5% 0.01 280 / 0.85)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full sm:max-w-xl animate-fade-in overflow-y-auto"
        style={{
          background: 'var(--color-surface-1)',
          border: '1px solid var(--color-border)',
          borderRadius: '1rem 1rem 0 0',
          maxHeight: '90dvh',
        }}
      >
        {/* Header */}
        <div
          className="p-5 border-b sticky top-0 z-10 flex items-start justify-between gap-4"
          style={{
            borderColor: 'var(--color-border-subtle)',
            background: 'var(--color-surface-1)',
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {evidence.tags.map((tag) => (
                <Badge key={tag} variant="muted">
                  {tag}
                </Badge>
              ))}
              <Badge variant="amber">Inspected</Badge>
            </div>
            <h2
              className="text-xl font-bold"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {evidence.name}
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Found in: <span style={{ color: 'var(--color-amber)' }}>{location?.name ?? evidence.location}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 text-lg leading-none w-8 h-8 flex items-center justify-center rounded"
            style={{ color: 'var(--color-text-muted)' }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Surface description */}
          <div>
            <p
              className="text-xs uppercase tracking-widest mb-1.5"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Initial Description
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {evidence.description}
            </p>
          </div>

          {/* Forensic / Detailed analysis */}
          <div
            className="p-4 rounded-lg text-sm leading-relaxed space-y-2"
            style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-subtle)',
              borderLeft: '3px solid var(--color-amber)',
            }}
          >
            <p
              className="text-xs font-mono uppercase tracking-widest font-semibold"
              style={{ color: 'var(--color-amber)' }}
            >
              🔍 Detailed Inspection Findings
            </p>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              {evidence.detailedDescription}
            </p>
          </div>

          {/* Hidden Significance */}
          {evidence.hiddenSignificance && (
            <div
              className="p-4 rounded-lg text-sm leading-relaxed"
              style={{
                background: evidence.isRedHerring
                  ? 'oklch(52% 0.22 18 / 0.08)'
                  : 'oklch(75% 0.18 75 / 0.08)',
                border: evidence.isRedHerring
                  ? '1px solid oklch(52% 0.22 18 / 0.25)'
                  : '1px solid oklch(75% 0.18 75 / 0.25)',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs uppercase tracking-widest font-semibold"
                  style={{
                    color: evidence.isRedHerring ? 'var(--color-crimson)' : 'var(--color-amber)',
                  }}
                >
                  {evidence.isRedHerring ? '⚠️ Analysis: Misleading Clue' : '💡 Key Significance'}
                </span>
              </div>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                {evidence.hiddenSignificance}
              </p>
            </div>
          )}

          {/* Connected Suspects */}
          {relatedSuspects.length > 0 && (
            <div>
              <p
                className="text-xs uppercase tracking-widest mb-2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Linked Persons of Interest
              </p>
              <div className="flex flex-wrap gap-2">
                {relatedSuspects.map((s) => (
                  <button
                    key={s.id}
                    className="badge badge-amber text-xs hover:opacity-80 transition-opacity cursor-pointer"
                    onClick={() => {
                      onClose();
                      setActiveView('suspects');
                    }}
                  >
                    👤 {s.name} ({s.title})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Related Evidence */}
          {relatedEvidence.length > 0 && (
            <div>
              <p
                className="text-xs uppercase tracking-widest mb-2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Corroborating / Related Evidence
              </p>
              <div className="space-y-2">
                {relatedEvidence.map((re) => (
                  <button
                    key={re.id}
                    className="w-full text-left p-3 rounded-lg text-xs flex items-center justify-between transition-colors"
                    style={{
                      background: 'var(--color-surface-3)',
                      border: '1px solid var(--color-border-subtle)',
                      color: 'var(--color-text-secondary)',
                    }}
                    onClick={() => onSelectEvidence(re.id)}
                  >
                    <span className="font-semibold">{re.name}</span>
                    <span style={{ color: 'var(--color-amber-dim)' }}>View →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add note section */}
          <div>
            {!showNoteInput ? (
              <button
                className="text-xs font-medium flex items-center gap-1 transition-colors"
                style={{ color: 'var(--color-amber-dim)' }}
                onClick={() => setShowNoteInput(true)}
              >
                + Add case note regarding this item
              </button>
            ) : (
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  className="w-full p-3 rounded-lg text-sm leading-relaxed"
                  style={{
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                    outline: 'none',
                  }}
                  rows={3}
                  placeholder="Record your deduction about this evidence..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" type="button" onClick={() => setShowNoteInput(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Save Note
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex gap-3" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => {
              onClose();
              setActiveView('caseboard');
            }}
          >
            📌 Open on Case Board
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

export function EvidenceView() {
  const activeCase = useGameStore((s) => s.activeCase);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);
  const inspectedEvidenceIds = useGameStore((s) => s.inspectedEvidenceIds);
  const setActiveView = useGameStore((s) => s.setActiveView);

  const [selectedId, setSelectedId] = useState<EvidenceId | null>(null);
  const [filter, setFilter] = useState<'all' | 'inspected' | 'uninspected'>('all');

  const discovered = getDiscoveredEvidence(activeCase, discoveredEvidenceIds);
  const totalEvidence = activeCase.evidence.length;
  const undiscoveredCount = totalEvidence - discovered.length;

  const filteredEvidence = discovered.filter((e) => {
    const inspected = inspectedEvidenceIds.has(e.id);
    if (filter === 'inspected') return inspected;
    if (filter === 'uninspected') return !inspected;
    return true;
  });

  return (
    <div className="p-6 md:p-8 animate-fade-in space-y-6">
      {/* Detail Modal */}
      {selectedId && (
        <EvidenceDetailModal
          evidenceId={selectedId}
          onClose={() => setSelectedId(null)}
          onSelectEvidence={(id) => setSelectedId(id)}
        />
      )}

      {/* Header */}
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
          Evidence Locker
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {discovered.length} of {totalEvidence} items recovered.{' '}
          <span style={{ color: 'var(--color-text-muted)' }}>
            {inspectedEvidenceIds.size} inspected.
          </span>
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <button
          className="px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer"
          style={{
            background: filter === 'all' ? 'var(--color-surface-3)' : 'transparent',
            color: filter === 'all' ? 'var(--color-amber)' : 'var(--color-text-muted)',
            border: filter === 'all' ? '1px solid var(--color-border)' : '1px solid transparent',
          }}
          onClick={() => setFilter('all')}
        >
          All Discovered ({discovered.length})
        </button>
        <button
          className="px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer"
          style={{
            background: filter === 'inspected' ? 'var(--color-surface-3)' : 'transparent',
            color: filter === 'inspected' ? 'var(--color-amber)' : 'var(--color-text-muted)',
            border: filter === 'inspected' ? '1px solid var(--color-border)' : '1px solid transparent',
          }}
          onClick={() => setFilter('inspected')}
        >
          Inspected ({inspectedEvidenceIds.size})
        </button>
        <button
          className="px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer"
          style={{
            background: filter === 'uninspected' ? 'var(--color-surface-3)' : 'transparent',
            color: filter === 'uninspected' ? 'var(--color-amber)' : 'var(--color-text-muted)',
            border: filter === 'uninspected' ? '1px solid var(--color-border)' : '1px solid transparent',
          }}
          onClick={() => setFilter('uninspected')}
        >
          Uninspected ({discovered.length - inspectedEvidenceIds.size})
        </button>
      </div>

      {/* Grid */}
      {discovered.length === 0 ? (
        <div className="card p-12 text-center" style={{ borderStyle: 'dashed' }}>
          <div className="text-4xl mb-4">🔒</div>
          <h3
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            No evidence discovered yet
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
            Visit locations to search for physical and digital evidence.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveView('locations')}
          >
            Investigate Locations →
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredEvidence.map((evidence) => {
            const status = getEvidenceStatus(
              evidence.id,
              discoveredEvidenceIds,
              inspectedEvidenceIds,
            );
            const location = activeCase.locations.find((l) => l.id === evidence.location);

            return (
              <button
                key={evidence.id}
                id={`evidence-${evidence.id}`}
                className="card card-interactive text-left p-5 flex flex-col justify-between group"
                onClick={() => setSelectedId(evidence.id)}
                style={
                  status === 'inspected'
                    ? { borderColor: 'oklch(75% 0.18 75 / 0.3)' }
                    : {}
                }
              >
                <div>
                  {/* Top tags */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap gap-1.5">
                      {evidence.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="muted">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {status === 'inspected' ? (
                      <Badge variant="amber">Inspected</Badge>
                    ) : (
                      <Badge variant="crimson">New Clue</Badge>
                    )}
                  </div>

                  <h3
                    className="text-base font-semibold mb-1"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {evidence.name}
                  </h3>
                  <p
                    className="text-xs leading-relaxed mb-3 line-clamp-2"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {evidence.description}
                  </p>
                </div>

                <div className="pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--color-border-subtle)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    📍 {location?.name ?? evidence.location}
                  </span>
                  <span style={{ color: 'var(--color-amber-dim)' }} className="group-hover:translate-x-1 transition-transform">
                    Inspect →
                  </span>
                </div>
              </button>
            );
          })}

          {/* Placeholder cards for undiscovered items */}
          {undiscoveredCount > 0 && (
            <div
              className="card p-5 flex flex-col items-center justify-center text-center opacity-40"
              style={{ borderStyle: 'dashed' }}
            >
              <span className="text-2xl mb-1">❓</span>
              <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                {undiscoveredCount} Undiscovered {undiscoveredCount === 1 ? 'Clue' : 'Clues'}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                Keep investigating locations
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

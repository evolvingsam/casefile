'use client';

/**
 * EvidenceView.tsx
 *
 * Evidence Locker & Detailed Forensic Inspection View.
 * Displays discovered clues, allows forensic inspection, and shows linked suspects.
 */

import React, { useState } from 'react';
import { useGameStore } from '@/game/state/store';
import { gameService } from '@/game/services/gameService';
import type { Evidence, EvidenceId } from '@/game/types';

export const EvidenceView: React.FC = () => {
  const activeCase = useGameStore((state) => state.activeCase);
  const discoveredEvidenceIds = useGameStore((state) => state.discoveredEvidenceIds);
  const inspectedEvidenceIds = useGameStore((state) => state.inspectedEvidenceIds);
  const visitedLocationIds = useGameStore((state) => state.visitedLocationIds);
  const inspectEvidenceInStore = useGameStore((state) => state.inspectEvidence);

  const [selectedEvidenceId, setSelectedEvidenceId] = useState<EvidenceId | null>(null);
  const [filter, setFilter] = useState<'all' | 'inspected' | 'uninspected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allEvidence = activeCase.evidence;
  const discoveredList = allEvidence.filter((e) => discoveredEvidenceIds.has(e.id));
  const discoverableList = allEvidence.filter(
    (e) => !discoveredEvidenceIds.has(e.id) && visitedLocationIds.has(e.location),
  );

  const filteredDiscovered = discoveredList.filter((e) => {
    const isInspected = inspectedEvidenceIds.has(e.id);
    if (filter === 'inspected' && !isInspected) return false;
    if (filter === 'uninspected' && isInspected) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const selectedEvidence = selectedEvidenceId
    ? allEvidence.find((e) => e.id === selectedEvidenceId)
    : filteredDiscovered[0] ?? null;

  const handleInspect = (id: EvidenceId) => {
    inspectEvidenceInStore(id);
    gameService.inspectEvidence(id);
    setSelectedEvidenceId(id);
  };

  const isInspected = selectedEvidence ? inspectedEvidenceIds.has(selectedEvidence.id) : false;

  const relatedSuspects = selectedEvidence
    ? activeCase.suspects.filter((s) => selectedEvidence.relatedSuspectIds.includes(s.id))
    : [];

  const relatedEvidence = selectedEvidence
    ? allEvidence.filter(
        (e) =>
          discoveredEvidenceIds.has(e.id) &&
          e.id !== selectedEvidence.id &&
          selectedEvidence.relatedEvidenceIds.includes(e.id),
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Evidence Locker</h2>
          <p className="text-xs text-[var(--color-text-muted)]">
            {discoveredList.length} of {allEvidence.length} items discovered ({inspectedEvidenceIds.size} inspected)
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Filter clues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-amber)]"
          />

          <div className="flex bg-[var(--color-surface-hover)] p-1 rounded-lg border border-[var(--color-border)]">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                filter === 'all'
                  ? 'bg-[var(--color-amber)] text-black font-semibold'
                  : 'text-[var(--color-text-secondary)] hover:text-white'
              }`}
            >
              All ({discoveredList.length})
            </button>
            <button
              onClick={() => setFilter('inspected')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                filter === 'inspected'
                  ? 'bg-[var(--color-amber)] text-black font-semibold'
                  : 'text-[var(--color-text-secondary)] hover:text-white'
              }`}
            >
              Inspected ({inspectedEvidenceIds.size})
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Discovered Items List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredDiscovered.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-text-muted)]">No evidence items match current filter.</p>
              {discoverableList.length > 0 && (
                <p className="text-xs text-[var(--color-amber)] mt-2">
                  💡 Visit unlocked locations to discover {discoverableList.length} hidden clues!
                </p>
              )}
            </div>
          ) : (
            filteredDiscovered.map((item) => {
              const itemInspected = inspectedEvidenceIds.has(item.id);
              const isSelected = selectedEvidence?.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedEvidenceId(item.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[var(--color-surface-hover)] border-[var(--color-amber)] shadow-md'
                      : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm text-[var(--color-text-primary)]">{item.name}</h3>
                    {itemInspected ? (
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-[oklch(75%_0.18_75_/_0.15)] text-[var(--color-amber)] border border-[oklch(75%_0.18_75_/_0.3)]">
                        Inspected
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-[oklch(60%_0.15_230_/_0.15)] text-cyan-300 border border-cyan-500/30">
                        New Clue
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] line-clamp-2">{item.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]">
                      📍 {item.location}
                    </span>
                    {item.tags.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Item Detail */}
        <div className="lg:col-span-7">
          {selectedEvidence ? (
            <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
              <div className="flex items-start justify-between border-b border-[var(--color-border)] pb-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-amber)]">
                    Evidence ID: {selectedEvidence.id}
                  </span>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mt-1">{selectedEvidence.name}</h3>
                </div>
                {!isInspected ? (
                  <button
                    onClick={() => handleInspect(selectedEvidence.id)}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-[var(--color-amber)] text-black hover:bg-amber-400 transition-all shadow-md"
                  >
                    🔍 Perform Forensic Inspection
                  </button>
                ) : (
                  <span className="px-3 py-1 text-xs font-semibold rounded bg-[oklch(75%_0.18_75_/_0.15)] text-[var(--color-amber)] border border-[oklch(75%_0.18_75_/_0.3)]">
                    ✓ Forensic Analysis Complete
                  </span>
                )}
              </div>

              {/* Surface Description */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Initial Discovery Note</h4>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{selectedEvidence.description}</p>
              </div>

              {/* Detailed Description */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Detailed Item Specification</h4>
                <p className="text-sm text-[var(--color-text-primary)] leading-relaxed bg-[var(--color-surface-hover)] p-3 rounded-lg border border-[var(--color-border)]">
                  {selectedEvidence.detailedDescription}
                </p>
              </div>

              {/* Forensic Analysis Card */}
              {isInspected && (
                <div
                  className="p-4 rounded-lg text-sm leading-relaxed"
                  style={{
                    background: 'oklch(75% 0.18 75 / 0.08)',
                    border: '1px solid oklch(75% 0.18 75 / 0.25)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-amber)]">
                      💡 Forensic Analysis & Laboratory Findings
                    </span>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    {selectedEvidence.detailedDescription}
                  </p>
                </div>
              )}

              {/* Connected Suspects */}
              {relatedSuspects.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-widest mb-2 text-[var(--color-text-muted)]">Linked Persons of Interest</p>
                  <div className="flex flex-wrap gap-2">
                    {relatedSuspects.map((s) => (
                      <span
                        key={s.id}
                        className="px-3 py-1 text-xs rounded-lg bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
                      >
                        👤 {s.name} ({s.title})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Discovered Evidence */}
              {relatedEvidence.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-widest mb-2 text-[var(--color-text-muted)]">Corroborating Discovered Evidence</p>
                  <div className="flex flex-wrap gap-2">
                    {relatedEvidence.map((re) => (
                      <button
                        key={re.id}
                        onClick={() => setSelectedEvidenceId(re.id)}
                        className="px-3 py-1 text-xs rounded-lg bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-amber)] hover:border-[var(--color-amber)]"
                      >
                        🔗 {re.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-text-muted)]">Select an evidence item to view forensic dossier.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
import { executeWebMCPTool } from '@/webmcp/register';
import type { Evidence, EvidenceId } from '@/game/types';
import { Badge } from '@/components/ui/Badge';

export const EvidenceView: React.FC = () => {
  const activeCase = useGameStore((state) => state.activeCase);
  const discoveredEvidenceIds = useGameStore((state) => state.discoveredEvidenceIds);
  const inspectedEvidenceIds = useGameStore((state) => state.inspectedEvidenceIds);
  const visitedLocationIds = useGameStore((state) => state.visitedLocationIds);
  const storeDiscoveredList = useGameStore((state) => state.discoveredEvidence);
  const inspectEvidenceInStore = useGameStore((state) => state.inspectEvidence);

  const [selectedEvidenceId, setSelectedEvidenceId] = useState<EvidenceId | null>(null);
  const [filter, setFilter] = useState<'all' | 'inspected' | 'uninspected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const allEvidence = activeCase.evidence;

  // Build unique deduplicated list of discovered evidence
  const uniqueMap = new Map<string, Evidence>();
  
  // 1. Include base evidence matching discoveredEvidenceIds
  allEvidence.forEach((e) => {
    if (discoveredEvidenceIds.has(e.id)) {
      uniqueMap.set(e.id, e);
    }
  });

  // 2. Include items stored from WebMCP search_evidence results
  storeDiscoveredList.forEach((item) => {
    const fullEv = allEvidence.find((e) => e.id === item.id);
    if (fullEv) {
      uniqueMap.set(fullEv.id, fullEv);
    }
  });

  const discoveredList = Array.from(uniqueMap.values());
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

  const handleWebMCPSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    try {
      await executeWebMCPTool('search_evidence', { query: searchQuery.trim() });
    } catch {
      // safe fallback
    } finally {
      setIsSearching(false);
    }
  };

  // Check if store has a selectedEvidence populated via WebMCP inspect_evidence
  const storeSelectedEvidence = useGameStore((state) => state.selectedEvidence);

  // Determine active item to render in detail panel
  const activeDetail = storeSelectedEvidence ?? (selectedEvidenceId
    ? allEvidence.find((e) => e.id === selectedEvidenceId)
    : filteredDiscovered[0] ?? null);

  const activeId = activeDetail?.id;
  const isInspected = activeId ? inspectedEvidenceIds.has(activeId) : false;

  // Resolve location name
  const loc = activeId ? activeCase.locations.find((l) => l.id === (activeDetail as any).location) : null;
  const locationName = (activeDetail as any)?.locationName ?? loc?.name ?? (activeDetail as any)?.location ?? 'Gallery Scene';

  // Resolve related suspects
  const relatedSuspects = activeDetail
    ? ((activeDetail as any).relatedSuspects && typeof (activeDetail as any).relatedSuspects[0] === 'object'
        ? (activeDetail as any).relatedSuspects
        : activeCase.suspects.filter((s) => (activeDetail as any).relatedSuspectIds?.includes(s.id)))
    : [];

  // Resolve contradiction notice
  const timelineContradiction = activeId
    ? activeCase.timeline.find((t) => t.isContradiction && t.evidenceIds.includes(activeId))
    : null;

  let contradictionNotice = (activeDetail as any)?.contradictionNotice;
  if (!contradictionNotice && timelineContradiction) {
    const suspectId = timelineContradiction.contradictsSuspectId || timelineContradiction.suspectIds[0];
    const suspect = activeCase.suspects.find((s) => s.id === suspectId);
    contradictionNotice = {
      suspectName: suspect?.name ?? suspectId ?? 'Suspect',
      time: timelineContradiction.time,
      statement: suspect?.alibi || suspect?.initialStatement || 'Stated alternative timeline.',
      observation: `Evidence proves activity at ${timelineContradiction.time}, directly contradicting ${suspect?.name || 'suspect'}'s stated timeline.`,
    };
  }

  const selectedEvidenceItem = activeDetail
    ? {
        id: activeDetail.id,
        name: activeDetail.name,
        description: activeDetail.description,
        detailedDescription: activeDetail.detailedDescription,
        locationName,
        tags: activeDetail.tags,
        relevantTimestamp: (activeDetail as any).relevantTimestamp ?? timelineContradiction?.time ?? null,
        whatItProves: (activeDetail as any).whatItProves ?? (activeDetail as any).detailedDescription ?? activeDetail.description,
        relatedSuspects,
        relatedDiscoveredEvidence: (activeDetail as any).relatedDiscoveredEvidence ?? activeCase.evidence.filter(
          (e) => discoveredEvidenceIds.has(e.id) && e.id !== activeDetail.id && (activeDetail as any).relatedEvidenceIds?.includes(e.id),
        ),
        contradictionNotice,
      }
    : null;

  return (
    <div className="p-6 md:p-8 animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: 'var(--color-amber)' }}
            >
              📄 Evidence Locker
            </span>
            <div className="h-px flex-1" style={{ background: 'var(--color-border-subtle)' }} />
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-playfair)' }}>
            Discovered Clues &amp; Forensics
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            {discoveredList.length} of {allEvidence.length} items discovered ({inspectedEvidenceIds.size} inspected)
          </p>
        </div>

        {/* WebMCP Search Controls */}
        <form onSubmit={handleWebMCPSearch} className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <input
              type="text"
              placeholder="Search evidence (e.g. keycard)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-amber)] w-56"
            />
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-amber)] hover:border-[var(--color-amber)] transition-all cursor-pointer flex items-center gap-1"
          >
            {isSearching ? 'Searching...' : '🔍 WebMCP Search'}
          </button>

          <div className="flex bg-[var(--color-surface-hover)] p-1 rounded-lg border border-[var(--color-border)]">
            <button
              type="button"
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
              type="button"
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
        </form>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Discovered Items List */}
        <div className="lg:col-span-5 space-y-3" id="evidence-list-container">
          {filteredDiscovered.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
              <p className="text-sm text-[var(--color-text-muted)]">No evidence items match current filter.</p>
              <p className="text-xs text-[var(--color-amber)]">
                Pass &quot;keycard&quot;, &quot;whiskey&quot;, or &quot;cctv&quot; to <code className="text-amber-300">search_evidence</code> to discover clues!
              </p>
            </div>
          ) : (
            filteredDiscovered.map((item) => {
              const itemInspected = inspectedEvidenceIds.has(item.id);
              const isSelected = selectedEvidenceItem?.id === item.id;
              
              // Check if item is linked to a contradiction
              const hasContradiction = activeCase.timeline.some(
                (t) => t.isContradiction && t.evidenceIds.includes(item.id),
              );

              // Find location name
              const itemLoc = activeCase.locations.find((l) => l.id === item.location);
              const locName = itemLoc?.name ?? item.location;

              // Find related suspects
              const suspectsLinked = activeCase.suspects.filter((s) => item.relatedSuspectIds?.includes(s.id));

              return (
                <div
                  key={item.id}
                  id={`evidence-card-${item.id}`}
                  onClick={() => handleInspect(item.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'bg-[var(--color-surface-hover)] border-[var(--color-amber)] shadow-md'
                      : hasContradiction
                      ? 'bg-[var(--color-surface)] border-crimson/50 hover:border-crimson'
                      : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
                        EVIDENCE DISCOVERED · ID: {item.id}
                      </span>
                      <h3 className="font-semibold text-sm text-[var(--color-text-primary)] mt-0.5">{item.name}</h3>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {hasContradiction && (
                        <Badge variant="crimson">⚠ Potential contradiction</Badge>
                      )}
                      {itemInspected ? (
                        <Badge variant="amber">Inspected</Badge>
                      ) : (
                        <Badge variant="muted">Discovered</Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 leading-relaxed">{item.description}</p>

                  <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-[var(--color-border-subtle)] text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]">
                      📍 {locName}
                    </span>

                    {suspectsLinked.length > 0 && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        👤 {suspectsLinked.map((s) => s.name).join(', ')}
                      </span>
                    )}

                    {item.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected / Inspected Evidence Detail (WebMCP Synced) */}
        <div className="lg:col-span-7" id="evidence-detail-panel">
          {selectedEvidenceItem ? (
            <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6 animate-fade-in">
              {/* Top Bar */}
              <div className="flex items-start justify-between border-b border-[var(--color-border)] pb-4 gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-amber)]">
                      Dossier ID: {selectedEvidenceItem.id}
                    </span>
                    {selectedEvidenceItem.relevantTimestamp && (
                      <Badge variant="amber">⏱ Timestamp: {selectedEvidenceItem.relevantTimestamp}</Badge>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--color-text-primary)] font-playfair">
                    {selectedEvidenceItem.name}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    📍 Location: <span className="text-[var(--color-text-primary)] font-medium">{selectedEvidenceItem.locationName}</span>
                  </p>
                </div>

                {!isInspected ? (
                  <button
                    onClick={() => handleInspect(selectedEvidenceItem.id)}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-[var(--color-amber)] text-black hover:bg-amber-400 transition-all shadow-md cursor-pointer shrink-0"
                  >
                    🔍 Inspect Evidence
                  </button>
                ) : (
                  <span className="px-3 py-1 text-xs font-semibold rounded bg-[oklch(75%_0.18_75_/_0.15)] text-[var(--color-amber)] border border-[oklch(75%_0.18_75_/_0.3)] shrink-0">
                    ✓ Inspection Complete
                  </span>
                )}
              </div>

              {/* Surface Description */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] mb-1 font-mono">
                  Discovery Description
                </h4>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {selectedEvidenceItem.description}
                </p>
              </div>

              {/* What This Evidence Proves / Lab Findings */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-[var(--color-amber)] mb-1 font-mono font-semibold">
                  💡 What This Evidence Proves / Lab Findings
                </h4>
                <p className="text-sm text-[var(--color-text-primary)] leading-relaxed bg-[var(--color-surface-hover)] p-4 rounded-lg border border-[var(--color-border)] font-sans">
                  {selectedEvidenceItem.whatItProves}
                </p>
              </div>

              {/* Prominent Contradiction Callout Box */}
              {selectedEvidenceItem.contradictionNotice && (
                <div
                  id="evidence-contradiction-callout"
                  className="p-4.5 rounded-xl border space-y-2 text-xs leading-relaxed"
                  style={{
                    background: 'oklch(52% 0.22 18 / 0.12)',
                    borderColor: 'oklch(52% 0.22 18 / 0.4)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <div className="flex items-center gap-2 font-mono font-bold uppercase tracking-wider text-xs" style={{ color: 'var(--color-crimson)' }}>
                    <span className="text-base">⚠️</span>
                    <span>CONTRADICTION DETECTED</span>
                  </div>

                  <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    <strong style={{ color: 'var(--color-amber)' }}>{selectedEvidenceItem.contradictionNotice.suspectName}&apos;s activity:</strong> {selectedEvidenceItem.name} proves activity at {selectedEvidenceItem.contradictionNotice.time || 'scene time'}.
                  </p>

                  <div
                    className="p-3 rounded font-mono text-xs italic space-y-1"
                    style={{
                      background: 'var(--color-surface-1)',
                      border: '1px solid var(--color-border-subtle)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <p className="text-[10px] uppercase font-bold tracking-widest font-sans non-italic" style={{ color: 'var(--color-crimson)' }}>
                      Stated Alibi / Statement:
                    </p>
                    <p>&ldquo;{selectedEvidenceItem.contradictionNotice.statement}&rdquo;</p>
                  </div>

                  <p className="font-semibold text-amber-400">
                    {selectedEvidenceItem.contradictionNotice.observation}
                  </p>
                </div>
              )}

              {/* Linked Persons of Interest */}
              {selectedEvidenceItem.relatedSuspects.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-widest mb-2 text-[var(--color-text-muted)] font-mono">
                    Associated Suspect / Relevant People
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvidenceItem.relatedSuspects.map((s: any) => (
                      <span
                        key={s.id || s.name}
                        className="px-3 py-1.5 text-xs rounded-lg bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-primary)] flex items-center gap-1.5"
                      >
                        👤 <span className="font-semibold text-amber-300">{s.name}</span> {s.title ? `(${s.title})` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Corroborating Evidence */}
              {selectedEvidenceItem.relatedDiscoveredEvidence?.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-widest mb-2 text-[var(--color-text-muted)] font-mono">
                    Corroborating Discovered Evidence
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvidenceItem.relatedDiscoveredEvidence.map((re: any) => (
                      <button
                        key={re.id}
                        onClick={() => handleInspect(re.id)}
                        className="px-3 py-1.5 text-xs rounded-lg bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-amber)] hover:border-[var(--color-amber)] transition-colors cursor-pointer"
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
              <p className="text-sm text-[var(--color-text-muted)]">
                Select an evidence item or execute <code className="text-amber-300">inspect_evidence</code> to view forensic dossier.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

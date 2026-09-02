'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/game/state/store';
import { getVisibleTimelineEvents } from '@/game/logic/investigation';
import { executeWebMCPTool } from '@/webmcp/register';
import { Badge } from '@/components/ui/Badge';

function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function TimelineView() {
  const activeCase = useGameStore((s) => s.activeCase);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);
  const interviewedSuspectIds = useGameStore((s) => s.interviewedSuspectIds);
  const storeTimelineEvents = useGameStore((s) => s.timelineEvents);
  const storeContradictions = useGameStore((s) => s.contradictions);
  const setActiveView = useGameStore((s) => s.setActiveView);

  const [isBuilding, setIsBuilding] = useState(false);

  const visibleEvents = getVisibleTimelineEvents(
    activeCase,
    discoveredEvidenceIds,
    interviewedSuspectIds,
  );

  const handleBuildTimeline = async () => {
    setIsBuilding(true);
    try {
      await executeWebMCPTool('build_timeline', {});
    } catch {
      // safe fallback
    } finally {
      setIsBuilding(false);
    }
  };

  // Build events array (prioritize WebMCP build_timeline results if present)
  const rawEvents = (storeTimelineEvents && storeTimelineEvents.length > 0)
    ? [...storeTimelineEvents]
    : visibleEvents.map((e) => {
        const relatedEv = e.evidenceIds.map((eid) => activeCase.evidence.find((ev) => ev.id === eid)).filter(Boolean);
        const loc = relatedEv[0] ? activeCase.locations.find((l) => l.id === relatedEv[0]?.location)?.name : null;
        return {
          id: e.id,
          time: e.time,
          description: e.description,
          source: e.source,
          suspectsInvolved: e.suspectIds.map((sid) => activeCase.suspects.find((s) => s.id === sid)?.name ?? sid),
          isContradiction: e.isContradiction,
          contradictsSuspect: e.contradictsSuspectId
            ? activeCase.suspects.find((s) => s.id === e.contradictsSuspectId)?.name ?? e.contradictsSuspectId
            : null,
          location: loc || (e.description.toLowerCase().includes('office') ? 'Private Office' : e.description.toLowerCase().includes('forecourt') ? 'Forecourt' : 'Main Gallery'),
        };
      });

  // Sort events strictly chronologically
  const sortedEvents = [...rawEvents].sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));

  return (
    <div className="p-6 md:p-8 animate-fade-in space-y-6">
      {/* Header & WebMCP Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: 'var(--color-amber)' }}
            >
              ◷ Timeline Reconstruction
            </span>
            <div className="h-px flex-1" style={{ background: 'var(--color-border-subtle)' }} />
          </div>
          <h1
            className="text-3xl font-bold mb-1 font-playfair"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Chronological Sequence of Events
          </h1>
          <p className="text-xs text-[var(--color-text-muted)]">
            {sortedEvents.length} chronological evening events established &amp; verified via WebMCP.
          </p>
        </div>

        <button
          onClick={handleBuildTimeline}
          disabled={isBuilding}
          className="px-4 py-2 text-xs font-bold rounded-lg bg-[var(--color-amber)] text-black hover:bg-amber-400 transition-all shadow-md cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          {isBuilding ? 'Reconstructing...' : '⚡ Reconstruct Timeline (WebMCP)'}
        </button>
      </div>

      {/* Contradictions Banner */}
      {storeContradictions && storeContradictions.length > 0 && (
        <div
          id="timeline-contradictions-summary"
          className="p-4 rounded-xl border space-y-2 text-xs leading-relaxed"
          style={{
            background: 'oklch(52% 0.22 18 / 0.12)',
            borderColor: 'oklch(52% 0.22 18 / 0.4)',
          }}
        >
          <div className="flex items-center gap-2 font-mono font-bold uppercase tracking-wider text-xs" style={{ color: 'var(--color-crimson)' }}>
            <span>⚡ {storeContradictions.length} TIMELINE CONTRADICTIONS UNCOVERED</span>
          </div>

          <div className="space-y-1.5">
            {storeContradictions.map((c: any, idx: number) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]">
                <span className="font-mono text-amber-300 shrink-0">[{c.eventTime}]</span>
                <span>
                  <strong className="text-amber-300">{c.contradictedSuspect}</strong> claims: &ldquo;{c.suspectClaim}&rdquo; — <em>{c.eventDescription}</em>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline List */}
      <div className="relative pl-8">
        {/* Vertical Connecting Line */}
        <div
          className="absolute left-3 top-3 bottom-3 w-px"
          style={{ background: 'var(--color-border)' }}
        />

        <div className="space-y-4" id="timeline-events-container">
          {sortedEvents.map((event) => {
            const isContradiction = event.isContradiction;
            const suspectsInvolved = (event.suspectsInvolved || []) as string[];

            return (
              <div key={event.id || event.time} className="relative animate-fade-in">
                {/* Event Dot */}
                <div
                  className="absolute -left-8 top-3.5 w-3.5 h-3.5 rounded-full border-2 transition-colors"
                  style={{
                    background: isContradiction
                      ? 'var(--color-crimson)'
                      : 'var(--color-amber)',
                    borderColor: isContradiction
                      ? 'var(--color-crimson)'
                      : 'var(--color-amber)',
                    boxShadow: isContradiction
                      ? '0 0 10px oklch(52% 0.22 18 / 0.5)'
                      : '0 0 6px oklch(75% 0.18 75 / 0.3)',
                  }}
                />

                <div
                  className="card p-5 space-y-3"
                  style={
                    isContradiction
                      ? { borderColor: 'oklch(52% 0.22 18 / 0.45)', background: 'var(--color-surface)' }
                      : { borderColor: 'var(--color-border)', background: 'var(--color-surface)' }
                  }
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap border-b border-[var(--color-border-subtle)] pb-2.5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className="text-base font-mono font-bold shrink-0"
                        style={{ color: 'var(--color-amber)' }}
                      >
                        ⏱ {event.time}
                      </span>

                      {event.location && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]">
                          📍 {event.location}
                        </span>
                      )}

                      {event.source && (
                        <Badge variant="muted">📄 {event.source}</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isContradiction && (
                        <Badge variant="crimson">⚡ Contradiction Detected</Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed font-sans text-[var(--color-text-primary)]">
                    {event.description}
                  </p>

                  {/* Contradiction Callout */}
                  {isContradiction && event.contradictsSuspect && (
                    <div className="p-3 rounded-lg bg-crimson/10 border border-crimson/30 text-xs space-y-1">
                      <p className="font-bold text-crimson uppercase tracking-wider text-[10px] font-mono">
                        ⚠ Contradicts {event.contradictsSuspect}&apos;s Statement
                      </p>
                      <p className="text-[var(--color-text-secondary)] italic">
                        Established evidence proves activity at {event.time}, conflicting with {event.contradictsSuspect}&apos;s stated timeline.
                      </p>
                    </div>
                  )}

                  {/* Suspects involved */}
                  {suspectsInvolved.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                      <span className="text-[var(--color-text-muted)] font-mono uppercase text-[10px] tracking-wider">
                        Persons Involved:
                      </span>
                      {suspectsInvolved.map((name) => (
                        <button
                          key={name}
                          onClick={() => setActiveView('suspects')}
                          className="text-xs px-2.5 py-0.5 rounded-full cursor-pointer hover:border-amber-500 transition-colors bg-[var(--color-surface-hover)] text-amber-300 border border-[var(--color-border)]"
                        >
                          👤 {name}
                        </button>
                      ))}
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


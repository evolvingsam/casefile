'use client';

import React from 'react';
import { useGameStore } from '@/game/state/store';
import { Badge } from '@/components/ui/Badge';

export function StructuredFindingsWidget() {
  const contradictions = useGameStore((s) => s.contradictions);
  const investigativeLeads = useGameStore((s) => s.investigativeLeads);

  if (contradictions.length === 0 && investigativeLeads.length === 0) {
    return null;
  }

  return (
    <div id="structured-findings-widget" className="space-y-4 animate-fade-in my-4">
      {/* 1. Contradictions Cards */}
      {contradictions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-crimson animate-pulse" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-crimson">
              ⚠ CONTRADICTIONS DISCOVERED ({contradictions.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contradictions.map((c: any, idx: number) => (
              <div
                key={c.id || idx}
                id={`contradiction-card-${c.id || idx}`}
                className="p-5 rounded-xl border space-y-3 shadow-md transition-all"
                style={{
                  background: 'oklch(52% 0.22 18 / 0.12)',
                  borderColor: 'oklch(52% 0.22 18 / 0.4)',
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="crimson">⚠ CONTRADICTION</Badge>
                  {(c.eventTime || c.time) && (
                    <span className="text-xs font-mono font-bold text-amber-300">
                      ⏱ {c.eventTime || c.time}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs leading-relaxed">
                  {c.suspectClaim && (
                    <div className="p-2.5 rounded bg-surface-1 border border-border-subtle text-slate-200">
                      <p className="text-[10px] uppercase font-bold tracking-wider font-mono text-crimson mb-0.5">
                        Suspect Stated Claim:
                      </p>
                      <p className="italic">&ldquo;{c.suspectClaim}&rdquo;</p>
                    </div>
                  )}

                  {(c.eventDescription || c.description) && (
                    <div className="p-2.5 rounded bg-surface-hover border border-border-subtle text-slate-100 font-medium">
                      <p className="text-[10px] uppercase font-bold tracking-wider font-mono text-amber-300 mb-0.5">
                        Physical / Keycard Evidence Proves:
                      </p>
                      <p>{c.eventDescription || c.description}</p>
                    </div>
                  )}

                  {c.observation && (
                    <p className="font-semibold text-amber-400 pt-1">
                      {c.observation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Investigative Leads Cards */}
      {investigativeLeads.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
              INVESTIGATIVE LEADS ({investigativeLeads.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {investigativeLeads.map((lead: any, idx: number) => (
              <div
                key={lead.id || idx}
                id={`lead-card-${lead.id || idx}`}
                className="p-4 rounded-xl border space-y-2 bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-amber)] transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-amber)] font-bold">
                    INVESTIGATIVE LEAD
                  </span>
                  <Badge variant="amber">{lead.status || 'active'}</Badge>
                </div>

                <h4 className="font-bold text-sm text-[var(--color-text-primary)]">
                  {lead.title}
                </h4>

                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {lead.description}
                </p>

                {lead.sourceTool && (
                  <p className="text-[10px] font-mono text-[var(--color-text-muted)] pt-1">
                    Source: WebMCP {lead.sourceTool}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

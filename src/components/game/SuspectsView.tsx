'use client';

import { useState } from 'react';
import { useGameStore } from '@/game/state/store';
import type { Suspect } from '@/game/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// ─── Interview modal ──────────────────────────────────────────────────────────

function InterviewModal({
  suspect,
  onClose,
}: {
  suspect: Suspect;
  onClose: () => void;
}) {
  const recordInterview = useGameStore((s) => s.recordInterview);
  const interviews = useGameStore((s) => s.interviews);
  const [askedIds, setAskedIds] = useState<Set<string>>(new Set());

  const alreadyAsked = interviews
    .filter((i) => i.suspectId === suspect.id)
    .map((i) => i.question);

  function askQuestion(q: { id: string; question: string; answer: string }) {
    if (askedIds.has(q.id)) return;
    setAskedIds((prev) => new Set([...prev, q.id]));
    recordInterview({
      suspectId: suspect.id,
      question: q.question,
      response: q.answer,
      timestamp: Date.now(),
    });
  }

  const answeredHere = interviews.filter((i) => i.suspectId === suspect.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'oklch(5% 0.01 280 / 0.85)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="card w-full max-w-xl animate-fade-in"
        style={{ maxHeight: '88dvh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div
          className="p-5 border-b flex items-start justify-between gap-4"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <div>
            <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-crimson)' }}>
              Interview
            </span>
            <h2
              className="text-xl font-bold"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {suspect.name}
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {suspect.occupation}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 text-lg leading-none w-8 h-8 flex items-center justify-center rounded"
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

        <div className="p-5 space-y-5">
          {/* Initial statement */}
          <div
            className="p-4 rounded-lg text-sm italic leading-relaxed"
            style={{
              background: 'var(--color-surface-3)',
              borderLeft: '3px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {suspect.initialStatement}
          </div>

          {/* Q&A answers so far */}
          {answeredHere.length > 0 && (
            <div className="space-y-3">
              {answeredHere.map((entry, i) => (
                <div key={i} className="space-y-1">
                  <p
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--color-amber)' }}
                  >
                    Q: {entry.question}
                  </p>
                  <p
                    className="text-sm italic leading-relaxed pl-3"
                    style={{
                      color: 'var(--color-text-secondary)',
                      borderLeft: '2px solid var(--color-border-subtle)',
                    }}
                  >
                    {entry.response}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Question buttons */}
          <div>
            <p
              className="text-xs uppercase tracking-widest mb-3"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Questions
            </p>
            <div className="space-y-2">
              {suspect.interviewResponses.map((q) => {
                const asked = askedIds.has(q.id);
                return (
                  <button
                    key={q.id}
                    onClick={() => askQuestion(q)}
                    disabled={asked}
                    className="w-full text-left px-4 py-3 rounded-md text-sm transition-all duration-150"
                    style={{
                      background: asked
                        ? 'var(--color-surface-1)'
                        : 'var(--color-surface-3)',
                      border: '1px solid var(--color-border-subtle)',
                      color: asked
                        ? 'var(--color-text-muted)'
                        : 'var(--color-text-secondary)',
                      cursor: asked ? 'default' : 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (!asked) {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          'var(--color-amber-dim)';
                        (e.currentTarget as HTMLElement).style.color =
                          'var(--color-text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!asked) {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          'var(--color-border-subtle)';
                        (e.currentTarget as HTMLElement).style.color =
                          'var(--color-text-secondary)';
                      }
                    }}
                  >
                    {asked ? '✓ ' : '→ '}
                    {q.question}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-5 pt-0">
          <Button variant="secondary" size="sm" onClick={onClose} className="w-full">
            End Interview
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Suspect card ─────────────────────────────────────────────────────────────

function SuspectCard({
  suspect,
  isInterviewed,
  onClick,
}: {
  suspect: Suspect;
  isInterviewed: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className="card card-interactive p-5 flex items-start gap-5"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      style={isInterviewed ? { borderColor: 'oklch(75% 0.18 75 / 0.25)' } : {}}
    >
      {/* Avatar */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 font-bold"
        style={{
          background: isInterviewed
            ? 'oklch(75% 0.18 75 / 0.1)'
            : 'var(--color-surface-3)',
          color: isInterviewed ? 'var(--color-amber)' : 'var(--color-text-muted)',
          border: isInterviewed
            ? '1px solid oklch(75% 0.18 75 / 0.3)'
            : '1px solid var(--color-border)',
        }}
      >
        {suspect.name.charAt(0)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap mb-1">
          <h3
            className="text-base font-semibold"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {suspect.name}
          </h3>
          <Badge variant="muted">{suspect.title}</Badge>
          {isInterviewed && <Badge variant="amber">Interviewed</Badge>}
        </div>
        <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
          {suspect.occupation} · {suspect.relationship}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          {suspect.description}
        </p>
        <p className="text-xs mt-2 italic" style={{ color: 'var(--color-text-muted)' }}>
          Alibi: {suspect.alibi}
        </p>
      </div>

      {/* Action */}
      <div
        className="text-xs shrink-0 self-center font-medium"
        style={{ color: isInterviewed ? 'var(--color-amber-dim)' : 'var(--color-text-muted)' }}
      >
        {isInterviewed ? '✓ Done' : 'Interview →'}
      </div>
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

export function SuspectsView() {
  const activeCase = useGameStore((s) => s.activeCase);
  const interviewedSuspectIds = useGameStore((s) => s.interviewedSuspectIds);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedSuspect = activeCase.suspects.find((s) => s.id === selectedId);

  return (
    <div className="p-8 animate-fade-in space-y-6">
      {/* Modal */}
      {selectedSuspect && (
        <InterviewModal
          suspect={selectedSuspect}
          onClose={() => setSelectedId(null)}
        />
      )}

      <div>
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: 'var(--color-amber)' }}
          >
            👤 Suspects
          </span>
          <div className="h-px flex-1" style={{ background: 'var(--color-border-subtle)' }} />
        </div>
        <h1
          className="text-3xl font-bold mb-1"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Persons of Interest
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {activeCase.suspects.length} suspects.{' '}
          <span style={{ color: 'var(--color-text-muted)' }}>
            {interviewedSuspectIds.size} interviewed. Click a suspect to conduct an interview.
          </span>
        </p>
      </div>

      <div className="space-y-3">
        {activeCase.suspects.map((suspect) => (
          <SuspectCard
            key={suspect.id}
            suspect={suspect}
            isInterviewed={interviewedSuspectIds.has(suspect.id)}
            onClick={() => setSelectedId(suspect.id)}
          />
        ))}
      </div>
    </div>
  );
}

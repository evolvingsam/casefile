'use client';

import { useState } from 'react';
import { useGameStore } from '@/game/state/store';
import type { Suspect, SuspectId } from '@/game/types';
import {
  getKnownSuspectInfo,
  getEvidenceSuspects,
} from '@/game/logic/investigation';
import {
  getQuestionAvailability,
  getInterviewResponse,
  buildInterviewEntry,
} from '@/game/logic/interviews';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { executeWebMCPTool } from '@/webmcp/register';

// ─── Suspect Profile & Interview Modal ──────────────────────────────────────

function SuspectModal({
  suspectId,
  onClose,
}: {
  suspectId: SuspectId;
  onClose: () => void;
}) {
  const activeCase = useGameStore((s) => s.activeCase);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);
  const interviewedSuspectIds = useGameStore((s) => s.interviewedSuspectIds);
  const interviews = useGameStore((s) => s.interviews);
  const recordInterview = useGameStore((s) => s.recordInterview);
  const addNote = useGameStore((s) => s.addNote);
  const setActiveView = useGameStore((s) => s.setActiveView);

  const [activeTab, setActiveTab] = useState<'interview' | 'profile'>('interview');
  const [noteText, setNoteText] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  const knownInfo = getKnownSuspectInfo(
    activeCase,
    suspectId,
    discoveredEvidenceIds,
    interviewedSuspectIds,
    interviews,
  );

  if (!knownInfo) return null;
  const { suspect, isInterviewed, linkedEvidenceIds, interviewHistory, hasContradiction } =
    knownInfo;

  const questions = getQuestionAvailability(suspect, discoveredEvidenceIds, interviews);

  const handleAskQuestion = (questionId: string) => {
    const qObj = getInterviewResponse(activeCase, suspect.id, questionId);
    if (!qObj) return;

    const entry = buildInterviewEntry(suspect.id, qObj);
    recordInterview(entry);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addNote(`Regarding suspect [${suspect.name}]: ${noteText.trim()}`, 'human');
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
        className="w-full sm:max-w-2xl animate-fade-in overflow-y-auto"
        style={{
          background: 'var(--color-surface-1)',
          border: '1px solid var(--color-border)',
          borderRadius: '1rem 1rem 0 0',
          maxHeight: '92dvh',
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
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 font-bold"
              style={{
                background: isInterviewed ? 'oklch(75% 0.18 75 / 0.12)' : 'var(--color-surface-3)',
                color: isInterviewed ? 'var(--color-amber)' : 'var(--color-text-muted)',
                border: isInterviewed
                  ? '1px solid oklch(75% 0.18 75 / 0.3)'
                  : '1px solid var(--color-border)',
              }}
            >
              {suspect.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <Badge variant="muted">{suspect.title}</Badge>
                {isInterviewed && <Badge variant="amber">Interviewed</Badge>}
                {hasContradiction && <Badge variant="crimson">⚡ Statement Contradiction</Badge>}
              </div>
              <h2 className="text-xl font-bold break-words" style={{ fontFamily: 'var(--font-playfair)' }}>
                {suspect.name}
              </h2>
              <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                {suspect.occupation} · {suspect.relationship}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 text-lg leading-none w-8 h-8 flex items-center justify-center rounded"
            style={{ color: 'var(--color-text-muted)' }}
          >
            ✕
          </button>
        </div>

        {/* Navigation Sub-header */}
        <div
          className="px-5 pt-3 border-b flex gap-6 text-sm font-medium"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <button
            className="pb-2 relative cursor-pointer"
            style={{
              color: activeTab === 'interview' ? 'var(--color-amber)' : 'var(--color-text-muted)',
            }}
            onClick={() => setActiveTab('interview')}
          >
            💬 Interview ({interviewHistory.length})
            {activeTab === 'interview' && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ background: 'var(--color-amber)' }}
              />
            )}
          </button>
          <button
            className="pb-2 relative cursor-pointer"
            style={{
              color: activeTab === 'profile' ? 'var(--color-amber)' : 'var(--color-text-muted)',
            }}
            onClick={() => setActiveTab('profile')}
          >
            📋 Dossier &amp; Motive
            {activeTab === 'profile' && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ background: 'var(--color-amber)' }}
              />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 space-y-5">
          {activeTab === 'interview' ? (
            <>
              {/* Statement box */}
              <div
                className="p-4 rounded-lg text-sm leading-relaxed"
                style={{
                  background: 'var(--color-surface-2)',
                  borderLeft: '3px solid var(--color-amber)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--color-amber)' }}>
                  Initial Statement
                </p>
                <p className="italic">{suspect.initialStatement}</p>
              </div>

              {/* Contradiction Banner */}
              {hasContradiction && (
                <div
                  className="p-4 rounded-lg text-sm leading-relaxed"
                  style={{
                    background: 'oklch(52% 0.22 18 / 0.1)',
                    border: '1px solid oklch(52% 0.22 18 / 0.3)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <p className="text-xs font-mono uppercase tracking-widest mb-1 font-bold" style={{ color: 'var(--color-crimson)' }}>
                    ⚡ Discovered Contradiction
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    Physical evidence discovered during the investigation directly contradicts {suspect.name}&apos;s statements regarding their timeline and actions on the night.
                  </p>
                </div>
              )}

              {/* Interview Log so far */}
              {interviewHistory.length > 0 && (
                <div className="space-y-3 min-w-0">
                  <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                    Transcript ({interviewHistory.length} Answers Recorded)
                  </p>
                  {interviewHistory.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-3.5 rounded-lg space-y-1.5 min-w-0"
                      style={{
                        background: 'var(--color-surface-2)',
                        border: '1px solid var(--color-border-subtle)',
                      }}
                    >
                      <p className="text-xs font-semibold break-words" style={{ color: 'var(--color-amber)' }}>
                        Q: {item.question}
                      </p>
                      <p className="text-sm leading-relaxed italic break-words" style={{ color: 'var(--color-text-secondary)' }}>
                        {item.response}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Available Questions */}
              <div>
                <p className="text-xs uppercase tracking-widest mb-2.5" style={{ color: 'var(--color-text-muted)' }}>
                  Interrogate Suspect (Select Question)
                </p>

                <div className="space-y-2">
                  {questions.map(({ question, isAvailable, isAsked, blockedByEvidenceId }) => {
                    const blockingEvidence = blockedByEvidenceId
                      ? activeCase.evidence.find((e) => e.id === blockedByEvidenceId)
                      : null;

                    if (isAsked) {
                      return (
                        <div
                          key={question.id}
                          className="p-3 rounded-lg text-xs flex items-center justify-between opacity-50"
                          style={{
                            background: 'var(--color-surface-2)',
                            border: '1px solid var(--color-border-subtle)',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          <span>✓ {question.question}</span>
                          <span>Asked</span>
                        </div>
                      );
                    }

                    if (!isAvailable) {
                      return (
                        <div
                          key={question.id}
                          className="p-3 rounded-lg text-xs flex items-center justify-between opacity-60"
                          style={{
                            background: 'var(--color-surface-2)',
                            border: '1px border-dashed var(--color-border-subtle)',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          <span className="flex items-center gap-2">
                            🔒 {question.question}
                          </span>
                          <span className="text-[10px] italic">
                            Requires clue: {blockingEvidence?.name ?? 'Undiscovered evidence'}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={question.id}
                        className="w-full text-left p-3.5 rounded-lg text-sm transition-all duration-150 flex items-center justify-between group cursor-pointer"
                        style={{
                          background: 'var(--color-surface-3)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                        }}
                        onClick={() => handleAskQuestion(question.id)}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-amber-dim)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                        }}
                      >
                        <span className="font-medium">💬 {question.question}</span>
                        <span style={{ color: 'var(--color-amber)' }} className="text-xs shrink-0 group-hover:translate-x-1 transition-transform">
                          Ask →
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Profile tab */
            <div className="space-y-5">
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>
                  Background &amp; Role
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {suspect.description}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>
                  Stated Alibi
                </p>
                <p className="text-sm italic leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {suspect.alibi}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--color-amber)' }}>
                  Potential Motive
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {suspect.motive}
                </p>
              </div>

              {/* Linked Evidence */}
              {linkedEvidenceIds.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
                    Linked Evidence Discovered ({linkedEvidenceIds.length})
                  </p>
                  <div className="space-y-2">
                    {linkedEvidenceIds.map((eid) => {
                      const ev = activeCase.evidence.find((e) => e.id === eid);
                      if (!ev) return null;
                      return (
                        <div
                          key={ev.id}
                          className="p-3 rounded-lg text-xs flex items-center justify-between cursor-pointer"
                          style={{
                            background: 'var(--color-surface-2)',
                            border: '1px solid var(--color-border-subtle)',
                          }}
                          onClick={() => {
                            onClose();
                            setActiveView('evidence');
                          }}
                        >
                          <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                            📄 {ev.name}
                          </span>
                          <span style={{ color: 'var(--color-amber-dim)' }}>Inspect Evidence →</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Add Note Section */}
          <div className="pt-3 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
            {!showNoteInput ? (
              <button
                className="text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                style={{ color: 'var(--color-amber-dim)' }}
                onClick={() => setShowNoteInput(true)}
              >
                + Add investigator note regarding {suspect.name}
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
                  placeholder={`Write your notes or deductions about ${suspect.name}...`}
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
            📌 Add to Case Board
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

// ─── Active Suspect Profile View (Driven by get_suspect_profile WebMCP Tool) ─

function ActiveSuspectSection() {
  const activeSuspect = useGameStore((s) => s.activeSuspect);
  const investigativeLeads = useGameStore((s) => s.investigativeLeads);
  const setActiveSuspect = useGameStore((s) => s.setActiveSuspect);
  const setActiveView = useGameStore((s) => s.setActiveView);
  const [isInterrogating, setIsInterrogating] = useState(false);

  if (!activeSuspect) return null;

  // Filter relevant investigative leads for this suspect
  const relevantLeads = investigativeLeads.filter(
    (lead) =>
      lead.title.toLowerCase().includes(activeSuspect.name.toLowerCase()) ||
      lead.description.toLowerCase().includes(activeSuspect.name.toLowerCase()) ||
      lead.title.toLowerCase().includes(activeSuspect.id.toLowerCase()),
  );

  const handleQuestionClick = async (questionId: string) => {
    setIsInterrogating(true);
    try {
      await executeWebMCPTool('interview_suspect', {
        suspect_id: activeSuspect.id,
        question: questionId,
      });
    } catch {
      // safe fallback
    } finally {
      setIsInterrogating(false);
    }
  };

  return (
    <div
      id="active-suspect-profile-view"
      className="card p-6 border-amber-500/40 bg-surface-2 animate-fade-in space-y-5"
      style={{
        borderLeft: '4px solid var(--color-amber)',
      }}
    >
      {/* Top Banner */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold shrink-0"
            style={{
              background: 'oklch(75% 0.18 75 / 0.15)',
              color: 'var(--color-amber)',
              border: '1px solid oklch(75% 0.18 75 / 0.3)',
            }}
          >
            {activeSuspect.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge variant="amber">🤖 WebMCP Loaded Profile</Badge>
              <Badge variant="muted">{activeSuspect.title}</Badge>
              {activeSuspect.isInterviewed ? (
                <Badge variant="amber">Interviewed</Badge>
              ) : (
                <Badge variant="muted">Unquestioned</Badge>
              )}
              {activeSuspect.hasStatementContradiction && (
                <Badge variant="crimson">⚡ Statement Contradiction Found</Badge>
              )}
            </div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
              {activeSuspect.name}
            </h2>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Occupation:</span> {activeSuspect.occupation} · <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Relationship / Role:</span> {activeSuspect.relationship}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveSuspect(null)}
          className="text-xs px-2.5 py-1 rounded cursor-pointer transition-colors"
          style={{ background: 'var(--color-surface-3)', color: 'var(--color-text-muted)' }}
          title="Dismiss Active Suspect Profile"
        >
          ✕ Dismiss
        </button>
      </div>

      {/* Contradiction Warning */}
      {activeSuspect.hasStatementContradiction && (
        <div
          className="p-3.5 rounded-lg text-xs leading-relaxed flex items-start gap-2.5"
          style={{
            background: 'oklch(52% 0.22 18 / 0.12)',
            border: '1px solid oklch(52% 0.22 18 / 0.35)',
            color: 'var(--color-text-primary)',
          }}
        >
          <span className="text-base">⚡</span>
          <div>
            <p className="font-bold uppercase tracking-wider text-[11px]" style={{ color: 'var(--color-crimson)' }}>
              Timeline Contradiction Flagged
            </p>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Physical access evidence or keycard logs directly contradict statements made by {activeSuspect.name} regarding their movements.
            </p>
          </div>
        </div>
      )}

      {/* Grid details: Motive & Alibi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 rounded-lg space-y-1" style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)' }}>
          <p className="font-mono font-semibold uppercase tracking-widest text-[10px]" style={{ color: 'var(--color-amber)' }}>
            🎯 Surface Motive
          </p>
          <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {activeSuspect.motive || 'No explicit motive recorded yet.'}
          </p>
        </div>

        <div className="p-3.5 rounded-lg space-y-1" style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)' }}>
          <p className="font-mono font-semibold uppercase tracking-widest text-[10px]" style={{ color: 'var(--color-amber)' }}>
            🕰 Stated Alibi
          </p>
          <p className="italic leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {activeSuspect.alibi || 'No alibi statement logged.'}
          </p>
        </div>
      </div>

      {/* Background & Initial Statement */}
      <div className="p-3.5 rounded-lg space-y-2" style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)' }}>
        <div>
          <p className="font-mono font-semibold uppercase tracking-widest text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
            Background Dossier
          </p>
          <p className="text-xs leading-relaxed mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
            {activeSuspect.description}
          </p>
        </div>
        {activeSuspect.initialStatement && (
          <div className="pt-2 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <p className="font-mono font-semibold uppercase tracking-widest text-[10px]" style={{ color: 'var(--color-amber)' }}>
              Initial Statement
            </p>
            <p className="text-xs italic leading-relaxed mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
              &ldquo;{activeSuspect.initialStatement}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Transcript & Questions */}
      {activeSuspect.interviewTranscript.length > 0 && (
        <div className="space-y-2">
          <p className="font-mono font-semibold uppercase tracking-widest text-[10px]" style={{ color: 'var(--color-amber)' }}>
            💬 Interview History Transcript ({activeSuspect.interviewTranscript.length})
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {activeSuspect.interviewTranscript.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg text-xs space-y-1"
                style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)' }}
              >
                <p className="font-semibold" style={{ color: 'var(--color-amber)' }}>Q: {item.question}</p>
                <p className="italic" style={{ color: 'var(--color-text-secondary)' }}>&ldquo;{item.response}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unlocked Interrogation Questions */}
      {activeSuspect.availableQuestions.length > 0 && (
        <div className="space-y-2">
          <p className="font-mono font-semibold uppercase tracking-widest text-[10px]" style={{ color: 'var(--color-amber)' }}>
            ⚡ Interrogate Suspect (Triggers WebMCP Tool)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeSuspect.availableQuestions.map((q) => {
              if (q.isAsked) {
                return (
                  <div
                    key={q.questionId}
                    className="p-2.5 rounded text-xs opacity-50 flex items-center justify-between"
                    style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)' }}
                  >
                    <span>✓ {q.questionText}</span>
                    <span className="text-[10px]">Asked</span>
                  </div>
                );
              }
              if (!q.isAvailable) {
                return (
                  <div
                    key={q.questionId}
                    className="p-2.5 rounded text-xs opacity-60 flex items-center justify-between"
                    style={{ background: 'var(--color-surface-1)', border: '1px border-dashed var(--color-border-subtle)' }}
                  >
                    <span>🔒 {q.questionText}</span>
                    <span className="text-[10px] italic">Locked</span>
                  </div>
                );
              }
              return (
                <button
                  key={q.questionId}
                  disabled={isInterrogating}
                  onClick={() => handleQuestionClick(q.questionId)}
                  className="p-2.5 rounded text-xs text-left cursor-pointer transition-all hover:border-amber-400 flex items-center justify-between group"
                  style={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border)' }}
                >
                  <span className="font-medium">💬 {q.questionText}</span>
                  <span style={{ color: 'var(--color-amber)' }} className="text-[10px] shrink-0 group-hover:translate-x-0.5 transition-transform">
                    {isInterrogating ? 'Asking...' : 'Ask →'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Relevant Investigative Leads */}
      {relevantLeads.length > 0 && (
        <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <p className="font-mono font-semibold uppercase tracking-widest text-[10px]" style={{ color: 'var(--color-amber)' }}>
            🔎 Relevant Investigative Leads ({relevantLeads.length})
          </p>
          <div className="space-y-1.5">
            {relevantLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-2.5 rounded text-xs flex items-center justify-between gap-2"
                style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)' }}
              >
                <div>
                  <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{lead.title}</p>
                  <p className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>{lead.description}</p>
                </div>
                <Badge variant="muted">{lead.sourceTool}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

export function SuspectsView() {
  const activeCase = useGameStore((s) => s.activeCase);
  const interviewedSuspectIds = useGameStore((s) => s.interviewedSuspectIds);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);
  const interviews = useGameStore((s) => s.interviews);
  const activeSuspect = useGameStore((s) => s.activeSuspect);

  const [selectedId, setSelectedId] = useState<SuspectId | null>(null);
  const [isLoadingSuspect, setIsLoadingSuspect] = useState(false);
  const [suspectError, setSuspectError] = useState<string | null>(null);

  const handleSelectSuspect = async (suspectId: string) => {
    setIsLoadingSuspect(true);
    setSuspectError(null);
    try {
      const res = await executeWebMCPTool('get_suspect_profile', { suspect_id: suspectId });
      if (!res || res.success === false) {
        setSuspectError(res?.error || 'Unable to load suspect profile.');
      }
    } catch (err: any) {
      setSuspectError(err?.message || 'Unable to load suspect profile.');
    } finally {
      setIsLoadingSuspect(false);
    }
  };

  return (
    <div className="p-6 md:p-8 animate-fade-in space-y-6">
      {/* Modal fallback for manual interview */}
      {selectedId && (
        <SuspectModal
          suspectId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}

      {/* Header */}
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
          {activeCase.suspects.length} suspects connected to victim.{' '}
          <span style={{ color: 'var(--color-text-muted)' }}>
            {interviewedSuspectIds.size} interviewed. Click any suspect to fetch full dossier via WebMCP.
          </span>
        </p>
      </div>

      {/* Loading state */}
      {isLoadingSuspect && (
        <div
          className="card p-6 text-center animate-pulse flex items-center justify-center gap-3"
          style={{ borderColor: 'var(--color-amber-dim)', background: 'var(--color-surface-2)' }}
        >
          <span className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
          <span className="text-sm font-mono font-medium" style={{ color: 'var(--color-amber)' }}>
            Loading suspect profile...
          </span>
        </div>
      )}

      {/* Error state */}
      {suspectError && (
        <div
          className="card p-5 space-y-2"
          style={{ borderColor: 'oklch(52% 0.22 18 / 0.4)', background: 'oklch(52% 0.22 18 / 0.08)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-crimson">
              ⚠️ Unable to load suspect profile.
            </span>
            <button
              onClick={() => setSuspectError(null)}
              className="text-xs underline cursor-pointer"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Dismiss
            </button>
          </div>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {suspectError}
          </p>
        </div>
      )}

      {/* Active Suspect Profile View (WebMCP Synced) */}
      <ActiveSuspectSection />

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeCase.suspects.map((suspect) => {
          const isInterviewed = interviewedSuspectIds.has(suspect.id);
          const isActive = activeSuspect?.id === suspect.id;
          const knownInfo = getKnownSuspectInfo(
            activeCase,
            suspect.id,
            discoveredEvidenceIds,
            interviewedSuspectIds,
            interviews,
          );

          const hasContradiction = knownInfo?.hasContradiction;
          const linkedEvidenceCount = knownInfo?.linkedEvidenceIds.length ?? 0;
          const questionsCount = knownInfo?.questionCount ?? 0;

          return (
            <button
              key={suspect.id}
              id={`suspect-${suspect.id}`}
              className="card card-interactive text-left p-5 flex flex-col justify-between group cursor-pointer"
              onClick={() => handleSelectSuspect(suspect.id)}
              style={
                isActive
                  ? { borderColor: 'var(--color-amber)', background: 'oklch(75% 0.18 75 / 0.05)' }
                  : hasContradiction
                  ? { borderColor: 'oklch(52% 0.22 18 / 0.4)' }
                  : isInterviewed
                  ? { borderColor: 'oklch(75% 0.18 75 / 0.3)' }
                  : {}
              }
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 font-bold transition-transform duration-200 group-hover:scale-105"
                      style={{
                        background: isInterviewed ? 'oklch(75% 0.18 75 / 0.12)' : 'var(--color-surface-3)',
                        color: isInterviewed ? 'var(--color-amber)' : 'var(--color-text-muted)',
                        border: isInterviewed
                          ? '1px solid oklch(75% 0.18 75 / 0.3)'
                          : '1px solid var(--color-border)',
                      }}
                    >
                      {suspect.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold" style={{ fontFamily: 'var(--font-playfair)' }}>
                        {suspect.name}
                      </h3>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {suspect.occupation}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {hasContradiction && <Badge variant="crimson">⚡ Contradiction</Badge>}
                    {isInterviewed ? (
                      <Badge variant="amber">{questionsCount} Answers</Badge>
                    ) : (
                      <Badge variant="muted">Unquestioned</Badge>
                    )}
                  </div>
                </div>

                <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                  {suspect.description}
                </p>

                <p className="text-xs italic line-clamp-1" style={{ color: 'var(--color-text-muted)' }}>
                  Alibi: {suspect.alibi}
                </p>
              </div>

              <div className="pt-3 mt-4 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--color-border-subtle)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>
                  {linkedEvidenceCount > 0 ? `📄 ${linkedEvidenceCount} linked clues` : 'No evidence linked yet'}
                </span>
                <span style={{ color: 'var(--color-amber-dim)' }} className="group-hover:translate-x-1 transition-transform">
                  {isActive ? 'View Loaded Dossier ↑' : 'Fetch WebMCP Dossier →'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}


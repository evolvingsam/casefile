'use client';

import { useState } from 'react';
import { useGameStore } from '@/game/state/store';
import type { CertaintyLevel } from '@/game/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StructuredFindingsWidget } from '@/components/game/StructuredFindingsWidget';

export function DeductionView() {
  const activeCase = useGameStore((s) => s.activeCase);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);
  const interviewedSuspectIds = useGameStore((s) => s.interviewedSuspectIds);
  const connections = useGameStore((s) => s.connections);
  const hypotheses = useGameStore((s) => s.hypotheses);
  const contradictionFlags = useGameStore((s) => s.contradictionFlags);
  const addHypothesis = useGameStore((s) => s.addHypothesis);
  const deleteHypothesis = useGameStore((s) => s.deleteHypothesis);
  const addContradictionFlag = useGameStore((s) => s.addContradictionFlag);
  const deleteContradictionFlag = useGameStore((s) => s.deleteContradictionFlag);
  const addConnection = useGameStore((s) => s.addConnection);
  const removeConnection = useGameStore((s) => s.removeConnection);

  const [activeTab, setActiveTab] = useState<'hypotheses' | 'contradictions' | 'connections'>('hypotheses');
  const [showHypothesisModal, setShowHypothesisModal] = useState(false);
  const [showContradictionModal, setShowContradictionModal] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);

  // New Hypothesis Form State
  const [hypTitle, setHypTitle] = useState('');
  const [hypStatement, setHypStatement] = useState('');
  const [hypCertainty, setHypCertainty] = useState<CertaintyLevel>('Possible');
  const [hypSuspectId, setHypSuspectId] = useState<string>('');
  const [hypTimelineId, setHypTimelineId] = useState<string>('');
  const [hypEvidenceIds, setHypEvidenceIds] = useState<string[]>([]);

  // New Contradiction Form State
  const [conTitle, setConTitle] = useState('');
  const [conDescription, setConDescription] = useState('');
  const [conSuspectId, setConSuspectId] = useState<string>('');
  const [conTimelineId, setConTimelineId] = useState<string>('');
  const [conEvidenceIds, setConEvidenceIds] = useState<string[]>([]);

  // New Connection Form State
  const [connFromId, setConnFromId] = useState<string>('');
  const [connToId, setConnToId] = useState<string>('');
  const [connLabel, setConnLabel] = useState<string>('');

  const discoveredEvidence = activeCase.evidence.filter((e) => discoveredEvidenceIds.has(e.id));
  const knownSuspects = activeCase.suspects;

  const handleCreateHypothesis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hypTitle.trim() || !hypStatement.trim()) return;

    addHypothesis({
      title: hypTitle.trim(),
      statement: hypStatement.trim(),
      certainty: hypCertainty,
      associatedSuspectId: hypSuspectId || undefined,
      associatedTimelineEventId: hypTimelineId || undefined,
      linkedEvidenceIds: hypEvidenceIds,
    });

    setHypTitle('');
    setHypStatement('');
    setHypCertainty('Possible');
    setHypSuspectId('');
    setHypTimelineId('');
    setHypEvidenceIds([]);
    setShowHypothesisModal(false);
  };

  const handleCreateContradiction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conTitle.trim() || !conDescription.trim()) return;

    addContradictionFlag({
      title: conTitle.trim(),
      description: conDescription.trim(),
      suspectId: conSuspectId || undefined,
      timelineEventId: conTimelineId || undefined,
      evidenceIds: conEvidenceIds,
    });

    setConTitle('');
    setConDescription('');
    setConSuspectId('');
    setConTimelineId('');
    setConEvidenceIds([]);
    setShowContradictionModal(false);
  };

  const handleCreateConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connFromId || !connToId || connFromId === connToId) return;

    addConnection(connFromId, 'evidence', connToId, 'evidence', connLabel.trim() || 'Deductive Link', 'human');
    setConnFromId('');
    setConnToId('');
    setConnLabel('');
    setShowConnectionModal(false);
  };

  const toggleEvidenceLink = (eid: string, currentList: string[], setList: (val: string[]) => void) => {
    if (currentList.includes(eid)) {
      setList(currentList.filter((id) => id !== eid));
    } else {
      setList([...currentList, eid]);
    }
  };

  // Certainty Badge Variant Map
  const certaintyBadgeVariant = (certainty: CertaintyLevel): 'amber' | 'crimson' | 'muted' => {
    switch (certainty) {
      case 'Confirmed':
      case 'Probable':
        return 'amber';
      case 'Speculative':
        return 'crimson';
      default:
        return 'muted';
    }
  };

  // Calculate Reasoning Pipeline Progress
  const observationCount = discoveredEvidenceIds.size;
  const connectionCount = connections.length;
  const hypothesisCount = hypotheses.length;
  const corroborationCount = hypotheses.filter((h) => h.linkedEvidenceIds.length >= 2).length;
  const contradictionCount = contradictionFlags.length;

  return (
    <div className="p-6 md:p-8 animate-fade-in space-y-6 max-w-7xl mx-auto">
      {/* Header & Subtitle */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--color-amber)' }}>
            🧠 HUMAN DEDUCTION WORKSPACE
          </span>
          <div className="h-px flex-1" style={{ background: 'var(--color-border-subtle)' }} />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
              Detective Deduction Ladder
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Organize observations, connect clues, evaluate contradictions, and formulate your personal theory before making an accusation.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="primary" size="sm" onClick={() => setShowHypothesisModal(true)}>
              + Form Hypothesis
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowContradictionModal(true)}>
              ⚡ Flag Contradiction
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowConnectionModal(true)}>
              🔗 Link Evidence
            </Button>
          </div>
        </div>
      </div>

      {/* WebMCP Structured Contradictions & Leads Widget */}
      <StructuredFindingsWidget />

      {/* Progressive Reasoning Pipeline Banner */}
      <div
        className="p-4 rounded-xl border grid grid-cols-2 md:grid-cols-6 gap-3 text-center"
        style={{
          background: 'var(--color-surface-1)',
          borderColor: 'var(--color-border-subtle)',
        }}
      >
        <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1">1. Observations</div>
          <div className="text-xl font-bold text-amber-400 font-mono">{observationCount}</div>
          <div className="text-[11px] text-muted">Clues Discovered</div>
        </div>

        <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1">2. Connections</div>
          <div className="text-xl font-bold text-sky-400 font-mono">{connectionCount}</div>
          <div className="text-[11px] text-muted">Clue Pairings</div>
        </div>

        <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1">3. Hypotheses</div>
          <div className="text-xl font-bold text-indigo-400 font-mono">{hypothesisCount}</div>
          <div className="text-[11px] text-muted">Theories Formed</div>
        </div>

        <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1">4. Corroborations</div>
          <div className="text-xl font-bold text-emerald-400 font-mono">{corroborationCount}</div>
          <div className="text-[11px] text-muted">Multi-Evidence Links</div>
        </div>

        <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1">5. Contradictions</div>
          <div className="text-xl font-bold text-rose-400 font-mono">{contradictionCount}</div>
          <div className="text-[11px] text-muted">Statement Conflicts</div>
        </div>

        <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02] flex flex-col justify-center items-center">
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1">6. Theory Stage</div>
          <Badge
            variant={
              hypothesisCount >= 2 && contradictionCount >= 1 ? 'amber' : hypothesisCount >= 1 ? 'muted' : 'crimson'
            }
          >
            {hypothesisCount >= 2 && contradictionCount >= 1 ? 'Theory Ready' : hypothesisCount >= 1 ? 'Formulating' : 'Gathering Clues'}
          </Badge>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <button
          onClick={() => setActiveTab('hypotheses')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'hypotheses' ? 'border-amber-400 text-amber-400' : 'border-transparent text-muted hover:text-white'
          }`}
        >
          Hypotheses ({hypotheses.length})
        </button>
        <button
          onClick={() => setActiveTab('contradictions')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'contradictions' ? 'border-rose-400 text-rose-400' : 'border-transparent text-muted hover:text-white'
          }`}
        >
          Flagged Contradictions ({contradictionFlags.length})
        </button>
        <button
          onClick={() => setActiveTab('connections')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'connections' ? 'border-sky-400 text-sky-400' : 'border-transparent text-muted hover:text-white'
          }`}
        >
          Evidence Connections ({connections.length})
        </button>
      </div>

      {/* TAB 1: HYPOTHESES */}
      {activeTab === 'hypotheses' && (
        <div className="space-y-4">
          {hypotheses.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed text-center space-y-3" style={{ borderColor: 'var(--color-border-subtle)' }}>
              <div className="text-3xl">💡</div>
              <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-playfair)' }}>
                No Hypotheses Formulated Yet
              </h3>
              <p className="text-xs max-w-md mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
                Combine discovered physical evidence, timeline logs, and suspect alibis to build custom hypotheses.
              </p>
              <Button variant="primary" size="sm" onClick={() => setShowHypothesisModal(true)}>
                + Form First Hypothesis
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hypotheses.map((hyp) => {
                const suspect = activeCase.suspects.find((s) => s.id === hyp.associatedSuspectId);
                const timelineEv = activeCase.timeline.find((t) => t.id === hyp.associatedTimelineEventId);
                const linkedEvs = activeCase.evidence.filter((e) => hyp.linkedEvidenceIds.includes(e.id));

                return (
                  <div
                    key={hyp.id}
                    className="p-5 rounded-xl border flex flex-col justify-between space-y-4 transition-all hover:border-amber-500/40"
                    style={{
                      background: 'var(--color-surface-1)',
                      borderColor: 'var(--color-border-subtle)',
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="font-bold text-base text-amber-200">{hyp.title}</h3>
                        <Badge variant={certaintyBadgeVariant(hyp.certainty)}>{hyp.certainty}</Badge>
                      </div>

                      <p className="text-xs leading-relaxed mb-4 text-slate-300 bg-black/20 p-3 rounded-lg border border-white/5">
                        "{hyp.statement}"
                      </p>

                      {/* Associated Suspect & Timeline */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {suspect && (
                          <span className="text-[11px] px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono flex items-center gap-1">
                            👤 Suspect: {suspect.name}
                          </span>
                        )}
                        {timelineEv && (
                          <span className="text-[11px] px-2 py-1 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300 font-mono flex items-center gap-1">
                            ◷ Event: {timelineEv.time} — {timelineEv.description.slice(0, 30)}...
                          </span>
                        )}
                      </div>

                      {/* Linked Evidence */}
                      {linkedEvs.length > 0 && (
                        <div>
                          <div className="text-[10px] font-mono uppercase text-muted mb-1.5">Linked Supporting Clues:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {linkedEvs.map((ev) => (
                              <span
                                key={ev.id}
                                className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono"
                              >
                                🔍 {ev.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <span className="text-[10px] font-mono text-muted">
                        Created {new Date(hyp.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button
                        onClick={() => deleteHypothesis(hyp.id)}
                        className="text-xs text-rose-400 hover:text-rose-300 font-mono"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CONTRADICTIONS */}
      {activeTab === 'contradictions' && (
        <div className="space-y-4">
          {contradictionFlags.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed text-center space-y-3" style={{ borderColor: 'var(--color-border-subtle)' }}>
              <div className="text-3xl">⚡</div>
              <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-playfair)' }}>
                No Contradictions Flagged
              </h3>
              <p className="text-xs max-w-md mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
                Compare suspect alibis against keycard logs, CCTV records, or physical evidence to flag contradictions.
              </p>
              <Button variant="secondary" size="sm" onClick={() => setShowContradictionModal(true)}>
                + Flag Contradiction
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contradictionFlags.map((flag) => {
                const suspect = activeCase.suspects.find((s) => s.id === flag.suspectId);
                const timelineEv = activeCase.timeline.find((t) => t.id === flag.timelineEventId);
                const linkedEvs = activeCase.evidence.filter((e) => flag.evidenceIds.includes(e.id));

                return (
                  <div
                    key={flag.id}
                    className="p-5 rounded-xl border border-rose-500/30 bg-rose-950/10 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="font-bold text-base text-rose-300 flex items-center gap-1.5">
                          ⚡ {flag.title}
                        </h3>
                        <Badge variant="crimson">Contradiction</Badge>
                      </div>

                      <p className="text-xs leading-relaxed mb-4 text-slate-300 bg-black/30 p-3 rounded-lg border border-rose-500/20">
                        {flag.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {suspect && (
                          <span className="text-[11px] px-2 py-1 rounded bg-rose-500/20 text-rose-300 font-mono">
                            👤 Conflicting Suspect: {suspect.name}
                          </span>
                        )}
                        {timelineEv && (
                          <span className="text-[11px] px-2 py-1 rounded bg-rose-500/20 text-rose-300 font-mono">
                            ◷ Event: {timelineEv.time}
                          </span>
                        )}
                      </div>

                      {linkedEvs.length > 0 && (
                        <div>
                          <div className="text-[10px] font-mono uppercase text-rose-400 mb-1.5">Conflicting Clues:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {linkedEvs.map((ev) => (
                              <span key={ev.id} className="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                                🔍 {ev.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-rose-500/20">
                      <span className="text-[10px] font-mono text-muted">
                        Flagged {new Date(flag.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button onClick={() => deleteContradictionFlag(flag.id)} className="text-xs text-rose-400 hover:text-rose-300 font-mono">
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EVIDENCE CONNECTIONS */}
      {activeTab === 'connections' && (
        <div className="space-y-4">
          {connections.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed text-center space-y-3" style={{ borderColor: 'var(--color-border-subtle)' }}>
              <div className="text-3xl">🔗</div>
              <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-playfair)' }}>
                No Direct Evidence Links Made
              </h3>
              <p className="text-xs max-w-md mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
                Explicitly link pairs of discovered evidence items to build logical deduction bridges.
              </p>
              <Button variant="ghost" size="sm" onClick={() => setShowConnectionModal(true)}>
                + Create Evidence Link
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connections.map((conn) => {
                const fromEv = activeCase.evidence.find((e) => e.id === conn.fromId) || activeCase.suspects.find((s) => s.id === conn.fromId);
                const toEv = activeCase.evidence.find((e) => e.id === conn.toId) || activeCase.suspects.find((s) => s.id === conn.toId);
                const fromName = fromEv ? fromEv.name : conn.fromId;
                const toName = toEv ? toEv.name : conn.toId;

                return (
                  <div
                    key={conn.id}
                    className="p-4 rounded-xl border bg-white/[0.02] flex items-center justify-between gap-4"
                    style={{ borderColor: 'var(--color-border-subtle)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-sky-500/10 text-sky-400 text-sm">🔗</div>
                      <div>
                        <div className="text-xs font-bold text-sky-300 font-mono">
                          {fromName} ↔ {toName}
                        </div>
                        <div className="text-[11px] text-muted">{conn.label || 'Logical Deduction Connection'}</div>
                      </div>
                    </div>
                    <button onClick={() => removeConnection(conn.id)} className="text-xs text-rose-400 hover:text-rose-300 font-mono">
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* FORM MODAL: NEW HYPOTHESIS */}
      {showHypothesisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-xl p-6 rounded-2xl border space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]"
            style={{ background: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--color-border-subtle)' }}>
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
                Formulate New Hypothesis
              </h2>
              <button onClick={() => setShowHypothesisModal(false)} className="text-muted hover:text-white font-mono">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateHypothesis} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-muted mb-1">Hypothesis Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thermos Flask Substitution During Blackout"
                  value={hypTitle}
                  onChange={(e) => setHypTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted mb-1">Deductive Statement / Reasoning</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain how the discovered clues support this hypothesis without jumping to unproven conclusions..."
                  value={hypStatement}
                  onChange={(e) => setHypStatement(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted mb-1">Certainty Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Speculative', 'Possible', 'Probable', 'Confirmed'] as CertaintyLevel[]).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setHypCertainty(level)}
                      className={`px-2 py-1.5 text-xs font-mono rounded border transition-colors ${
                        hypCertainty === level
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                          : 'border-white/10 bg-black/20 text-muted hover:text-white'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-muted mb-1">Associate Suspect (Optional)</label>
                  <select
                    value={hypSuspectId}
                    onChange={(e) => setHypSuspectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm focus:border-amber-400 outline-none"
                  >
                    <option value="">-- None --</option>
                    {knownSuspects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.title})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted mb-1">Associate Timeline Event (Optional)</label>
                  <select
                    value={hypTimelineId}
                    onChange={(e) => setHypTimelineId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm focus:border-amber-400 outline-none text-ellipsis"
                  >
                    <option value="">-- None --</option>
                    {activeCase.timeline.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.time} — {t.description.slice(0, 30)}...
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted mb-1">Link Supporting Discovered Clues</label>
                <div className="max-h-36 overflow-y-auto space-y-1 p-2 rounded-lg bg-black/40 border border-white/10">
                  {discoveredEvidence.length === 0 ? (
                    <div className="text-xs text-muted p-2">No evidence discovered yet. Search locations first.</div>
                  ) : (
                    discoveredEvidence.map((ev) => (
                      <label key={ev.id} className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer p-1 rounded hover:bg-white/5">
                        <input
                          type="checkbox"
                          checked={hypEvidenceIds.includes(ev.id)}
                          onChange={() => toggleEvidenceLink(ev.id, hypEvidenceIds, setHypEvidenceIds)}
                          className="rounded border-white/20"
                        />
                        <span>🔍 {ev.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowHypothesisModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Hypothesis
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORM MODAL: NEW CONTRADICTION */}
      {showContradictionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-xl p-6 rounded-2xl border space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]"
            style={{ background: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--color-border-subtle)' }}>
              <h2 className="text-xl font-bold text-rose-400" style={{ fontFamily: 'var(--font-playfair)' }}>
                ⚡ Flag Statement Contradiction
              </h2>
              <button onClick={() => setShowContradictionModal(false)} className="text-muted hover:text-white font-mono">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateContradiction} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-muted mb-1">Contradiction Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tunde 7:00 PM Entry Statement vs Keycard Log"
                  value={conTitle}
                  onChange={(e) => setConTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm focus:border-rose-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted mb-1">Contradiction Details</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe why the statement or claim directly conflicts with physical evidence or logs..."
                  value={conDescription}
                  onChange={(e) => setConDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm focus:border-rose-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-muted mb-1">Conflicting Suspect (Optional)</label>
                  <select
                    value={conSuspectId}
                    onChange={(e) => setConSuspectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm focus:border-rose-400 outline-none"
                  >
                    <option value="">-- None --</option>
                    {knownSuspects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted mb-1">Conflicting Timeline Event (Optional)</label>
                  <select
                    value={conTimelineId}
                    onChange={(e) => setConTimelineId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm focus:border-rose-400 outline-none"
                  >
                    <option value="">-- None --</option>
                    {activeCase.timeline.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.time} — {t.description.slice(0, 30)}...
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted mb-1">Link Conflicting Evidence Items</label>
                <div className="max-h-36 overflow-y-auto space-y-1 p-2 rounded-lg bg-black/40 border border-white/10">
                  {discoveredEvidence.length === 0 ? (
                    <div className="text-xs text-muted p-2">No evidence discovered yet.</div>
                  ) : (
                    discoveredEvidence.map((ev) => (
                      <label key={ev.id} className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer p-1 rounded hover:bg-white/5">
                        <input
                          type="checkbox"
                          checked={conEvidenceIds.includes(ev.id)}
                          onChange={() => toggleEvidenceLink(ev.id, conEvidenceIds, setConEvidenceIds)}
                          className="rounded border-white/20"
                        />
                        <span>🔍 {ev.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowContradictionModal(false)}>
                  Cancel
                </Button>
                <Button variant="danger" size="sm" type="submit">
                  Save Contradiction Flag
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORM MODAL: NEW EVIDENCE LINK */}
      {showConnectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-lg p-6 rounded-2xl border space-y-5 shadow-2xl"
            style={{ background: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--color-border-subtle)' }}>
              <h2 className="text-xl font-bold text-sky-400" style={{ fontFamily: 'var(--font-playfair)' }}>
                🔗 Connect Related Evidence
              </h2>
              <button onClick={() => setShowConnectionModal(false)} className="text-muted hover:text-white font-mono">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateConnection} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-muted mb-1">First Evidence Item</label>
                <select
                  required
                  value={connFromId}
                  onChange={(e) => setConnFromId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm focus:border-sky-400 outline-none"
                >
                  <option value="">-- Select First Clue --</option>
                  {discoveredEvidence.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      🔍 {ev.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted mb-1">Second Evidence Item</label>
                <select
                  required
                  value={connToId}
                  onChange={(e) => setConnToId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm focus:border-sky-400 outline-none"
                >
                  <option value="">-- Select Second Clue --</option>
                  {discoveredEvidence.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      🔍 {ev.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted mb-1">Link Note / Relationship Label</label>
                <input
                  type="text"
                  placeholder="e.g. Key Code #V-409 Match"
                  value={connLabel}
                  onChange={(e) => setConnLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm focus:border-sky-400 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowConnectionModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Create Link
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

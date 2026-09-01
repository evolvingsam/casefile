'use client';

import { useState } from 'react';
import { useGameStore } from '@/game/state/store';
import type { SuspectId, EvidenceId } from '@/game/types';
import { getDiscoveredEvidence } from '@/game/logic/investigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function AccusationModal({ onClose }: { onClose: () => void }) {
  const activeCase = useGameStore((s) => s.activeCase);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);
  const hypotheses = useGameStore((s) => s.hypotheses);
  const makeAccusation = useGameStore((s) => s.makeAccusation);

  const [selectedSuspectId, setSelectedSuspectId] = useState<SuspectId>(activeCase.suspects[0].id);
  const [method, setMethod] = useState('');
  const [motive, setMotive] = useState('');
  const [approximateTime, setApproximateTime] = useState('');
  const [explanation, setExplanation] = useState('');
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<Set<EvidenceId>>(new Set());

  const [showConfirmStep, setShowConfirmStep] = useState(false);

  const discovered = getDiscoveredEvidence(activeCase, discoveredEvidenceIds);
  const selectedSuspect = activeCase.suspects.find((s) => s.id === selectedSuspectId);

  const handleImportDeduction = () => {
    if (hypotheses.length === 0) return;
    const latestHyp = hypotheses[hypotheses.length - 1];
    if (latestHyp.title) setMethod(latestHyp.title);
    if (latestHyp.statement) setExplanation(latestHyp.statement);
    if (latestHyp.associatedSuspectId) setSelectedSuspectId(latestHyp.associatedSuspectId);
    if (latestHyp.linkedEvidenceIds.length > 0) {
      setSelectedEvidenceIds(new Set(latestHyp.linkedEvidenceIds));
    }
  };

  const toggleEvidence = (id: EvidenceId) => {
    setSelectedEvidenceIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleFinalSubmit = () => {
    makeAccusation(
      selectedSuspectId,
      method.trim(),
      motive.trim(),
      approximateTime.trim(),
      explanation.trim(),
      Array.from(selectedEvidenceIds),
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: 'oklch(5% 0.01 280 / 0.88)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="card w-full max-w-2xl animate-fade-in overflow-y-auto my-auto shadow-2xl"
        style={{
          background: 'var(--color-surface-1)',
          border: '1px solid var(--color-border)',
          maxHeight: '92dvh',
        }}
      >
        {/* Header */}
        <div
          className="p-5 border-b sticky top-0 z-10 flex items-center justify-between gap-4"
          style={{
            borderColor: 'var(--color-border-subtle)',
            background: 'var(--color-surface-1)',
          }}
        >
          <div>
            <span className="text-xs font-mono tracking-widest uppercase text-rose-400">
              Final Theory Accusation
            </span>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
              Submit Complete Case Theory
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {hypotheses.length > 0 && (
              <button
                onClick={handleImportDeduction}
                className="text-[11px] font-mono px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors"
                title="Pre-fill form from your Deduction Workspace hypotheses"
              >
                🧠 Import from Deductions
              </button>
            )}
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded text-lg text-muted hover:text-white cursor-pointer">
              ✕
            </button>
          </div>
        </div>

        {/* Form Body */}
        {!showConfirmStep ? (
          <div className="p-6 space-y-5">
            {/* Step 1: Select Suspect */}
            <div>
              <label className="text-xs font-mono uppercase tracking-widest block mb-2 font-semibold text-amber-400">
                1. Suspected Perpetrator
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {activeCase.suspects.map((s) => {
                  const isSelected = s.id === selectedSuspectId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={`p-2.5 rounded-lg text-left transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'bg-rose-500/15 border border-rose-500 text-white'
                          : 'bg-black/20 border border-white/10 text-muted hover:text-white'
                      }`}
                      onClick={() => setSelectedSuspectId(s.id)}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${isSelected ? 'bg-rose-500 text-white' : 'bg-white/10 text-muted'}`}>
                        {s.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-xs truncate">{s.name}</p>
                        <p className="text-[10px] opacity-75 truncate">{s.title}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2 & 3: Method & Motive */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono uppercase tracking-widest block mb-1 font-semibold text-amber-400">
                  2. Method & Mechanism
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Substituted spiked thermos during 6:42 PM blackout using duplicate keycard"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full p-2.5 rounded-lg text-xs bg-black/40 border border-white/10 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-widest block mb-1 font-semibold text-amber-400">
                  3. Motive & Driver
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prevent 7:30 PM IP buyback clause to retain £10M buyout equity"
                  value={motive}
                  onChange={(e) => setMotive(e.target.value)}
                  className="w-full p-2.5 rounded-lg text-xs bg-black/40 border border-white/10 text-white outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Step 4: Timeline Window */}
            <div>
              <label className="text-xs font-mono uppercase tracking-widest block mb-1 font-semibold text-amber-400">
                4. Approximate Crime / Opportunity Window
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Between 6:42 PM and 6:48 PM during the CCTV blackout"
                value={approximateTime}
                onChange={(e) => setApproximateTime(e.target.value)}
                className="w-full p-2.5 rounded-lg text-xs bg-black/40 border border-white/10 text-white outline-none focus:border-amber-400"
              />
            </div>

            {/* Step 5: Supporting Evidence Selection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono uppercase tracking-widest font-semibold text-amber-400">
                  5. Supporting Discovered Evidence ({selectedEvidenceIds.size} Selected)
                </label>
                <span className="text-[11px] text-muted">Discovered: {discovered.length} items</span>
              </div>

              {discovered.length === 0 ? (
                <p className="text-xs italic text-muted">No evidence discovered yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {discovered.map((ev) => {
                    const isChecked = selectedEvidenceIds.has(ev.id);
                    return (
                      <button
                        key={ev.id}
                        type="button"
                        className={`p-2 rounded text-xs text-left flex items-center gap-2 transition-all cursor-pointer ${
                          isChecked ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300' : 'bg-black/30 border border-white/10 text-slate-300'
                        }`}
                        onClick={() => toggleEvidence(ev.id)}
                      >
                        <span className="font-mono font-bold text-xs">{isChecked ? '☑' : '☐'}</span>
                        <span className="truncate">{ev.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 6: Detailed Explanation Textarea */}
            <div>
              <label className="text-xs font-mono uppercase tracking-widest block mb-1 font-semibold text-amber-400">
                6. Detailed Deductive Explanation
              </label>
              <textarea
                className="w-full p-3 rounded-lg text-xs leading-relaxed bg-black/40 border border-white/10 text-white outline-none focus:border-amber-400"
                rows={3}
                placeholder="Synthesize the facts: explain how the perpetrator accessed the scene, why other suspects are excluded, and why the physical evidence proves this theory..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <Button variant="ghost" size="sm" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" type="button" onClick={() => setShowConfirmStep(true)}>
                Review Theory &amp; Submit →
              </Button>
            </div>
          </div>
        ) : (
          /* Confirmation Step */
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-300 uppercase tracking-widest font-mono text-[11px]">
                  ⚠️ Theory Evaluation Notice
                </span>
                <Badge variant="crimson">Partial Scoring System</Badge>
              </div>

              <p className="leading-relaxed text-slate-300">
                Your complete theory will be evaluated across 5 dimensions (100 pts total). A score of <strong className="text-amber-300">80 or higher</strong> is required to solve the case. Failed theories output targeted feedback without spoiling the solution, allowing you to revise and retry.
              </p>

              <div className="space-y-1.5 pt-2 border-t border-rose-500/20">
                <p className="text-[11px] font-semibold text-amber-300">Theory Summary for Submission:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>Suspect: <strong className="text-white">{selectedSuspect?.name}</strong></li>
                  <li>Method: <strong className="text-white">{method || '(Not specified)'}</strong></li>
                  <li>Motive: <strong className="text-white">{motive || '(Not specified)'}</strong></li>
                  <li>Timeline: <strong className="text-white">{approximateTime || '(Not specified)'}</strong></li>
                  <li>Supporting Clues Attached: <strong>{selectedEvidenceIds.size} evidence items</strong></li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" className="flex-1" type="button" onClick={() => setShowConfirmStep(false)}>
                ← Edit Theory
              </Button>
              <Button variant="danger" size="sm" className="flex-1" type="button" onClick={handleFinalSubmit}>
                ⚖️ EVALUATE THEORY NOW
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

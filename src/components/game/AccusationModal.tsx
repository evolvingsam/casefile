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
  const makeAccusation = useGameStore((s) => s.makeAccusation);

  const [selectedSuspectId, setSelectedSuspectId] = useState<SuspectId>(
    activeCase.suspects[0].id,
  );
  const [reasoning, setReasoning] = useState('');
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<Set<EvidenceId>>(
    new Set(),
  );

  const [showConfirmStep, setShowConfirmStep] = useState(false);

  const discovered = getDiscoveredEvidence(activeCase, discoveredEvidenceIds);
  const selectedSuspect = activeCase.suspects.find((s) => s.id === selectedSuspectId);

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
      reasoning.trim(),
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
        className="card w-full max-w-2xl animate-fade-in overflow-y-auto my-auto"
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
            <span
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: 'var(--color-crimson)' }}
            >
              Final Accusation Proceeding
            </span>
            <h2
              className="text-2xl font-bold"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Accuse Suspect
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded text-lg transition-colors cursor-pointer"
            style={{ color: 'var(--color-text-muted)' }}
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        {!showConfirmStep ? (
          <div className="p-6 space-y-6">
            {/* Step 1: Select Suspect */}
            <div>
              <label
                className="text-xs font-mono uppercase tracking-widest block mb-2 font-semibold"
                style={{ color: 'var(--color-amber)' }}
              >
                1. Select Accused Suspect
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {activeCase.suspects.map((s) => {
                  const isSelected = s.id === selectedSuspectId;
                  return (
                    <button
                      key={s.id}
                      className="p-3 rounded-lg text-left transition-all cursor-pointer flex items-center gap-2.5"
                      style={{
                        background: isSelected ? 'oklch(52% 0.22 18 / 0.12)' : 'var(--color-surface-2)',
                        border: isSelected
                          ? '1px solid var(--color-crimson)'
                          : '1px solid var(--color-border-subtle)',
                      }}
                      onClick={() => setSelectedSuspectId(s.id)}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                        style={{
                          background: isSelected ? 'var(--color-crimson)' : 'var(--color-surface-3)',
                          color: '#fff',
                        }}
                      >
                        {s.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-xs truncate">{s.name}</p>
                        <p className="text-[10px] text-muted truncate">{s.title}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Supporting Evidence */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="text-xs font-mono uppercase tracking-widest font-semibold"
                  style={{ color: 'var(--color-amber)' }}
                >
                  2. Select Supporting Evidence ({selectedEvidenceIds.size} Selected)
                </label>
                <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                  Discovered: {discovered.length} items
                </span>
              </div>

              {discovered.length === 0 ? (
                <p className="text-xs italic" style={{ color: 'var(--color-text-muted)' }}>
                  No evidence discovered yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {discovered.map((ev) => {
                    const isChecked = selectedEvidenceIds.has(ev.id);
                    return (
                      <button
                        key={ev.id}
                        className="p-2.5 rounded-md text-xs text-left flex items-center gap-2 transition-all cursor-pointer"
                        style={{
                          background: isChecked ? 'oklch(75% 0.18 75 / 0.1)' : 'var(--color-surface-2)',
                          border: isChecked
                            ? '1px solid var(--color-amber)'
                            : '1px solid var(--color-border-subtle)',
                          color: isChecked ? 'var(--color-amber)' : 'var(--color-text-secondary)',
                        }}
                        onClick={() => toggleEvidence(ev.id)}
                      >
                        <span className="font-mono font-bold text-xs">
                          {isChecked ? '☑' : '☐'}
                        </span>
                        <span className="truncate">{ev.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 3: Reasoning Textarea */}
            <div>
              <label
                className="text-xs font-mono uppercase tracking-widest block mb-1.5 font-semibold"
                style={{ color: 'var(--color-amber)' }}
              >
                3. State Your Investigative Deduction &amp; Reasoning
              </label>
              <textarea
                className="w-full p-3 rounded-lg text-xs leading-relaxed"
                style={{
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                }}
                rows={4}
                placeholder="Explain why this suspect is the killer. Reference key evidence, timing, motive, and how they committed the crime..."
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowConfirmStep(true)}
              >
                Review &amp; Proceed →
              </Button>
            </div>
          </div>
        ) : (
          /* Confirmation Step */
          <div className="p-6 space-y-5">
            <div
              className="p-4 rounded-lg text-xs space-y-3"
              style={{
                background: 'oklch(52% 0.22 18 / 0.1)',
                border: '1px solid oklch(52% 0.22 18 / 0.3)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-400 uppercase tracking-widest font-mono text-[11px]">
                  ⚠️ Final Confirmation Required
                </span>
                <Badge variant="crimson">Irreversible Action</Badge>
              </div>

              <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                You are about to issue a formal murder charge against{' '}
                <strong style={{ color: '#fff' }}>{selectedSuspect?.name}</strong>.
              </p>

              <div className="space-y-1.5 pt-2 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
                <p className="text-[11px] font-semibold" style={{ color: 'var(--color-amber)' }}>
                  Submitted Accusation Summary:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted">
                  <li>Accused: <strong className="text-white">{selectedSuspect?.name}</strong> ({selectedSuspect?.title})</li>
                  <li>Supporting Clues Attached: <strong>{selectedEvidenceIds.size} evidence items</strong></li>
                  <li>Reasoning Length: <strong>{reasoning.trim().length} characters</strong></li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => setShowConfirmStep(false)}>
                ← Edit Accusation
              </Button>
              <Button variant="danger" size="sm" className="flex-1" onClick={handleFinalSubmit}>
                ⚖️ SUBMIT FINAL ACCUSATION
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

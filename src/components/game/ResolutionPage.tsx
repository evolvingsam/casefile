'use client';

import { useGameStore } from '@/game/state/store';
import { getAgentRecommendation } from '@/game/logic/investigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function ResolutionPage() {
  const setPhase = useGameStore((s) => s.setPhase);
  const accusation = useGameStore((s) => s.accusation);
  const activeCase = useGameStore((s) => s.activeCase);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);
  const inspectedEvidenceIds = useGameStore((s) => s.inspectedEvidenceIds);
  const interviewedSuspectIds = useGameStore((s) => s.interviewedSuspectIds);
  const resetInvestigation = useGameStore((s) => s.resetInvestigation);

  const solution = activeCase.solution;
  const accused = activeCase.suspects.find((s) => s.id === accusation);
  const killer = activeCase.suspects.find((s) => s.id === solution.killerId);
  const isCorrect = accusation === solution.killerId;

  const agentRec = getAgentRecommendation(
    activeCase,
    discoveredEvidenceIds,
    inspectedEvidenceIds,
    interviewedSuspectIds,
  );

  const agentAgreed = agentRec.suspectId === accusation;

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-16 relative"
      style={{ background: 'var(--color-void)' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isCorrect
            ? 'radial-gradient(ellipse 60% 50% at 50% 30%, oklch(75% 0.18 75 / 0.08) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 60% 50% at 50% 30%, oklch(52% 0.22 18 / 0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-2xl animate-fade-in space-y-6">
        {/* Outcome Banner */}
        <div className="text-center space-y-2">
          <div className="text-6xl mb-2">{isCorrect ? '⚖️' : '❌'}</div>

          <Badge variant={isCorrect ? 'amber' : 'crimson'}>
            {isCorrect ? 'CASE SOLVED — CONVICTION CONFIRMED' : 'CASE UNRESOLVED — INSUFFICIENT PROOF'}
          </Badge>

          <h1
            className="text-4xl font-bold"
            style={{
              fontFamily: 'var(--font-playfair)',
              color: isCorrect ? 'var(--color-amber)' : 'var(--color-crimson)',
            }}
          >
            {isCorrect ? 'Justice Delivered' : 'Mistrial'}
          </h1>

          <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            {isCorrect
              ? `Your accusation against ${accused?.name} was corroborated by physical evidence and verified beyond reasonable doubt.`
              : `You accused ${accused?.name ?? 'a suspect'}, but the evidence was insufficient or points elsewhere.`}
          </p>
        </div>

        {/* Human + Agent Alignment Box */}
        <div
          className="card p-5 space-y-3"
          style={{
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          <p className="text-xs font-mono uppercase tracking-widest font-semibold" style={{ color: 'var(--color-amber)' }}>
            🤝 Human-Agent Collaboration Summary
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface-3)' }}>
              <span className="text-[10px] uppercase font-mono block mb-1" style={{ color: 'var(--color-text-muted)' }}>
                👤 Your Accusation (Human)
              </span>
              <p className="font-bold text-sm">{accused?.name ?? 'None'}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface-3)' }}>
              <span className="text-[10px] uppercase font-mono block mb-1" style={{ color: 'var(--color-text-muted)' }}>
                🤖 AI Agent Recommendation
              </span>
              <p className="font-bold text-sm flex items-center justify-between">
                <span>{agentRec.suspectName}</span>
                <span className="text-[10px] text-amber-400">({agentRec.confidence})</span>
              </p>
            </div>
          </div>
          <p className="text-xs italic" style={{ color: 'var(--color-text-muted)' }}>
            {agentAgreed
              ? '✓ Human detective and AI co-investigator were in 100% agreement on the prime suspect.'
              : '⚠️ Human detective and AI co-investigator favored different suspects during investigation.'}
          </p>
        </div>

        {/* Official Case Solution Card */}
        <div className="card p-6 space-y-4">
          <div className="border-b pb-3" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--color-crimson)' }}>
              Official Police &amp; Forensics Case File
            </span>
            <h3 className="text-xl font-bold mt-1" style={{ fontFamily: 'var(--font-playfair)' }}>
              The Truth of Case {activeCase.caseNumber}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono text-muted block mb-0.5">True Killer</span>
              <span className="font-semibold text-sm text-amber-400">{killer?.name}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-muted block mb-0.5">Method</span>
              <span className="font-semibold">{solution.method}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-muted block mb-0.5">Opportunity</span>
              <span className="font-semibold">{solution.opportunity}</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
              Full Narrative Explanation
            </p>
            <p className="text-xs leading-relaxed text-secondary" style={{ color: 'var(--color-text-secondary)' }}>
              {solution.fullExplanation}
            </p>
          </div>

          {/* Key Evidence Breakdown */}
          <div>
            <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
              Key Evidence Required for Conviction
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {solution.keyEvidenceIds.map((eid) => {
                const ev = activeCase.evidence.find((e) => e.id === eid);
                const isFound = discoveredEvidenceIds.has(eid);

                return (
                  <div
                    key={eid}
                    className="p-2.5 rounded flex items-center justify-between"
                    style={{
                      background: isFound ? 'oklch(75% 0.18 75 / 0.1)' : 'var(--color-surface-3)',
                      border: isFound ? '1px solid oklch(75% 0.18 75 / 0.25)' : '1px solid var(--color-border-subtle)',
                    }}
                  >
                    <span style={{ color: isFound ? 'var(--color-amber)' : 'var(--color-text-muted)' }}>
                      {isFound ? '✓' : '🔒'} {ev?.name ?? eid}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                      {isFound ? 'Found' : 'Missed'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="secondary"
            onClick={() => setPhase('investigation')}
          >
            ← Review Investigation Workspace
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              resetInvestigation();
              setPhase('landing');
            }}
          >
            Play Again / Replay Case
          </Button>
        </div>
      </div>
    </div>
  );
}

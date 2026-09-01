'use client';

import { useGameStore } from '@/game/state/store';
import { getInvestigationProgress } from '@/game/logic/investigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

function formatDuration(startTime: number, endTime: number): string {
  const diffMs = Math.max(0, endTime - startTime);
  const totalSeconds = Math.floor(diffMs / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
}

export function ResolutionPage() {
  const setPhase = useGameStore((s) => s.setPhase);
  const activeCase = useGameStore((s) => s.activeCase);
  const accusationSubmission = useGameStore((s) => s.accusationSubmission);
  const evaluation = useGameStore((s) => s.accusationEvaluation);
  const startTime = useGameStore((s) => s.startTime);
  const visitedLocationIds = useGameStore((s) => s.visitedLocationIds);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);
  const inspectedEvidenceIds = useGameStore((s) => s.inspectedEvidenceIds);
  const interviewedSuspectIds = useGameStore((s) => s.interviewedSuspectIds);
  const agentActions = useGameStore((s) => s.agentActions);
  const investigationLog = useGameStore((s) => s.investigationLog);
  const resetInvestigation = useGameStore((s) => s.resetInvestigation);

  const isPassed = evaluation?.passedThreshold ?? false;
  const totalScore = evaluation?.totalScore ?? 0;
  const durationStr = formatDuration(startTime, accusationSubmission?.submittedAt ?? Date.now());

  const progress = getInvestigationProgress(
    activeCase,
    visitedLocationIds,
    discoveredEvidenceIds,
    inspectedEvidenceIds,
    interviewedSuspectIds,
  );

  const humanEventsCount = investigationLog.filter((e) => e.actor === 'human').length;
  const agentEventsCount = investigationLog.filter((e) => e.actor === 'agent').length;

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-10 relative overflow-y-auto"
      style={{ background: 'var(--color-void)' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isPassed
            ? 'radial-gradient(ellipse 60% 50% at 50% 30%, oklch(75% 0.18 75 / 0.08) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 60% 50% at 50% 30%, oklch(52% 0.22 18 / 0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-4xl animate-fade-in space-y-6 my-auto">
        {/* Banner */}
        <div className="text-center space-y-2">
          <div className="text-6xl mb-2">{isPassed ? '🏆' : '🔍'}</div>

          <Badge variant={isPassed ? 'amber' : 'crimson'}>
            {isPassed ? `CASE SOLVED — THEORY SCORE ${totalScore}/100` : `INCOMPLETE THEORY — SCORE ${totalScore}/100`}
          </Badge>

          <h1
            className="text-4xl font-bold"
            style={{
              fontFamily: 'var(--font-playfair)',
              color: isPassed ? 'var(--color-amber)' : 'var(--color-crimson)',
            }}
          >
            {isPassed ? `Case ${activeCase.caseNumber} Closed` : 'Theory Requires Revision'}
          </h1>

          <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {isPassed
              ? 'Congratulations! Your complete theory met the passing threshold (>= 80 points) and matched key physical evidence and timeline events.'
              : 'Your submitted theory was evaluated across 5 reasoning dimensions. Review the targeted feedback below, gather remaining evidence, and revise your theory.'}
          </p>
        </div>

        {/* Partial Score Breakdown Grid */}
        {evaluation && (
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--color-border-subtle)' }}>
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono" style={{ color: 'var(--color-amber)' }}>
                📊 Multi-Element Theory Score Breakdown
              </h3>
              <span className="text-sm font-bold font-mono text-amber-300">{totalScore}/100 Points</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="text-[10px] font-mono uppercase text-muted mb-1">Perpetrator</div>
                <div className={`text-lg font-bold font-mono ${evaluation.perpetratorScore === 30 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {evaluation.perpetratorScore}/30
                </div>
                <div className="text-[10px] text-muted">{evaluation.elementBreakdown.perpetratorCorrect ? 'Correct' : 'Incorrect'}</div>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="text-[10px] font-mono uppercase text-muted mb-1">Method</div>
                <div className={`text-lg font-bold font-mono ${evaluation.methodScore === 20 ? 'text-emerald-400' : evaluation.methodScore === 10 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {evaluation.methodScore}/20
                </div>
                <div className="text-[10px] text-muted">{evaluation.elementBreakdown.methodRating}</div>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="text-[10px] font-mono uppercase text-muted mb-1">Motive</div>
                <div className={`text-lg font-bold font-mono ${evaluation.motiveScore === 20 ? 'text-emerald-400' : evaluation.motiveScore === 10 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {evaluation.motiveScore}/20
                </div>
                <div className="text-[10px] text-muted">{evaluation.elementBreakdown.motiveRating}</div>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="text-[10px] font-mono uppercase text-muted mb-1">Timeline</div>
                <div className={`text-lg font-bold font-mono ${evaluation.timelineScore === 15 ? 'text-emerald-400' : evaluation.timelineScore === 8 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {evaluation.timelineScore}/15
                </div>
                <div className="text-[10px] text-muted">{evaluation.elementBreakdown.timelineRating}</div>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="text-[10px] font-mono uppercase text-muted mb-1">Evidence</div>
                <div className={`text-lg font-bold font-mono ${evaluation.evidenceScore >= 12 ? 'text-emerald-400' : evaluation.evidenceScore >= 6 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {evaluation.evidenceScore}/15
                </div>
                <div className="text-[10px] text-muted">{evaluation.elementBreakdown.evidenceRating}</div>
              </div>
            </div>
          </div>
        )}

        {/* FAILED / INCOMPLETE VIEW (< 80 points) */}
        {!isPassed && evaluation && (
          <div className="card p-6 space-y-4 border border-rose-500/30 bg-rose-950/10">
            <div className="flex items-center gap-2 border-b border-rose-500/20 pb-3">
              <span className="text-lg">💡</span>
              <h3 className="text-base font-bold text-rose-300 uppercase font-mono tracking-wider">
                Targeted Investigative Feedback (Spoil-Free)
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              The game has evaluated your theory against physical evidence without revealing the solution. Use this feedback to guide your next investigation steps:
            </p>

            <ul className="space-y-2 text-xs text-slate-200">
              {evaluation.feedbackLines.map((line, idx) => (
                <li key={idx} className="p-3 rounded-lg bg-black/40 border border-white/5 leading-relaxed font-mono">
                  {line}
                </li>
              ))}
            </ul>

            <div className="pt-3 border-t border-rose-500/20 flex justify-center">
              <Button
                variant="primary"
                size="md"
                onClick={() => setPhase('investigation')}
                className="w-full sm:w-auto"
              >
                🔍 RETURN TO INVESTIGATION &amp; REVISE THEORY
              </Button>
            </div>
          </div>
        )}

        {/* SUCCESSFUL SOLVED VIEW (>= 80 points) - Side-by-Side Comparison */}
        {isPassed && evaluation?.comparison && (
          <div className="card p-6 space-y-6">
            <div className="border-b pb-3 flex items-center justify-between" style={{ borderColor: 'var(--color-border-subtle)' }}>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                  Side-by-Side Theory Evaluation
                </span>
                <h3 className="text-xl font-bold mt-0.5" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Player Theory vs Actual Case Truth
                </h3>
              </div>
              <Badge variant="amber">Passed ({totalScore}/100)</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Player Theory Column */}
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                <div className="font-bold text-amber-300 uppercase font-mono border-b border-amber-500/20 pb-2">
                  📝 Your Submitted Theory
                </div>
                <div>
                  <span className="text-[10px] text-muted font-mono uppercase block">Accused Perpetrator</span>
                  <p className="font-bold text-white text-sm">{evaluation.comparison.playerTheory.suspectName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted font-mono uppercase block">Proposed Method</span>
                  <p className="text-slate-300">{evaluation.comparison.playerTheory.method || '(Not specified)'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted font-mono uppercase block">Proposed Motive</span>
                  <p className="text-slate-300">{evaluation.comparison.playerTheory.motive || '(Not specified)'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted font-mono uppercase block">Proposed Timeline</span>
                  <p className="text-slate-300">{evaluation.comparison.playerTheory.timeline || '(Not specified)'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted font-mono uppercase block">Supporting Evidence</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {evaluation.comparison.playerTheory.evidenceNames.map((name) => (
                      <span key={name} className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 text-[10px] font-mono">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actual Solution Column */}
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                <div className="font-bold text-emerald-300 uppercase font-mono border-b border-emerald-500/20 pb-2">
                  ⚖️ Actual Case Solution
                </div>
                <div>
                  <span className="text-[10px] text-muted font-mono uppercase block">Actual Killer</span>
                  <p className="font-bold text-white text-sm">{evaluation.comparison.actualSolution.killerName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted font-mono uppercase block">Actual Method</span>
                  <p className="text-slate-300">{evaluation.comparison.actualSolution.method}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted font-mono uppercase block">Actual Motive</span>
                  <p className="text-slate-300">{evaluation.comparison.actualSolution.motive}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted font-mono uppercase block">Opportunity Window</span>
                  <p className="text-slate-300">{evaluation.comparison.actualSolution.opportunity}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted font-mono uppercase block">Key Decisive Clues</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {evaluation.comparison.actualSolution.keyEvidenceNames.map((name) => (
                      <span key={name} className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 text-[10px] font-mono">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Complete Narrative Reveal */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block">
                Complete Case Narrative &amp; Full Solution
              </span>
              <p className="text-xs leading-relaxed text-slate-300">
                {evaluation.comparison.actualSolution.explanation}
              </p>
            </div>
          </div>
        )}

        {/* Investigation Statistics */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-amber-400">
              📊 Investigation Performance Metrics
            </h3>
            <span className="text-xs font-mono text-muted">
              Duration: {durationStr}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-lg bg-white/[0.02]">
              <div className="text-2xl font-bold font-mono text-amber-400">{progress.locationsVisited}/{progress.locationsTotal}</div>
              <div className="text-[11px] text-muted">Locations Visited</div>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02]">
              <div className="text-2xl font-bold font-mono text-amber-400">{progress.evidenceDiscovered}/{progress.evidenceTotal}</div>
              <div className="text-[11px] text-muted">Evidence Discovered</div>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02]">
              <div className="text-2xl font-bold font-mono text-amber-400">{progress.suspectsInterviewed}/{progress.suspectsTotal}</div>
              <div className="text-[11px] text-muted">Suspects Questioned</div>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02]">
              <div className="text-2xl font-bold font-mono text-amber-400">{progress.contradictionsFound}</div>
              <div className="text-[11px] text-muted">Contradictions Found</div>
            </div>
          </div>

          <div className="pt-2 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-3 border-white/10">
            <div>
              <span className="text-muted">Human Detective Actions: </span>
              <strong className="text-white">{humanEventsCount} events</strong>
            </div>
            <div>
              <span className="text-muted">AI Agent Tool Invocations: </span>
              <strong className="text-amber-400">{agentActions.length} WebMCP tool calls ({agentEventsCount} events)</strong>
            </div>
          </div>
        </div>

        {/* Navigation / Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!isPassed && (
            <Button
              variant="primary"
              onClick={() => setPhase('investigation')}
              className="w-full sm:w-auto"
            >
              🔍 RETURN TO INVESTIGATION &amp; REVISE THEORY
            </Button>
          )}

          {isPassed && (
            <Button
              variant="primary"
              onClick={() => {
                resetInvestigation();
                setPhase('cases');
              }}
              className="w-full sm:w-auto"
            >
              📁 SELECT NEXT CASE / REPLAY
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

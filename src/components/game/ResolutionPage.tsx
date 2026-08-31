'use client';

import { useGameStore } from '@/game/state/store';
import { getAgentRecommendation, getInvestigationProgress } from '@/game/logic/investigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// Helper to format duration mm:ss
function formatDuration(startTime: number, endTime: number): string {
  const diffMs = Math.max(0, endTime - startTime);
  const totalSeconds = Math.floor(diffMs / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
}

// Custom explanations for why each suspect was NOT the killer when wrongly accused
const WRONG_SUSPECT_EXPLANATIONS: Record<string, {
  whyNotKiller: string;
  contradictingEvidence: string;
  missedFocus: string;
}> = {
  'marcus-cole': {
    whyNotKiller:
      'Marcus Cole had a heated argument with Daniel at 8:45 PM over painting forgery, but CCTV and taxicab records confirm he exited the gallery at 9:28 PM and went home.',
    contradictingEvidence:
      'Torn draft article (not a threat letter) and Cab booking record clearing the forecourt at 9:31 PM.',
    missedFocus:
      'You focused on a public verbal argument rather than checking timestamps after 9:30 PM when Marcus was already miles away.',
  },
  'james-bello': {
    whyNotKiller:
      'James Bello embezzled £160,000 from gallery accounts, but he remained in the main gallery serving drinks to guests from 9:00 PM to 11:30 PM with dozens of eyewitnesses.',
    contradictingEvidence:
      'Multiple witness statements confirming James never left the bar area, plus phone records placing Daniel in his private office alone.',
    missedFocus:
      'You mistook a financial crime (embezzlement) for murder. James had financial motive, but zero physical opportunity during the crime window.',
  },
  'sarah-okafor': {
    whyNotKiller:
      'Sarah Okafor had a secret affair with Daniel, but she was in the main gallery at 10:55 PM calling his unanswered mobile phone because she was concerned about his absence.',
    contradictingEvidence:
      'Phone call records confirming an outgoing call from Sarah to Daniel at 10:55 PM — someone who had just poisoned a victim would not call them moments later.',
    missedFocus:
      'You overlooked exculpatory digital evidence (the unanswered phone call) that places Sarah outside the office during the poisoning window.',
  },
  'michael-grant': {
    whyNotKiller:
      'Michael Grant deleted 8 minutes of CCTV footage, but he was bribed to do so by Victoria Adeyemi and did not administer the poison himself.',
    contradictingEvidence:
      'Bank deposit slip showing £3,000 cash deposit into Grant\'s account from Victoria Adeyemi\'s personal bank account.',
    missedFocus:
      'Michael Grant was an accomplice bribed for cover-up, not the perpetrator who ordered or administered the potassium cyanide.',
  },
};

export function ResolutionPage() {
  const setPhase = useGameStore((s) => s.setPhase);
  const activeCase = useGameStore((s) => s.activeCase);
  const accusation = useGameStore((s) => s.accusation);
  const accusationSubmission = useGameStore((s) => s.accusationSubmission);
  const startTime = useGameStore((s) => s.startTime);
  const visitedLocationIds = useGameStore((s) => s.visitedLocationIds);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);
  const inspectedEvidenceIds = useGameStore((s) => s.inspectedEvidenceIds);
  const interviewedSuspectIds = useGameStore((s) => s.interviewedSuspectIds);
  const agentActions = useGameStore((s) => s.agentActions);
  const investigationLog = useGameStore((s) => s.investigationLog);
  const resetInvestigation = useGameStore((s) => s.resetInvestigation);

  const solution = activeCase.solution;
  const accused = activeCase.suspects.find((s) => s.id === accusation);
  const killer = activeCase.suspects.find((s) => s.id === solution.killerId);
  const isCorrect = accusation === solution.killerId;

  const progress = getInvestigationProgress(
    activeCase,
    visitedLocationIds,
    discoveredEvidenceIds,
    inspectedEvidenceIds,
    interviewedSuspectIds,
  );

  const agentRec = getAgentRecommendation(
    activeCase,
    discoveredEvidenceIds,
    inspectedEvidenceIds,
    interviewedSuspectIds,
  );

  const durationStr = formatDuration(startTime, accusationSubmission?.submittedAt ?? Date.now());

  // Provenance counts
  const humanEventsCount = investigationLog.filter((e) => e.actor === 'human').length;
  const agentEventsCount = investigationLog.filter((e) => e.actor === 'agent').length;

  const wrongDetails = accused ? WRONG_SUSPECT_EXPLANATIONS[accused.id] : null;

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-12 relative"
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

      <div className="relative z-10 w-full max-w-3xl animate-fade-in space-y-6">
        {/* Banner */}
        <div className="text-center space-y-2">
          <div className="text-6xl mb-2">{isCorrect ? '🎯' : '❌'}</div>

          <Badge variant={isCorrect ? 'amber' : 'crimson'}>
            {isCorrect ? 'CASE SOLVED — ACCUSATION VERIFIED' : 'WRONG ACCUSATION — SUSPECT IS INNOCENT'}
          </Badge>

          <h1
            className="text-4xl font-bold"
            style={{
              fontFamily: 'var(--font-playfair)',
              color: isCorrect ? 'var(--color-amber)' : 'var(--color-crimson)',
            }}
          >
            {isCorrect ? 'Case #047 Closed' : 'Investigation Failed'}
          </h1>

          <p className="text-sm max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {isCorrect
              ? `You accused ${accused?.name}. Your deduction was verified by physical evidence and key timeline facts.`
              : `You accused ${accused?.name ?? 'an innocent suspect'}. However, forensic evidence and alibis prove they were not responsible.`}
          </p>
        </div>

        {/* Incorrect Detailed Explanation (if wrong) */}
        {!isCorrect && accused && wrongDetails && (
          <div
            className="card p-6 space-y-3"
            style={{
              background: 'oklch(52% 0.22 18 / 0.1)',
              border: '1px solid oklch(52% 0.22 18 / 0.3)',
            }}
          >
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-red-400">
              Why {accused.name} Was Not The Killer
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
              <strong>Reasoning: </strong>{wrongDetails.whyNotKiller}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              <strong>Contradicting Evidence: </strong>{wrongDetails.contradictingEvidence}
            </p>
            <p className="text-xs italic" style={{ color: 'var(--color-text-muted)' }}>
              <strong>Investigative Pitfall: </strong>{wrongDetails.missedFocus}
            </p>
          </div>
        )}

        {/* Complete Truth Reveal Card */}
        <div className="card p-6 space-y-5">
          <div className="border-b pb-3 flex items-center justify-between" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--color-amber)' }}>
                Official Forensics Findings
              </span>
              <h3 className="text-xl font-bold mt-0.5" style={{ fontFamily: 'var(--font-playfair)' }}>
                The Solution: {killer?.name}
              </h3>
            </div>
            <Badge variant="amber">The Killer: {killer?.name}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface-2)' }}>
              <span className="text-[10px] font-mono uppercase text-muted block mb-1">Motive</span>
              <p className="font-semibold text-secondary">{solution.motive}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface-2)' }}>
              <span className="text-[10px] font-mono uppercase text-muted block mb-1">Method</span>
              <p className="font-semibold text-secondary">{solution.method}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface-2)' }}>
              <span className="text-[10px] font-mono uppercase text-muted block mb-1">Opportunity</span>
              <p className="font-semibold text-secondary">{solution.opportunity}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
              Complete Murder Timeline &amp; Narrative
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {solution.fullExplanation}
            </p>
          </div>

          {/* Key Evidence Status */}
          <div>
            <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
              Decisive Evidence Checklist
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {solution.keyEvidenceIds.map((eid) => {
                const ev = activeCase.evidence.find((e) => e.id === eid);
                const isDiscovered = discoveredEvidenceIds.has(eid);
                const isInspected = inspectedEvidenceIds.has(eid);

                return (
                  <div
                    key={eid}
                    className="p-2.5 rounded flex items-center justify-between"
                    style={{
                      background: isInspected
                        ? 'oklch(75% 0.18 75 / 0.1)'
                        : isDiscovered
                        ? 'var(--color-surface-2)'
                        : 'var(--color-surface-3)',
                      border: isInspected
                        ? '1px solid oklch(75% 0.18 75 / 0.3)'
                        : '1px solid var(--color-border-subtle)',
                    }}
                  >
                    <span style={{ color: isInspected ? 'var(--color-amber)' : 'var(--color-text-secondary)' }}>
                      {isInspected ? '✓ Inspected: ' : isDiscovered ? '◉ Discovered: ' : '🔒 Missed: '}
                      {ev?.name ?? eid}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Comprehensive Investigation Statistics */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono" style={{ color: 'var(--color-amber)' }}>
              📊 Complete Case Investigation Statistics
            </h3>
            <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
              Duration: {durationStr}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface-2)' }}>
              <div className="text-2xl font-bold font-mono text-amber-400">{progress.locationsVisited}/{progress.locationsTotal}</div>
              <div className="text-[11px] text-muted">Locations Visited</div>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface-2)' }}>
              <div className="text-2xl font-bold font-mono text-amber-400">{progress.evidenceDiscovered}/{progress.evidenceTotal}</div>
              <div className="text-[11px] text-muted">Evidence Discovered</div>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface-2)' }}>
              <div className="text-2xl font-bold font-mono text-amber-400">{progress.suspectsInterviewed}/{progress.suspectsTotal}</div>
              <div className="text-[11px] text-muted">Suspects Questioned</div>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface-2)' }}>
              <div className="text-2xl font-bold font-mono text-amber-400">{progress.contradictionsFound}</div>
              <div className="text-[11px] text-muted">Contradictions Found</div>
            </div>
          </div>

          {/* Human vs Agent Attribution Metrics */}
          <div className="pt-2 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-3" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <div>
              <span className="text-muted">Human Detective Actions: </span>
              <strong className="text-white">{humanEventsCount} events</strong>
            </div>
            <div>
              <span className="text-muted">AI Agent Tool Invocations: </span>
              <strong className="text-amber-400">{agentActions.length} WebMCP tool calls ({agentEventsCount} events)</strong>
            </div>
            <div>
              <span className="text-muted">AI Conclusion: </span>
              <strong className="text-white">{agentRec.suspectName} ({agentRec.confidence})</strong>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="secondary"
            onClick={() => setPhase('investigation')}
          >
            ← Review Investigation Board
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

'use client';

import { useGameStore } from '@/game/state/store';
import { AgentRecommendationCard } from '@/components/game/AgentRecommendationCard';
import { StructuredFindingsWidget } from '@/components/game/StructuredFindingsWidget';

export function OverviewView() {
  const activeCase = useGameStore((s) => s.activeCase);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);
  const visitedLocationIds = useGameStore((s) => s.visitedLocationIds);
  const interviewedSuspectIds = useGameStore((s) => s.interviewedSuspectIds);
  const inspectedEvidenceIds = useGameStore((s) => s.inspectedEvidenceIds);
  const setActiveView = useGameStore((s) => s.setActiveView);

  const totalEvidence = activeCase.evidence.length;
  const contradictions = activeCase.timeline.filter((e) => e.isContradiction).length;

  const stats = [
    {
      label: 'Suspects',
      value: activeCase.suspects.length,
      sub: `${interviewedSuspectIds.size} interviewed`,
      view: 'suspects' as const,
    },
    {
      label: 'Locations',
      value: activeCase.locations.length,
      sub: `${visitedLocationIds.size} visited`,
      view: 'locations' as const,
    },
    {
      label: 'Evidence',
      value: `${discoveredEvidenceIds.size}/${totalEvidence}`,
      sub: `${inspectedEvidenceIds.size} inspected`,
      view: 'evidence' as const,
    },
    {
      label: 'Contradictions',
      value: contradictions,
      sub: 'in timeline',
      view: 'timeline' as const,
    },
  ];

  return (
    <div className="p-6 md:p-8 animate-fade-in space-y-8">
      {/* Case header */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: 'var(--color-crimson)' }}
          >
            Active Investigation · Case {activeCase.caseNumber}
          </span>
          <div className="h-px flex-1" style={{ background: 'var(--color-border-subtle)' }} />
        </div>
        <h1
          className="text-4xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-playfair)', color: 'var(--color-text-primary)' }}
        >
          {activeCase.title}
        </h1>
        <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          {activeCase.subtitle}
        </p>
      </div>

      {/* Victim card */}
      <div
        className="card p-4 md:p-6"
        style={{ borderLeftWidth: '4px', borderLeftColor: 'var(--color-crimson)' }}
      >
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg"
            style={{
              background: 'oklch(52% 0.22 18 / 0.15)',
              color: 'var(--color-crimson)',
            }}
          >
            ✦
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="text-xs uppercase tracking-widest mb-1"
              style={{ color: 'var(--color-crimson)' }}
            >
              Victim
            </p>
            <h2
              className="text-xl font-semibold mb-2 break-words"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {activeCase.victim}
            </h2>
            <p className="break-words" style={{ color: 'var(--color-text-secondary)' }}>
              {activeCase.victimDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Structured Contradictions & Investigative Leads Widget */}
      <StructuredFindingsWidget />

      {/* AI Recommendation Card */}
      <AgentRecommendationCard />

      {/* Briefing */}
      <div className="card p-4 md:p-6 min-w-0">
        <h3
          className="text-sm uppercase tracking-widest mb-3"
          style={{ color: 'var(--color-amber)', fontFamily: 'var(--font-playfair)' }}
        >
          Case Briefing
        </h3>
        <p className="leading-relaxed break-words whitespace-pre-wrap" style={{ color: 'var(--color-text-secondary)' }}>
          {activeCase.briefing}
        </p>
      </div>

      {/* Stats grid — clickable */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <button
            key={stat.label}
            className="card card-interactive p-4 text-center cursor-pointer"
            onClick={() => setActiveView(stat.view)}
          >
            <div
              className="text-3xl font-bold mb-1"
              style={{ fontFamily: 'var(--font-playfair)', color: 'var(--color-amber)' }}
            >
              {stat.value}
            </div>
            <div
              className="text-sm font-medium"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {stat.label}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              {stat.sub}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

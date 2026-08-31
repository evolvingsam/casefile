'use client';

import { useState } from 'react';
import { useGameStore } from '@/game/state/store';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function CaseBoardView() {
  const activeCase = useGameStore((s) => s.activeCase);
  const discoveredEvidenceIds = useGameStore((s) => s.discoveredEvidenceIds);
  const interviewedSuspectIds = useGameStore((s) => s.interviewedSuspectIds);
  const agentActions = useGameStore((s) => s.agentActions);
  const notes = useGameStore((s) => s.notes);
  const connections = useGameStore((s) => s.connections);
  const addConnection = useGameStore((s) => s.addConnection);
  const removeConnection = useGameStore((s) => s.removeConnection);
  const addNote = useGameStore((s) => s.addNote);
  const deleteNote = useGameStore((s) => s.deleteNote);
  const setActiveView = useGameStore((s) => s.setActiveView);

  const [connectingSource, setConnectingSource] = useState<{
    id: string;
    type: 'evidence' | 'suspect';
    name: string;
  } | null>(null);

  const [newNote, setNewNote] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'evidence' | 'suspects' | 'notes' | 'connections'>('all');

  const discoveredEvidence = activeCase.evidence.filter((e) => discoveredEvidenceIds.has(e.id));

  // Determine if evidence was inspected/discovered by agent or human
  const isAgentDiscovered = (id: string) => {
    return agentActions.some((a) => a.parameters?.evidence_id === id || a.result?.includes(id));
  };

  const handleStartConnect = (id: string, type: 'evidence' | 'suspect', name: string) => {
    if (connectingSource) {
      if (connectingSource.id === id) {
        setConnectingSource(null);
        return;
      }
      addConnection(
        connectingSource.id,
        connectingSource.type,
        id,
        type,
        'Shared Deduction',
      );
      setConnectingSource(null);
    } else {
      setConnectingSource({ id, type, name });
    }
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addNote(newNote.trim(), 'human');
    setNewNote('');
  };

  return (
    <div className="p-6 md:p-8 animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: 'var(--color-amber)' }}
          >
            📌 Shared Case Board
          </span>
          <div className="h-px flex-1" style={{ background: 'var(--color-border-subtle)' }} />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1
              className="text-3xl font-bold mb-1"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Human + Agent Investigation Board
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              A single shared investigation board. Items pinned by both human detective and AI co-investigator appear here in real time.
            </p>
          </div>

          {connectingSource && (
            <div
              className="p-3 rounded-lg text-xs flex items-center gap-3 animate-pulse shrink-0"
              style={{
                background: 'oklch(75% 0.18 75 / 0.12)',
                border: '1px solid var(--color-amber)',
              }}
            >
              <span>
                🔗 Connecting: <strong style={{ color: 'var(--color-amber)' }}>{connectingSource.name}</strong>
              </span>
              <button
                className="underline cursor-pointer"
                onClick={() => setConnectingSource(null)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: 'var(--color-border-subtle)' }}>
        {(['all', 'evidence', 'suspects', 'notes', 'connections'] as const).map((f) => (
          <button
            key={f}
            className="px-3 py-1.5 rounded text-xs font-medium capitalize transition-colors cursor-pointer"
            style={{
              background: activeFilter === f ? 'var(--color-surface-3)' : 'transparent',
              color: activeFilter === f ? 'var(--color-amber)' : 'var(--color-text-muted)',
              border: activeFilter === f ? '1px solid var(--color-border)' : '1px solid transparent',
            }}
            onClick={() => setActiveFilter(f)}
          >
            {f} ({
              f === 'all'
                ? discoveredEvidence.length + activeCase.suspects.length + notes.length
                : f === 'evidence'
                ? discoveredEvidence.length
                : f === 'suspects'
                ? activeCase.suspects.length
                : f === 'notes'
                ? notes.length
                : connections.length
            })
          </button>
        ))}
      </div>

      {/* Main Board Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Suspect Cards & Evidence Nodes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Suspect Pinboard Section */}
          {(activeFilter === 'all' || activeFilter === 'suspects') && (
            <div>
              <h3 className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                👤 Suspect Pins (5)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeCase.suspects.map((s) => {
                  const isInterviewed = interviewedSuspectIds.has(s.id);
                  const isConnectingThis = connectingSource?.id === s.id;

                  return (
                    <div
                      key={s.id}
                      className="card p-4 flex flex-col justify-between relative"
                      style={{
                        borderColor: isConnectingThis
                          ? 'var(--color-amber)'
                          : isInterviewed
                          ? 'oklch(75% 0.18 75 / 0.3)'
                          : 'var(--color-border)',
                      }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                            style={{
                              background: 'var(--color-surface-3)',
                              color: 'var(--color-amber)',
                            }}
                          >
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
                              {s.name}
                            </h4>
                            <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                              {s.title}
                            </p>
                          </div>
                        </div>

                        {isInterviewed ? (
                          <Badge variant="amber">Interviewed</Badge>
                        ) : (
                          <Badge variant="muted">Shared</Badge>
                        )}
                      </div>

                      <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                        {s.motive}
                      </p>

                      <div className="pt-2 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--color-border-subtle)' }}>
                        <button
                          className="text-[11px] font-medium cursor-pointer transition-colors"
                          style={{
                            color: isConnectingThis ? 'var(--color-amber)' : 'var(--color-text-muted)',
                          }}
                          onClick={() => handleStartConnect(s.id, 'suspect', s.name)}
                        >
                          {isConnectingThis ? '● Target Selected' : connectingSource ? '🔗 Connect Here' : '🔗 Link Clue'}
                        </button>

                        <button
                          className="text-[11px]"
                          style={{ color: 'var(--color-amber-dim)' }}
                          onClick={() => setActiveView('suspects')}
                        >
                          Details →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Discovered Evidence Pins */}
          {(activeFilter === 'all' || activeFilter === 'evidence') && (
            <div>
              <h3 className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                🔍 Evidence Pins ({discoveredEvidence.length}) — Provenance Tracked
              </h3>

              {discoveredEvidence.length === 0 ? (
                <p className="text-xs italic" style={{ color: 'var(--color-text-muted)' }}>
                  No evidence discovered yet. Search locations or ask AI agent to scan.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {discoveredEvidence.map((ev) => {
                    const isConnectingThis = connectingSource?.id === ev.id;
                    const agentTouched = isAgentDiscovered(ev.id);

                    return (
                      <div
                        key={ev.id}
                        className="card p-4 flex flex-col justify-between"
                        style={{
                          borderColor: isConnectingThis ? 'var(--color-amber)' : 'var(--color-border)',
                        }}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <Badge variant="muted">{ev.tags[0] ?? 'clue'}</Badge>

                            {/* Provenance badge */}
                            {agentTouched ? (
                              <Badge variant="amber">🤖 Agent Discovered</Badge>
                            ) : (
                              <Badge variant="muted">👤 Human Discovered</Badge>
                            )}
                          </div>

                          <h4 className="text-sm font-semibold mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
                            {ev.name}
                          </h4>
                          <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                            {ev.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--color-border-subtle)' }}>
                          <button
                            className="text-[11px] font-medium cursor-pointer transition-colors"
                            style={{
                              color: isConnectingThis ? 'var(--color-amber)' : 'var(--color-text-muted)',
                            }}
                            onClick={() => handleStartConnect(ev.id, 'evidence', ev.name)}
                          >
                            {isConnectingThis ? '● Target Selected' : connectingSource ? '🔗 Connect Here' : '🔗 Link Item'}
                          </button>

                          <button
                            className="text-[11px]"
                            style={{ color: 'var(--color-amber-dim)' }}
                            onClick={() => setActiveView('evidence')}
                          >
                            Inspect →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Shared Notes & Connection Ledger */}
        <div className="space-y-6">
          {/* Deductions & Case Notes */}
          {(activeFilter === 'all' || activeFilter === 'notes') && (
            <div className="card p-5 space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--color-amber)' }}>
                📝 Shared Notes Feed ({notes.length})
              </h3>

              <form onSubmit={handleCreateNote} className="space-y-2">
                <textarea
                  className="w-full p-3 rounded-lg text-xs leading-relaxed"
                  style={{
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                    outline: 'none',
                  }}
                  rows={3}
                  placeholder="Record your human deduction or note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <Button variant="primary" size="sm" type="submit" className="w-full">
                  + Add Human Note
                </Button>
              </form>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {notes.length === 0 ? (
                  <p className="text-xs italic text-center py-4" style={{ color: 'var(--color-text-muted)' }}>
                    No notes recorded yet.
                  </p>
                ) : (
                  notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 rounded-lg text-xs space-y-1 relative group"
                      style={{
                        background: note.author === 'agent' ? 'oklch(75% 0.18 75 / 0.08)' : 'var(--color-surface-2)',
                        border: note.author === 'agent' ? '1px solid oklch(75% 0.18 75 / 0.25)' : '1px solid var(--color-border-subtle)',
                      }}
                    >
                      <div className="flex items-center justify-between text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                        <span className="font-semibold uppercase tracking-wider" style={{ color: note.author === 'agent' ? 'var(--color-amber)' : 'var(--color-text-secondary)' }}>
                          {note.author === 'agent' ? '🤖 AI Observation' : '👤 Human Deduction'}
                        </span>
                        <button
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:underline cursor-pointer"
                          onClick={() => deleteNote(note.id)}
                        >
                          delete
                        </button>
                      </div>
                      <p className="leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                        {note.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Active Connections Ledger */}
          {(activeFilter === 'all' || activeFilter === 'connections') && (
            <div className="card p-5 space-y-3">
              <h3 className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--color-amber)' }}>
                🔗 Correlated Clues Ledger ({connections.length})
              </h3>

              {connections.length === 0 ? (
                <p className="text-xs italic py-2" style={{ color: 'var(--color-text-muted)' }}>
                  No connections created yet. Click &quot;Link Item&quot; on two cards to correlate them.
                </p>
              ) : (
                <div className="space-y-2">
                  {connections.map((c) => {
                    const fromSuspect = activeCase.suspects.find((s) => s.id === c.fromId);
                    const fromEvidence = activeCase.evidence.find((e) => e.id === c.fromId);
                    const toSuspect = activeCase.suspects.find((s) => s.id === c.toId);
                    const toEvidence = activeCase.evidence.find((e) => e.id === c.toId);

                    const fromName = fromSuspect?.name ?? fromEvidence?.name ?? c.fromId;
                    const toName = toSuspect?.name ?? toEvidence?.name ?? c.toId;

                    return (
                      <div
                        key={c.id}
                        className="p-3 rounded-lg text-xs flex items-center justify-between"
                        style={{
                          background: 'var(--color-surface-2)',
                          border: '1px solid var(--color-border-subtle)',
                        }}
                      >
                        <div className="space-y-0.5">
                          <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                            {fromName} ↔ {toName}
                          </p>
                          <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                            {c.author === 'agent' ? '🤖 Agent Linked' : '👤 Human Linked'}
                          </p>
                        </div>
                        <button
                          className="text-[10px] text-red-400 hover:underline cursor-pointer"
                          onClick={() => removeConnection(c.id)}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

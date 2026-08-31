'use client';

export function CaseBoardView() {
  return (
    <div className="p-8 animate-fade-in space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: 'var(--color-amber)' }}
          >
            ⊞ Case Board
          </span>
          <div className="h-px flex-1" style={{ background: 'var(--color-border-subtle)' }} />
        </div>
        <h1
          className="text-3xl font-bold mb-1"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Investigation Board
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Connect evidence to suspects. Build your theory.
        </p>
      </div>

      {/* Placeholder board */}
      <div
        className="card p-12 text-center min-h-[480px] flex flex-col items-center justify-center"
        style={{
          borderStyle: 'dashed',
          background: 'radial-gradient(ellipse at center, oklch(12% 0.02 280) 0%, var(--color-surface-1) 100%)',
        }}
      >
        <div className="text-5xl mb-6">📌</div>
        <h3
          className="text-xl font-semibold mb-2"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Case Board Coming Soon
        </h3>
        <p className="text-sm max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
          The interactive case board — with pins and string connecting suspects to evidence — will be implemented in a later step.
        </p>
      </div>
    </div>
  );
}

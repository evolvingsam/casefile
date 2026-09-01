'use client';

import { useGameStore } from '@/game/state/store';
import type { AppPhase, WorkspaceView } from '@/game/types';
import { ALL_CASE_SUMMARIES } from '@/game/data/registry';

export function Navbar() {
  const phase = useGameStore((s) => s.phase);
  const activeView = useGameStore((s) => s.activeView);
  const activeCaseId = useGameStore((s) => s.activeCaseId);
  const setPhase = useGameStore((s) => s.setPhase);
  const setActiveView = useGameStore((s) => s.setActiveView);
  const selectCase = useGameStore((s) => s.selectCase);

  const handleNav = (targetPhase: AppPhase, targetView?: WorkspaceView) => {
    setPhase(targetPhase);
    if (targetView) {
      setActiveView(targetView);
    }
  };

  const handleSwitchCase = (caseId: string) => {
    selectCase(caseId);
    setPhase('briefing');
  };

  return (
    <header
      className="sticky top-0 z-40 w-full border-b backdrop-blur-md px-4 py-2.5 flex items-center justify-between transition-all shadow-md"
      style={{
        background: 'oklch(12% 0.01 280 / 0.90)',
        borderColor: 'var(--color-border-subtle)',
      }}
    >
      {/* Left: Brand Logo & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => handleNav('landing')}
          className="flex items-center gap-2 text-left cursor-pointer group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">📁</span>
          <div>
            <span
              className="text-base font-bold tracking-wider font-mono uppercase text-white group-hover:text-amber-400 transition-colors"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              CASEFILE
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono text-muted block -mt-1">
              AI Detective Platform
            </span>
          </div>
        </button>

        {/* Vertical Divider */}
        <div className="h-5 w-px bg-white/10 hidden md:block" />

        {/* Active Case Selector Badge */}
        {phase !== 'landing' && (
          <div className="hidden md:flex items-center gap-2 bg-black/40 border border-white/10 rounded-full px-3 py-1 text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-muted font-mono text-[11px]">Active:</span>
            <select
              value={activeCaseId}
              onChange={(e) => handleSwitchCase(e.target.value)}
              className="bg-transparent text-amber-300 font-semibold text-xs outline-none cursor-pointer pr-1"
            >
              {ALL_CASE_SUMMARIES.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  Case #{c.caseNumber} — {c.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Quick Navigation Links */}
      <nav className="flex items-center gap-1 sm:gap-2 text-xs font-mono">
        <button
          onClick={() => handleNav('landing')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            phase === 'landing'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
              : 'text-slate-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span>🏠</span>
          <span className="hidden sm:inline">Home</span>
        </button>

        <button
          onClick={() => handleNav('cases')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            phase === 'cases'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
              : 'text-slate-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span>📂</span>
          <span>Case Files</span>
        </button>

        <button
          onClick={() => handleNav('investigation', 'overview')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            phase === 'investigation' && activeView !== 'deductions'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
              : 'text-slate-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span>🔍</span>
          <span className="hidden md:inline">Workspace</span>
        </button>

        <button
          onClick={() => handleNav('investigation', 'deductions')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            phase === 'investigation' && activeView === 'deductions'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
              : 'text-slate-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span>🧠</span>
          <span className="hidden sm:inline">Deductions</span>
        </button>
      </nav>
    </header>
  );
}

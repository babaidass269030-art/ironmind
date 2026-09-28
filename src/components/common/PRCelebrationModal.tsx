import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, ArrowUpRight, Check } from 'lucide-react';
import { PRAchievement } from '../../types';

interface PRCelebrationProps {
  pr: PRAchievement | null;
  onDismiss: () => void;
}

export const PRCelebrationModal: React.FC<PRCelebrationProps> = ({ pr, onDismiss }) => {
  useEffect(() => {
    if (!pr) return;

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#ffffff', '#ea580c']
      });
    } catch {
      // ignore
    }
  }, [pr]);

  if (!pr) return null;

  const diff = pr.previousValue !== undefined ? Math.round((pr.value - pr.previousValue) * 10) / 10 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in zoom-in-95">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#11131a] border border-amber-500/40 p-6 flex flex-col items-center shadow-2xl text-center overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Trophy icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/10">
          <Trophy className="w-8 h-8" />
        </div>

        <span className="text-[11px] font-extrabold tracking-widest text-amber-400 uppercase">
          New Personal Record
        </span>

        <h2 className="text-xl font-bold font-display text-white mt-1 mb-3">
          {pr.exerciseName}
        </h2>

        {/* Main Record Card */}
        <div className="w-full py-4 px-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center mb-4">
          <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
            {pr.value}{' '}
            <span className="text-lg font-semibold text-amber-400">{pr.unit}</span>
          </span>

          {pr.previousValue !== undefined && pr.previousValue > 0 && (
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
              <span>Previous: {pr.previousValue} {pr.unit}</span>
              <span className="inline-flex items-center font-bold text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{diff} {pr.unit}
              </span>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          Discipline pays off. This milestone has been etched into your local training records.
        </p>

        <button
          onClick={onDismiss}
          className="w-full py-3 rounded-xl bg-amber-500 text-black font-bold text-sm shadow-lg shadow-amber-500/20 hover:bg-amber-400 active:scale-95 transition flex items-center justify-center gap-1.5"
        >
          <Check className="w-4 h-4" />
          Continue Workout
        </button>
      </div>
    </div>
  );
};

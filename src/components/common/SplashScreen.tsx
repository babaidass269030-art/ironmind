import React, { useEffect, useState } from 'react';
import { Dumbbell, Shield, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 2000
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      setProgress(pct);

      if (elapsed >= durationMs) {
        clearInterval(interval);
        onFinish();
      }
    }, 20);

    return () => clearInterval(interval);
  }, [durationMs, onFinish]);

  return (
    <div
      onClick={onFinish}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#08090d] text-slate-100 p-8 select-none cursor-pointer"
    >
      {/* Top subtle spacing */}
      <div className="pt-8 flex items-center gap-1.5 opacity-60">
        <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
          IRONMIND OS · v1.0.0
        </span>
      </div>

      {/* Center Hero Emblem & Typography */}
      <div className="flex flex-col items-center text-center -mt-6">
        {/* Glowing athletic emblem */}
        <div className="relative mb-6">
          {/* Radial ambient glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-orange-500/30 to-amber-500/20 rounded-full blur-2xl animate-pulse" />

          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1a1e2b] via-[#121520] to-[#0c0e14] border border-amber-500/40 flex items-center justify-center shadow-2xl shadow-amber-500/10">
            {/* Athletic barbell / thunder emblem */}
            <svg
              className="w-14 h-14"
              viewBox="0 0 512 512"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="splash-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>
              {/* Barbell weights */}
              <path
                d="M120 176 L160 176 L180 200 L180 312 L160 336 L120 336 L100 312 L100 200 Z"
                fill="#1e2433"
                stroke="#64748b"
                strokeWidth="10"
              />
              <path
                d="M392 176 L352 176 L332 200 L332 312 L352 336 L392 336 L412 312 L412 200 Z"
                fill="#1e2433"
                stroke="#64748b"
                strokeWidth="10"
              />
              {/* Shaft */}
              <rect x="60" y="244" width="392" height="24" rx="6" fill="#94a3b8" />
              {/* Central Diamond M */}
              <polygon
                points="256,120 360,256 256,392 152,256"
                fill="#0d111a"
                stroke="url(#splash-grad)"
                strokeWidth="14"
                strokeLinejoin="round"
              />
              <path
                d="M200 310 L228 200 L256 264 L284 200 L312 310"
                fill="none"
                stroke="url(#splash-grad)"
                strokeWidth="20"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Wordmark */}
        <h1 className="text-4xl font-black font-display tracking-tight text-white mb-1.5">
          IRON<span className="text-amber-400">MIND</span>
        </h1>

        {/* Tagline */}
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400 mb-3">
          Forged in Discipline
        </p>

        {/* Sub-badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Local-First & Private</span>
        </div>
      </div>

      {/* Bottom loading bar & progress */}
      <div className="w-full max-w-xs flex flex-col items-center gap-2 pb-6">
        <div className="w-full h-1 bg-slate-800/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="w-full flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>INITIALIZING</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Timer, Plus, SkipForward, X, Volume2, VolumeX } from 'lucide-react';
import { SoundEffects } from '../../services/audioFeedback';

interface RestTimerProps {
  initialSeconds: number;
  isOpen: boolean;
  onClose: () => void;
  onFinish?: () => void;
  nextExerciseName?: string;
  nextSetNumber?: number;
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
}

export const RestTimerModal: React.FC<RestTimerProps> = ({
  initialSeconds,
  isOpen,
  onClose,
  onFinish,
  nextExerciseName,
  nextSetNumber,
  soundEnabled = true,
  vibrationEnabled = true
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [isMuted, setIsMuted] = useState(!soundEnabled);

  useEffect(() => {
    setSecondsRemaining(initialSeconds);
    setTotalSeconds(initialSeconds);
  }, [initialSeconds, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (secondsRemaining <= 0) {
      if (!isMuted) {
        SoundEffects.playTimerFinished(true, vibrationEnabled);
      }
      onFinish?.();
      onClose();
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, secondsRemaining, isMuted, vibrationEnabled, onClose, onFinish]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const formattedTime = `${minutes}:${secs < 10 ? '0' : ''}${secs}`;

  const progress = totalSeconds > 0 ? (secondsRemaining / totalSeconds) * 100 : 0;
  const strokeRadius = 110;
  const circumference = 2 * Math.PI * strokeRadius;
  const strokeOffset = circumference - (progress / 100) * circumference;

  const addTime = (additionalSec: number) => {
    setSecondsRemaining((prev) => prev + additionalSec);
    setTotalSeconds((prev) => prev + additionalSec);
  };

  const setPreset = (sec: number) => {
    setSecondsRemaining(sec);
    setTotalSeconds(sec);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#11131a] border border-slate-800 p-6 flex flex-col items-center shadow-2xl text-center">
        {/* Top bar controls */}
        <div className="w-full flex items-center justify-between mb-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white"
            title="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
          <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-amber-400 uppercase">
            <Timer className="w-4 h-4" />
            <span>Resting</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Circular Countdown */}
        <div className="relative my-4 flex items-center justify-center">
          <svg width="260" height="260" className="transform -rotate-90">
            <circle
              cx="130"
              cy="130"
              r={strokeRadius}
              stroke="#1a1e29"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="130"
              cy="130"
              r={strokeRadius}
              stroke="#f59e0b"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black font-mono tracking-tight text-white">
              {formattedTime}
            </span>
            <span className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">
              Seconds Left
            </span>
          </div>
        </div>

        {/* Up Next Preview */}
        {nextExerciseName && (
          <div className="w-full py-2.5 px-4 mb-4 rounded-xl bg-slate-900/80 border border-slate-800/60 text-left">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Up Next
            </span>
            <p className="text-sm font-bold text-slate-200 truncate mt-0.5">
              {nextExerciseName} {nextSetNumber ? `· Set ${nextSetNumber}` : ''}
            </p>
          </div>
        )}

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 mb-4">
          {[45, 60, 90, 120, 180].map((preset) => (
            <button
              key={preset}
              onClick={() => setPreset(preset)}
              className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-lg border transition ${
                totalSeconds === preset
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {preset}s
            </button>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="w-full grid grid-cols-3 gap-2">
          <button
            onClick={() => addTime(15)}
            className="flex items-center justify-center gap-1 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold hover:bg-slate-700 active:scale-95 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            15s
          </button>
          <button
            onClick={() => addTime(30)}
            className="flex items-center justify-center gap-1 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold hover:bg-slate-700 active:scale-95 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            30s
          </button>
          <button
            onClick={() => {
              onFinish?.();
              onClose();
            }}
            className="flex items-center justify-center gap-1 py-3 rounded-xl bg-amber-500 text-black text-xs font-bold shadow-lg shadow-amber-500/20 hover:bg-amber-400 active:scale-95 transition"
          >
            <SkipForward className="w-3.5 h-3.5" />
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

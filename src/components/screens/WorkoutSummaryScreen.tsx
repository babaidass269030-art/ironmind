import React from 'react';
import {
  Trophy,
  Clock,
  Dumbbell,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Flame,
  Award,
  Layers
} from 'lucide-react';
import { WorkoutSession, UserProfile, Exercise } from '../../types';
import { UnitConverter } from '../../utils/unitConverter';

interface WorkoutSummaryScreenProps {
  session: WorkoutSession;
  previousSession?: WorkoutSession | null;
  profile: UserProfile;
  allExercises: Exercise[];
  onDone: () => void;
  onViewProgress: () => void;
}

export const WorkoutSummaryScreen: React.FC<WorkoutSummaryScreenProps> = ({
  session,
  previousSession,
  profile,
  allExercises,
  onDone,
  onViewProgress
}) => {
  const durationMin = Math.round(session.durationSeconds / 60);

  // Volume comparison with previous session
  let volumeDiffPct: number | null = null;
  if (previousSession && previousSession.totalVolumeKg > 0) {
    const diff = session.totalVolumeKg - previousSession.totalVolumeKg;
    volumeDiffPct = Math.round((diff / previousSession.totalVolumeKg) * 1000) / 10;
  }

  // Duration diff
  let durationDiffMin: number | null = null;
  if (previousSession) {
    const prevMin = Math.round(previousSession.durationSeconds / 60);
    durationDiffMin = durationMin - prevMin;
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 p-4 max-w-md mx-auto pb-12 flex flex-col justify-between">
      <div>
        {/* Header Badge */}
        <div className="flex flex-col items-center text-center pt-6 pb-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/10">
            <CheckCircle2 className="w-8 h-8 text-amber-400" />
          </div>
          <span className="text-[11px] font-extrabold tracking-widest text-amber-400 uppercase">
            Workout Complete
          </span>
          <h1 className="text-2xl font-black font-display text-white mt-1">
            {session.name}
          </h1>
          <span className="text-xs text-slate-400 mt-1">
            {new Date(session.completedAt || session.startedAt).toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>

        {/* 4 Core Stat Cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Duration */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Duration</span>
            </div>
            <p className="text-xl font-bold font-mono text-white">
              {durationMin} <span className="text-xs font-normal text-slate-400">min</span>
            </p>
            {durationDiffMin !== null && (
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                {durationDiffMin >= 0 ? `+${durationDiffMin}` : durationDiffMin} min vs last session
              </span>
            )}
          </div>

          {/* Total Volume */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Dumbbell className="w-3.5 h-3.5 text-amber-400" />
              <span>Volume</span>
            </div>
            <p className="text-xl font-bold font-mono text-white">
              {profile.unitSystem === 'imperial'
                ? `${UnitConverter.kgToLb(session.totalVolumeKg).toLocaleString()} lb`
                : `${Math.round(session.totalVolumeKg).toLocaleString()} kg`}
            </p>
            {volumeDiffPct !== null && (
              <span
                className={`text-[10px] font-bold mt-0.5 block ${
                  volumeDiffPct >= 0 ? 'text-emerald-400' : 'text-slate-400'
                }`}
              >
                {volumeDiffPct >= 0 ? `+${volumeDiffPct}%` : `${volumeDiffPct}%`} volume
              </span>
            )}
          </div>

          {/* Total Sets */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Completed Sets</span>
            </div>
            <p className="text-xl font-bold font-mono text-white">
              {session.totalSetsCompleted} <span className="text-xs font-normal text-slate-400">sets</span>
            </p>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              {session.exercises.length} exercises performed
            </span>
          </div>

          {/* PRs */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Records</span>
            </div>
            <p className="text-xl font-bold font-mono text-amber-400">
              {session.prsAchieved.length}{' '}
              <span className="text-xs font-normal text-slate-400">new PRs</span>
            </p>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Etched into history</span>
          </div>
        </div>

        {/* PR Details List (if any) */}
        {session.prsAchieved.length > 0 && (
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 mb-5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block mb-2">
              ⭐ Milestone PRs Broken Today
            </span>
            <div className="space-y-2">
              {session.prsAchieved.map((pr, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-1 border-b border-amber-500/20 last:border-0"
                >
                  <span className="font-bold text-slate-200">{pr.exerciseName}</span>
                  <span className="font-mono font-bold text-amber-400">
                    {pr.value} {pr.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exercises Breakdown */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 mb-5">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
            Exercise Breakdown
          </h3>
          <div className="space-y-3">
            {session.exercises.map((ex, idx) => {
              const exData = allExercises.find((e) => e.id === ex.exerciseId);
              const completedSets = ex.sets.filter((s) => s.isCompleted);
              if (completedSets.length === 0) return null;

              return (
                <div key={idx} className="border-b border-slate-800/80 last:border-0 pb-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-200">
                      {exData?.name || `Exercise ${idx + 1}`}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {completedSets.length} sets
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 font-mono">
                    {completedSets.map((s, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300"
                      >
                        {profile.unitSystem === 'imperial'
                          ? `${UnitConverter.kgToLb(s.completedWeight)} lb`
                          : `${s.completedWeight} kg`}{' '}
                        × {s.completedReps}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={onDone}
          className="w-full py-3.5 rounded-2xl bg-amber-500 text-black font-bold text-sm shadow-lg shadow-amber-500/20 hover:bg-amber-400 active:scale-98 transition flex items-center justify-center gap-2"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={onViewProgress}
          className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-800 transition"
        >
          View Progress & Strength Curves
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Play,
  Flame,
  Trophy,
  Dumbbell,
  CheckCircle2,
  Calendar,
  Clock,
  Weight,
  Sparkles,
  ArrowRight,
  Plus,
  BedDouble,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import {
  UserProfile,
  WorkoutTemplate,
  WorkoutSession,
  PersonalRecord,
  BodyMeasurementLog,
  RoutineSchedule,
  Exercise
} from '../../types';
import { StatRing } from '../common/StatRing';
import { UnitConverter } from '../../utils/unitConverter';
import { StorageService } from '../../services/storage';

interface HomeScreenProps {
  profile: UserProfile;
  templates: WorkoutTemplate[];
  sessions: WorkoutSession[];
  prs: PersonalRecord[];
  measurements: BodyMeasurementLog[];
  allExercises?: Exercise[];
  activeRoutine?: RoutineSchedule;
  activeSession: WorkoutSession | null;
  onStartWorkout: (template?: WorkoutTemplate) => void;
  onRepeatSession?: (session: WorkoutSession) => void;
  onResumeActiveSession: () => void;
  onNavigateToWorkoutTab: () => void;
  onNavigateToProgressTab: () => void;
  onNavigateToToolsTab: () => void;
  onRefreshData: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  templates,
  sessions,
  prs,
  measurements,
  allExercises = [],
  activeRoutine,
  activeSession,
  onStartWorkout,
  onRepeatSession,
  onResumeActiveSession,
  onNavigateToWorkoutTab,
  onNavigateToProgressTab,
  onRefreshData
}) => {
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [newWeightInput, setNewWeightInput] = useState(
    profile.unitSystem === 'imperial'
      ? UnitConverter.kgToLb(profile.weightKg).toString()
      : profile.weightKg.toString()
  );

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon ...
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const todayFormatted = `${dayNames[dayOfWeek]}, ${monthNames[today.getMonth()]} ${today.getDate()}`;

  // Find today's scheduled workout from active routine
  const routineDay = activeRoutine?.days.find((d) => d.dayOfWeek === dayOfWeek);
  const scheduledTemplate = routineDay?.templateId
    ? templates.find((t) => t.id === routineDay.templateId)
    : null;

  // Fallback to first available template if no routine template
  const suggestedWorkout = scheduledTemplate || templates[0];

  // Calculate current week workouts
  // Start of this week (Monday)
  const currentDayIndex = (dayOfWeek + 6) % 7; // 0=Mon, 6=Sun
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDayIndex);
  startOfWeek.setHours(0, 0, 0, 0);

  const completedSessions = sessions.filter((s) => s.isCompleted);

  // Check consistency for Monday through Sunday
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((letter, idx) => {
    const dayDate = new Date(startOfWeek);
    dayDate.setDate(startOfWeek.getDate() + idx);
    const dayStr = dayDate.toISOString().split('T')[0];

    const hasWorkout = completedSessions.some((s) => {
      const sDate = s.completedAt ? s.completedAt.split('T')[0] : s.startedAt.split('T')[0];
      return sDate === dayStr;
    });

    const isToday = idx === currentDayIndex;
    const isPast = idx < currentDayIndex;

    return { letter, hasWorkout, isToday, isPast };
  });

  const workoutsThisWeek = weekDays.filter((d) => d.hasWorkout).length;
  const weeklyTargetProgress = Math.min(
    Math.round((workoutsThisWeek / (profile.weeklyWorkoutTarget || 4)) * 100),
    100
  );

  // Calculate streak (consecutive active training days or consistency)
  let streak = 0;
  const sessionDates = new Set(
    completedSessions.map((s) => (s.completedAt || s.startedAt).split('T')[0])
  );
  let checkDate = new Date(today);
  // If no workout today, check if yesterday had one to maintain streak
  const todayStr = checkDate.toISOString().split('T')[0];
  if (!sessionDates.has(todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }
  while (sessionDates.has(checkDate.toISOString().split('T')[0])) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Lifetime metrics
  const totalVolumeKg = completedSessions.reduce((acc, s) => acc + (s.totalVolumeKg || 0), 0);
  const totalTimeMinutes = Math.round(
    completedSessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0) / 60
  );

  // Latest PR
  const latestPR = prs.length > 0 ? prs[prs.length - 1] : null;

  // Latest body weight
  const latestWeightKg = measurements.length > 0 ? measurements[0].weightKg : profile.weightKg;

  // Days since suggested workout was last performed
  let lastPerformedText = 'Not performed yet';
  if (suggestedWorkout?.lastPerformedAt) {
    const diffDays = Math.floor(
      (new Date().getTime() - new Date(suggestedWorkout.lastPerformedAt).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    lastPerformedText = diffDays === 0 ? 'Performed today' : diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`;
  }

  const formatRelativeDate = (dateStr: string) => {
    const diffDays = Math.floor(
      (new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const formatWorkoutDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const relative = formatRelativeDate(dateStr);
    const shortDate = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    if (relative === 'Today' || relative === 'Yesterday') {
      return `${relative} · ${shortDate}`;
    }
    return `${relative} (${d.toLocaleDateString(undefined, { weekday: 'short' })})`;
  };

  const handleSaveWeight = () => {
    const parsed = parseFloat(newWeightInput);
    if (!parsed || parsed <= 0) return;

    const weightKg = profile.unitSystem === 'imperial' ? UnitConverter.lbToKg(parsed) : parsed;
    StorageService.saveBodyMeasurement({
      id: `measurement_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      weightKg,
      notes: 'Quick logged'
    });
    setShowWeightModal(false);
    onRefreshData();
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 pb-28 pt-4 px-4 max-w-md mx-auto">
      {/* Top zone: Athlete Greeting & Date */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-widest block">
            {todayFormatted}
          </span>
          <h1 className="text-2xl font-extrabold font-display tracking-tight text-white mt-0.5">
            {profile.name ? `Welcome back, ${profile.name}` : 'Welcome back, Athlete'}
          </h1>
        </div>

        {/* Quick Streak Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400">
          <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold font-mono">{streak}d</span>
        </div>
      </div>

      {/* ACTIVE WORKOUT RESUME BANNER (if ongoing) */}
      {activeSession && (
        <div className="mb-5 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 relative overflow-hidden animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-amber-400 tracking-wider uppercase block">
                Workout in progress
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">{activeSession.name}</h3>
              <span className="text-xs text-slate-300">
                {activeSession.exercises.reduce(
                  (acc, ex) => acc + ex.sets.filter((s) => s.isCompleted).length,
                  0
                )}{' '}
                sets logged
              </span>
            </div>
            <button
              onClick={onResumeActiveSession}
              className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition"
            >
              Resume
            </button>
          </div>
        </div>
      )}

      {/* TODAY'S MISSION CARD */}
      <div className="rounded-3xl bg-[#11131a] border border-slate-800/90 p-5 mb-5 shadow-xl relative overflow-hidden">
        {scheduledTemplate || !routineDay?.templateId === false ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-wider text-amber-400 uppercase flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4" />
                Today's Mission
              </span>
              <span className="text-[11px] text-slate-400">{lastPerformedText}</span>
            </div>

            <h2 className="text-xl font-bold font-display text-white mb-1">
              {suggestedWorkout?.name || 'Full Body Workout'}
            </h2>

            <div className="flex items-center gap-3 text-xs text-slate-400 mb-5">
              <span>{suggestedWorkout?.exercises.length || 5} exercises</span>
              <span>·</span>
              <span>{suggestedWorkout?.estimatedDurationMin || 50} min</span>
              <span>·</span>
              <span className="capitalize">{suggestedWorkout?.category || 'Strength'}</span>
            </div>

            <button
              onClick={() => onStartWorkout(suggestedWorkout)}
              className="w-full h-13 rounded-2xl bg-amber-500 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:bg-amber-400 active:scale-98 transition"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>START WORKOUT</span>
            </button>
          </div>
        ) : (
          /* REST DAY VIEW */
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-1.5">
                <BedDouble className="w-4 h-4" />
                Rest & Recovery Day
              </span>
              <span className="text-[11px] text-slate-400">Scheduled in Routine</span>
            </div>

            <h2 className="text-xl font-bold font-display text-white mb-2">
              Recovery Builds Muscle
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Your muscles repair and strengthen during rest intervals. Prioritize 7-8 hours of sleep, maintain 1.8g/kg protein intake, and stay hydrated.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 mb-4">
              <div className="text-xs text-slate-400">
                <span className="font-semibold text-slate-200 block">Light Mobility</span>
                10 min foam roll & stretch
              </div>
              <div className="text-xs text-slate-400">
                <span className="font-semibold text-slate-200 block">Hydration</span>
                Aim for 3+ liters of water
              </div>
            </div>

            <button
              onClick={onNavigateToWorkoutTab}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition"
            >
              Want to train anyway? Browse workouts
            </button>
          </div>
        )}
      </div>

      {/* RECENT WORKOUTS HORIZONTAL LIST (ONE-TAP ACCESS TO REPEAT) */}
      {completedSessions.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <RotateCcw className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Recent Workouts
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {completedSessions.length} logged
            </span>
          </div>

          <div className="flex items-stretch gap-3 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 snap-x snap-mandatory">
            {completedSessions.slice(0, 8).map((session) => {
              const dateDisplay = formatWorkoutDate(session.completedAt || session.startedAt);
              const durationMin = Math.round(session.durationSeconds / 60);
              const exCount = session.exercises.length;
              const setsCount = session.totalSetsCompleted;
              const prCount = session.prsAchieved?.length || 0;

              const handleRepeat = () => {
                if (onRepeatSession) {
                  onRepeatSession(session);
                } else {
                  onStartWorkout();
                }
              };

              return (
                <div
                  key={session.id}
                  onClick={handleRepeat}
                  className="flex-shrink-0 w-[275px] snap-start rounded-2xl bg-gradient-to-br from-[#141722] via-[#10121a] to-[#0a0c10] border border-slate-800/80 hover:border-amber-500/50 hover:shadow-amber-500/5 transition-all duration-200 p-4 flex flex-col justify-between shadow-lg shadow-black/40 group relative overflow-hidden cursor-pointer active:scale-[0.99]"
                >
                  {/* Subtle top rim light */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/25 to-transparent pointer-events-none" />

                  {/* Top Zone: Workout Name, Date & Dedicated Repeat Icon Button */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-semibold text-slate-400 tracking-tight block">
                        {dateDisplay}
                      </span>
                      <h4 className="text-base font-extrabold font-display text-white tracking-tight truncate mt-0.5 group-hover:text-amber-300 transition-colors">
                        {session.name}
                      </h4>
                    </div>

                    {/* Dedicated Repeat Icon Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRepeat();
                      }}
                      aria-label={`Repeat ${session.name}`}
                      title="Repeat Workout"
                      className="flex-shrink-0 w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-black hover:border-amber-400 active:scale-90 transition-all duration-150 flex items-center justify-center shadow-sm shadow-amber-500/10"
                    >
                      <RotateCcw className="w-5 h-5 stroke-[2.2]" />
                    </button>
                  </div>

                  {/* Bottom Zone: Metrics and PR badges */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] tabular-nums">
                      <span>{exCount} ex</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span>{setsCount} sets</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span>
                        {profile.unitSystem === 'imperial'
                          ? `${UnitConverter.kgToLb(session.totalVolumeKg).toLocaleString()} lb`
                          : `${Math.round(session.totalVolumeKg).toLocaleString()} kg`}
                      </span>
                    </div>

                    {prCount > 0 ? (
                      <span className="text-[10px] font-bold text-amber-400 font-mono tracking-tight flex items-center gap-0.5">
                        ★ {prCount} {prCount === 1 ? 'PR' : 'PRs'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500">
                        {durationMin > 0 ? `${durationMin}m` : 'Done'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEKLY CONSISTENCY & TARGET CARD */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-200">Weekly Consistency</span>
          </div>
          <span className="text-xs font-mono text-amber-400 font-semibold">
            {workoutsThisWeek} / {profile.weeklyWorkoutTarget} done
          </span>
        </div>

        {/* Mon-Sun tracker */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {weekDays.map((d, i) => (
            <div
              key={i}
              className={`flex flex-col items-center justify-center py-2 rounded-xl border transition ${
                d.hasWorkout
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                  : d.isToday
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-slate-900/80 border-slate-800 text-slate-500'
              }`}
            >
              <span className="text-[10px] font-semibold">{d.letter}</span>
              <span className="text-sm font-bold mt-0.5">
                {d.hasWorkout ? '✓' : d.isToday ? '·' : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* METRICS GRID: Volume, Time, Weight, Latest PR */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {/* Total Volume */}
        <div
          onClick={onNavigateToProgressTab}
          className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 cursor-pointer hover:border-slate-700 transition"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Volume</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
          <p className="text-lg font-bold font-mono text-white">
            {profile.unitSystem === 'imperial'
              ? `${UnitConverter.kgToLb(totalVolumeKg).toLocaleString()} lb`
              : `${Math.round(totalVolumeKg).toLocaleString()} kg`}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">Lifetime lifted</span>
        </div>

        {/* Workout Time */}
        <div
          onClick={onNavigateToProgressTab}
          className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 cursor-pointer hover:border-slate-700 transition"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Time</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <p className="text-lg font-bold font-mono text-white">
            {Math.floor(totalTimeMinutes / 60)}h {totalTimeMinutes % 60}m
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {completedSessions.length} total sessions
          </span>
        </div>

        {/* Body Weight Snapshot */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Body Weight</span>
            <button
              onClick={() => setShowWeightModal(true)}
              className="p-1 rounded-md bg-slate-800 text-amber-400 hover:text-white"
              title="Log Weight"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <p className="text-lg font-bold font-mono text-white">
            {UnitConverter.formatWeight(latestWeightKg, profile.unitSystem)}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {measurements.length > 0 ? measurements[0].date : 'Current profile'}
          </span>
        </div>

        {/* Recent PR */}
        <div
          onClick={onNavigateToProgressTab}
          className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 cursor-pointer hover:border-slate-700 transition"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Recent Record</span>
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
          </div>
          {latestPR ? (
            <>
              <p className="text-sm font-bold text-white truncate">{latestPR.exerciseName}</p>
              <span className="text-xs font-mono font-bold text-amber-400 mt-0.5 block">
                {UnitConverter.formatWeight(latestPR.maxWeightKg, profile.unitSystem)}
              </span>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-slate-400">No PRs yet</p>
              <span className="text-[10px] text-slate-500 mt-1 block">Complete a set to record</span>
            </>
          )}
        </div>
      </div>

      {/* QUICK WORKOUT ACTIONS BAR */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onStartWorkout(undefined)}
          className="flex-1 py-3 px-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-750 active:scale-95 transition"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Empty Workout</span>
        </button>
        <button
          onClick={onNavigateToWorkoutTab}
          className="flex-1 py-3 px-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-750 active:scale-95 transition"
        >
          <Dumbbell className="w-4 h-4 text-amber-400" />
          <span>Workout Library</span>
        </button>
      </div>

      {/* Quick Weight Modal */}
      {showWeightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[#13151b] border border-slate-800 p-6 text-slate-100 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Log Today's Body Weight</h3>
            <p className="text-xs text-slate-400 mb-4">
              Consistent morning weigh-ins provide the most accurate trend line.
            </p>
            <div className="relative mb-5">
              <input
                type="number"
                step="0.1"
                value={newWeightInput}
                onChange={(e) => setNewWeightInput(e.target.value)}
                autoFocus
                className="w-full h-12 px-4 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-lg focus:outline-none focus:border-amber-500"
              />
              <span className="absolute right-4 top-3 text-xs font-mono font-bold text-slate-400">
                {profile.unitSystem === 'imperial' ? 'lb' : 'kg'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowWeightModal(false)}
                className="py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWeight}
                className="py-2.5 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400"
              >
                Save Weight
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

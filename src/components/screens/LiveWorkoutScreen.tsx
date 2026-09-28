import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Check,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Info,
  Clock,
  ArrowLeft,
  Flame,
  Award,
  ChevronRight,
  MoreVertical,
  X
} from 'lucide-react';
import {
  WorkoutSession,
  WorkoutExercise,
  WorkoutSet,
  Exercise,
  PersonalRecord,
  PRAchievement,
  UserProfile
} from '../../types';
import { StorageService } from '../../services/storage';
import { SoundEffects } from '../../services/audioFeedback';
import { ProgressionEngine, ExercisePreviousPerformance } from '../../services/progressionEngine';
import { UnitConverter } from '../../utils/unitConverter';
import { RestTimerModal } from '../common/RestTimerModal';
import { PRCelebrationModal } from '../common/PRCelebrationModal';

interface LiveWorkoutScreenProps {
  session: WorkoutSession;
  allExercises: Exercise[];
  allSessions: WorkoutSession[];
  profile: UserProfile;
  onFinishWorkout: (completedSession: WorkoutSession) => void;
  onCancelWorkout: () => void;
  onOpenExerciseLibrary: (onSelect: (exercise: Exercise) => void) => void;
}

export const LiveWorkoutScreen: React.FC<LiveWorkoutScreenProps> = ({
  session: initialSession,
  allExercises,
  allSessions,
  profile,
  onFinishWorkout,
  onCancelWorkout,
  onOpenExerciseLibrary
}) => {
  const [currentSession, setCurrentSession] = useState<WorkoutSession>(initialSession);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(initialSession.durationSeconds || 0);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restSeconds, setRestSeconds] = useState(profile.defaultRestSeconds || 90);
  const [currentPRAlert, setCurrentPRAlert] = useState<PRAchievement | null>(null);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showTips, setShowTips] = useState(false);

  // Auto-save session periodically & update elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        setCurrentSession((curr) => {
          const updated = { ...curr, durationSeconds: next };
          StorageService.saveActiveSession(updated);
          return updated;
        });
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentExerciseEntry = currentSession.exercises[activeExerciseIndex];
  const currentExerciseData = currentExerciseEntry
    ? allExercises.find((e) => e.id === currentExerciseEntry.exerciseId)
    : null;

  // Previous performance lookup for active exercise
  const [previousPerf, setPreviousPerf] = useState<ExercisePreviousPerformance | null>(null);

  useEffect(() => {
    if (currentExerciseEntry) {
      const perf = ProgressionEngine.getPreviousPerformance(
        currentExerciseEntry.exerciseId,
        allSessions
      );
      setPreviousPerf(perf);
    }
  }, [currentExerciseEntry, allSessions]);

  // Format elapsed time (MM:SS or HH:MM:SS)
  const formatElapsedTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Stepper & input update for a specific set
  const updateSet = (
    setIndex: number,
    field: 'completedWeight' | 'completedReps' | 'type',
    value: number | string
  ) => {
    setCurrentSession((prev) => {
      const updatedExercises = [...prev.exercises];
      const ex = { ...updatedExercises[activeExerciseIndex] };
      const sets = [...ex.sets];
      sets[setIndex] = { ...sets[setIndex], [field]: value };
      ex.sets = sets;
      updatedExercises[activeExerciseIndex] = ex;

      const updated = { ...prev, exercises: updatedExercises };
      StorageService.saveActiveSession(updated);
      return updated;
    });
  };

  // Toggle set completion
  const handleToggleCompleteSet = (setIndex: number) => {
    const targetSet = currentExerciseEntry.sets[setIndex];
    const isNowCompleted = !targetSet.isCompleted;

    // Weight to log
    let weightKg = targetSet.completedWeight;
    const reps = targetSet.completedReps;

    if (isNowCompleted) {
      // Audio & vibration
      SoundEffects.playSetComplete(profile.soundEnabled, profile.vibrationEnabled);

      // Check PR
      if (currentExerciseData) {
        const storedPR = StorageService.getPRForExercise(currentExerciseData.id);
        const prAchieved = ProgressionEngine.checkPersonalRecord(
          currentExerciseData.id,
          currentExerciseData.name,
          weightKg,
          reps,
          storedPR
        );

        if (prAchieved) {
          SoundEffects.playPRChime(profile.soundEnabled, profile.vibrationEnabled);
          setCurrentPRAlert(prAchieved);

          // Save new PR record
          const est1RM = ProgressionEngine.calculateEstimated1RM(weightKg, reps);
          StorageService.savePersonalRecord({
            id: `pr_${currentExerciseData.id}`,
            exerciseId: currentExerciseData.id,
            exerciseName: currentExerciseData.name,
            maxWeightKg: Math.max(weightKg, storedPR?.maxWeightKg || 0),
            maxRepsAtWeight: { weightKg, reps },
            estimatedOneRepMaxKg: Math.max(est1RM, storedPR?.estimatedOneRepMaxKg || 0),
            dateAchieved: new Date().toISOString()
          });

          // Add to session prsAchieved
          setCurrentSession((prev) => ({
            ...prev,
            prsAchieved: [...prev.prsAchieved, prAchieved]
          }));
        }
      }

      // Automatically launch Rest Timer
      const targetRest = currentExerciseEntry.targetRestSeconds || profile.defaultRestSeconds || 90;
      setRestSeconds(targetRest);
      setShowRestTimer(true);
    }

    setCurrentSession((prev) => {
      const updatedExercises = [...prev.exercises];
      const ex = { ...updatedExercises[activeExerciseIndex] };
      const sets = [...ex.sets];
      sets[setIndex] = {
        ...sets[setIndex],
        isCompleted: isNowCompleted
      };
      ex.sets = sets;
      updatedExercises[activeExerciseIndex] = ex;

      const updated = { ...prev, exercises: updatedExercises };
      StorageService.saveActiveSession(updated);
      return updated;
    });
  };

  // Add set
  const handleAddSet = () => {
    setCurrentSession((prev) => {
      const updatedExercises = [...prev.exercises];
      const ex = { ...updatedExercises[activeExerciseIndex] };
      const lastSet = ex.sets[ex.sets.length - 1];

      const newSet: WorkoutSet = {
        id: `set_${Date.now()}`,
        setNumber: ex.sets.length + 1,
        type: 'normal',
        targetReps: lastSet ? lastSet.targetReps : 8,
        targetWeight: lastSet ? lastSet.targetWeight : 60,
        completedReps: lastSet ? lastSet.completedReps : 8,
        completedWeight: lastSet ? lastSet.completedWeight : 60,
        isCompleted: false
      };

      ex.sets = [...ex.sets, newSet];
      updatedExercises[activeExerciseIndex] = ex;

      const updated = { ...prev, exercises: updatedExercises };
      StorageService.saveActiveSession(updated);
      return updated;
    });
  };

  // Delete set
  const handleDeleteSet = (setIndex: number) => {
    if (currentExerciseEntry.sets.length <= 1) return;
    setCurrentSession((prev) => {
      const updatedExercises = [...prev.exercises];
      const ex = { ...updatedExercises[activeExerciseIndex] };
      const sets = ex.sets.filter((_, idx) => idx !== setIndex);
      // renumber sets
      ex.sets = sets.map((s, idx) => ({ ...s, setNumber: idx + 1 }));
      updatedExercises[activeExerciseIndex] = ex;

      const updated = { ...prev, exercises: updatedExercises };
      StorageService.saveActiveSession(updated);
      return updated;
    });
  };

  // Add Exercise to Session
  const handleAddExerciseToSession = (exercise: Exercise) => {
    const newWorkoutEx: WorkoutExercise = {
      id: `session_ex_${Date.now()}`,
      exerciseId: exercise.id,
      targetRestSeconds: 90,
      sets: [
        {
          id: `set_${Date.now()}_1`,
          setNumber: 1,
          type: 'normal',
          targetReps: 10,
          targetWeight: 50,
          completedReps: 10,
          completedWeight: 50,
          isCompleted: false
        },
        {
          id: `set_${Date.now()}_2`,
          setNumber: 2,
          type: 'normal',
          targetReps: 10,
          targetWeight: 50,
          completedReps: 10,
          completedWeight: 50,
          isCompleted: false
        },
        {
          id: `set_${Date.now()}_3`,
          setNumber: 3,
          type: 'normal',
          targetReps: 10,
          targetWeight: 50,
          completedReps: 10,
          completedWeight: 50,
          isCompleted: false
        }
      ]
    };

    setCurrentSession((prev) => {
      const updatedExercises = [...prev.exercises, newWorkoutEx];
      const updated = { ...prev, exercises: updatedExercises };
      StorageService.saveActiveSession(updated);
      return updated;
    });
    setActiveExerciseIndex(currentSession.exercises.length);
  };

  // Remove current exercise
  const handleRemoveExercise = () => {
    if (currentSession.exercises.length <= 1) return;
    setCurrentSession((prev) => {
      const updatedExercises = prev.exercises.filter((_, idx) => idx !== activeExerciseIndex);
      const updated = { ...prev, exercises: updatedExercises };
      StorageService.saveActiveSession(updated);
      return updated;
    });
    setActiveExerciseIndex((prev) => Math.max(0, prev - 1));
  };

  // Complete entire workout
  const handleFinish = () => {
    // Calculate total completed volume and sets
    let totalVolume = 0;
    let completedSetsCount = 0;

    currentSession.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.isCompleted) {
          totalVolume += s.completedWeight * s.completedReps;
          completedSetsCount++;
        }
      });
    });

    const finalSession: WorkoutSession = {
      ...currentSession,
      completedAt: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      totalVolumeKg: totalVolume,
      totalSetsCompleted: completedSetsCount,
      isCompleted: true
    };

    StorageService.saveActiveSession(null);
    StorageService.saveSession(finalSession);
    onFinishWorkout(finalSession);
  };

  const handleCancel = () => {
    StorageService.saveActiveSession(null);
    onCancelWorkout();
  };

  // Next exercise and set preview for Rest Timer
  const nextSet = currentExerciseEntry?.sets.find((s) => !s.isCompleted);
  const nextExName = nextSet
    ? currentExerciseData?.name
    : currentSession.exercises[activeExerciseIndex + 1]
    ? allExercises.find((e) => e.id === currentSession.exercises[activeExerciseIndex + 1].exerciseId)?.name
    : 'Workout Finished';

  const progressionSuggestion = currentExerciseData
    ? ProgressionEngine.generateProgressionAdvice(
        currentExerciseData.id,
        currentExerciseEntry?.sets || [],
        previousPerf
      )
    : '';

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between pb-8 max-w-md mx-auto relative select-none">
      {/* SACRED TOP HEADER */}
      <div className="sticky top-0 z-30 bg-[#090a0f]/95 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="p-1.5 -ml-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Cancel Workout"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-sm font-bold text-white truncate max-w-[170px]">
                {currentSession.name}
              </h2>
              <div className="flex items-center gap-2 text-[11px] font-mono text-amber-400 font-semibold">
                <Clock className="w-3 h-3" />
                <span>{formatElapsedTime(elapsedSeconds)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRestTimer(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-semibold hover:bg-slate-700 active:scale-95"
            >
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span>{restSeconds}s</span>
            </button>
            <button
              onClick={() => setShowFinishConfirm(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 text-black text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition"
            >
              FINISH
            </button>
          </div>
        </div>

        {/* EXERCISES HORIZONTAL SCROLLER TABS */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
          {currentSession.exercises.map((ex, idx) => {
            const exData = allExercises.find((e) => e.id === ex.exerciseId);
            const isCurrent = idx === activeExerciseIndex;
            const completedCount = ex.sets.filter((s) => s.isCompleted).length;
            const isAllCompleted = completedCount > 0 && completedCount === ex.sets.length;

            return (
              <button
                key={ex.id || idx}
                onClick={() => setActiveExerciseIndex(idx)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-sm'
                    : isAllCompleted
                    ? 'bg-slate-900 border-emerald-500/40 text-emerald-400'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="truncate max-w-[100px]">{exData?.name || `Exercise ${idx + 1}`}</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {completedCount}/{ex.sets.length}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => onOpenExerciseLibrary(handleAddExerciseToSession)}
            className="flex-shrink-0 px-2.5 py-1.5 rounded-xl border border-dashed border-slate-700 text-slate-400 text-xs font-semibold hover:border-amber-400 hover:text-amber-400 transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* SACRED EXERCISE ACTIVE AREA */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {currentExerciseData ? (
          <div>
            {/* Exercise Header Card */}
            <div className="rounded-2xl bg-[#11131a] border border-slate-800/80 p-4 mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                    {currentExerciseData.category} · {currentExerciseData.equipment}
                  </span>
                  <h1 className="text-xl font-bold font-display text-white mt-0.5">
                    {currentExerciseData.name}
                  </h1>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowTips(!showTips)}
                    className={`p-1.5 rounded-lg border text-xs transition ${
                      showTips
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title="Form Tips"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  {currentSession.exercises.length > 1 && (
                    <button
                      onClick={handleRemoveExercise}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400"
                      title="Remove Exercise"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Collapsible Form Tips */}
              {showTips && (
                <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-1.5 animate-in fade-in">
                  <span className="font-semibold text-amber-400 block">Form Cues:</span>
                  {currentExerciseData.formTips.map((tip, i) => (
                    <p key={i} className="text-slate-400 flex items-start gap-1.5">
                      <span className="text-amber-400">·</span> {tip}
                    </p>
                  ))}
                </div>
              )}

              {/* PREVIOUS PERFORMANCE SNAPSHOT (REQUIREMENT #11) */}
              <div className="mt-3 pt-3 border-t border-slate-800/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Previous Performance
                </span>
                {previousPerf ? (
                  <div className="text-xs text-slate-300">
                    <div className="flex items-center gap-2 flex-wrap font-mono">
                      {previousPerf.sets.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[11px]"
                        >
                          {profile.unitSystem === 'imperial'
                            ? `${UnitConverter.kgToLb(s.weightKg)} lb`
                            : `${s.weightKg} kg`}{' '}
                          × {s.reps}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    First time tracking this movement. Set your baseline load today!
                  </p>
                )}
              </div>

              {/* SMART PROGRESSION SUGGESTION (REQUIREMENT #10) */}
              {progressionSuggestion && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2">
                  <Flame className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200/90 leading-tight">
                    {progressionSuggestion}
                  </p>
                </div>
              )}
            </div>

            {/* SETS TABLE / INPUT ROWS */}
            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-12 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                <span className="col-span-2">Set</span>
                <span className="col-span-4 text-center">
                  Weight ({profile.unitSystem === 'imperial' ? 'lb' : 'kg'})
                </span>
                <span className="col-span-3 text-center">Reps</span>
                <span className="col-span-3 text-right">Log</span>
              </div>

              {currentExerciseEntry.sets.map((set, setIdx) => {
                const isCompleted = set.isCompleted;

                return (
                  <div
                    key={set.id || setIdx}
                    className={`grid grid-cols-12 items-center p-2.5 rounded-2xl border transition ${
                      isCompleted
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                        : 'bg-[#11131a] border-slate-800 text-slate-100'
                    }`}
                  >
                    {/* Set number / type */}
                    <div className="col-span-2 flex items-center gap-1">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-mono font-bold">
                        {set.setNumber}
                      </span>
                    </div>

                    {/* Weight Stepper & Input */}
                    <div className="col-span-4 flex items-center justify-center gap-1">
                      <button
                        onClick={() =>
                          updateSet(
                            setIdx,
                            'completedWeight',
                            Math.max(0, set.completedWeight - 2.5)
                          )
                        }
                        className="w-7 h-8 rounded-lg bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 active:scale-95 flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        step="0.5"
                        value={
                          profile.unitSystem === 'imperial'
                            ? UnitConverter.kgToLb(set.completedWeight)
                            : set.completedWeight
                        }
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const kg =
                            profile.unitSystem === 'imperial' ? UnitConverter.lbToKg(val) : val;
                          updateSet(setIdx, 'completedWeight', kg);
                        }}
                        className="w-14 h-9 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono font-bold text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={() =>
                          updateSet(setIdx, 'completedWeight', set.completedWeight + 2.5)
                        }
                        className="w-7 h-8 rounded-lg bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 active:scale-95 flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>

                    {/* Reps Stepper & Input */}
                    <div className="col-span-3 flex items-center justify-center gap-1">
                      <button
                        onClick={() =>
                          updateSet(setIdx, 'completedReps', Math.max(0, set.completedReps - 1))
                        }
                        className="w-6 h-8 rounded-lg bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 active:scale-95 flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={set.completedReps}
                        onChange={(e) =>
                          updateSet(setIdx, 'completedReps', parseInt(e.target.value) || 0)
                        }
                        className="w-10 h-9 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono font-bold text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={() =>
                          updateSet(setIdx, 'completedReps', set.completedReps + 1)
                        }
                        className="w-6 h-8 rounded-lg bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 active:scale-95 flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>

                    {/* Complete Set Button (Min 44px hitbox) */}
                    <div className="col-span-3 flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleToggleCompleteSet(setIdx)}
                        className={`min-h-[44px] min-w-[44px] px-3 rounded-xl flex items-center justify-center font-bold text-xs transition active:scale-95 ${
                          isCompleted
                            ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                            : 'bg-slate-800 text-slate-300 hover:bg-amber-500 hover:text-black'
                        }`}
                      >
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add Set Button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleAddSet}
                  className="py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:border-slate-700 active:scale-95 transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Add Set</span>
                </button>

                {currentExerciseEntry.sets.length > 1 && (
                  <button
                    onClick={() => handleDeleteSet(currentExerciseEntry.sets.length - 1)}
                    className="py-2 px-3 text-slate-500 hover:text-rose-400 text-xs font-semibold"
                  >
                    Remove Last Set
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">No exercises in this session.</p>
            <button
              onClick={() => onOpenExerciseLibrary(handleAddExerciseToSession)}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs"
            >
              Add Exercise
            </button>
          </div>
        )}
      </div>

      {/* REST TIMER MODAL */}
      <RestTimerModal
        initialSeconds={restSeconds}
        isOpen={showRestTimer}
        onClose={() => setShowRestTimer(false)}
        onFinish={() => setShowRestTimer(false)}
        nextExerciseName={nextExName}
        nextSetNumber={nextSet?.setNumber}
        soundEnabled={profile.soundEnabled}
        vibrationEnabled={profile.vibrationEnabled}
      />

      {/* PR CELEBRATION MODAL */}
      <PRCelebrationModal
        pr={currentPRAlert}
        onDismiss={() => setCurrentPRAlert(null)}
      />

      {/* FINISH WORKOUT CONFIRMATION MODAL */}
      {showFinishConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[#13151b] border border-slate-800 p-6 text-slate-100 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Finish Workout?</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              You’ve logged{' '}
              {currentSession.exercises.reduce(
                (acc, ex) => acc + ex.sets.filter((s) => s.isCompleted).length,
                0
              )}{' '}
              completed sets in {formatElapsedTime(elapsedSeconds)}. Ready to review your summary?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowFinishConfirm(false)}
                className="py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-750"
              >
                Keep Training
              </button>
              <button
                onClick={handleFinish}
                className="py-3 rounded-xl bg-emerald-500 text-black text-xs font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-400"
              >
                Yes, Finish!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL WORKOUT CONFIRMATION MODAL */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[#13151b] border border-slate-800 p-6 text-slate-100 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Cancel Workout?</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Discard this active session? Your sets from this session will not be saved.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-750"
              >
                Stay
              </button>
              <button
                onClick={handleCancel}
                className="py-3 rounded-xl bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-400"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

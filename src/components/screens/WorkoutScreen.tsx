import React, { useState } from 'react';
import {
  Plus,
  Play,
  Dumbbell,
  Clock,
  Layers,
  Copy,
  Edit2,
  Trash2,
  Calendar,
  ChevronRight,
  BookOpen,
  History,
  CheckCircle2
} from 'lucide-react';
import {
  WorkoutTemplate,
  WorkoutSession,
  RoutineSchedule,
  Exercise,
  UserProfile
} from '../../types';
import { StorageService } from '../../services/storage';
import { UnitConverter } from '../../utils/unitConverter';

interface WorkoutScreenProps {
  templates: WorkoutTemplate[];
  sessions: WorkoutSession[];
  routines: RoutineSchedule[];
  activeRoutine?: RoutineSchedule;
  allExercises: Exercise[];
  profile: UserProfile;
  onStartWorkout: (template?: WorkoutTemplate) => void;
  onCreateWorkout: () => void;
  onEditWorkout: (template: WorkoutTemplate) => void;
  onOpenExerciseLibrary: () => void;
  onRefreshData: () => void;
}

export const WorkoutScreen: React.FC<WorkoutScreenProps> = ({
  templates,
  sessions,
  routines,
  activeRoutine,
  allExercises,
  profile,
  onStartWorkout,
  onCreateWorkout,
  onEditWorkout,
  onOpenExerciseLibrary,
  onRefreshData
}) => {
  const [subTab, setSubTab] = useState<'workouts' | 'routines' | 'history'>('workouts');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);
  const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null);
  const [selectedHistorySession, setSelectedHistorySession] = useState<WorkoutSession | null>(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'push', label: 'Push' },
    { id: 'pull', label: 'Pull' },
    { id: 'legs', label: 'Legs' },
    { id: 'full_body', label: 'Full Body' },
    { id: 'custom', label: 'Custom' }
  ];

  const filteredTemplates = templates.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  const handleDuplicate = (template: WorkoutTemplate) => {
    const duplicated: WorkoutTemplate = {
      ...template,
      id: `template_custom_${Date.now()}`,
      name: `${template.name} (Copy)`,
      isPrebuilt: false,
      lastPerformedAt: null
    };
    StorageService.saveTemplate(duplicated);
    onRefreshData();
  };

  const handleDeleteTemplate = (id: string) => {
    StorageService.deleteTemplate(id);
    setDeleteTemplateId(null);
    onRefreshData();
  };

  const handleDeleteSession = (id: string) => {
    StorageService.deleteSession(id);
    setDeleteSessionId(null);
    setSelectedHistorySession(null);
    onRefreshData();
  };

  const handleSelectActiveRoutine = (routineId: string) => {
    StorageService.setActiveRoutine(routineId);
    onRefreshData();
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 pb-28 pt-4 px-4 max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-widest block">
            Training Hub
          </span>
          <h1 className="text-2xl font-extrabold font-display tracking-tight text-white mt-0.5">
            Workout System
          </h1>
        </div>

        <button
          onClick={onOpenExerciseLibrary}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Exercises</span>
        </button>
      </div>

      {/* Segmented SubTabs (Workouts, Routines, History) */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 mb-5">
        <button
          onClick={() => setSubTab('workouts')}
          className={`py-2 text-xs font-bold rounded-xl transition ${
            subTab === 'workouts'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setSubTab('routines')}
          className={`py-2 text-xs font-bold rounded-xl transition ${
            subTab === 'routines'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Routines
        </button>
        <button
          onClick={() => setSubTab('history')}
          className={`py-2 text-xs font-bold rounded-xl transition ${
            subTab === 'history'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          History ({sessions.filter((s) => s.isCompleted).length})
        </button>
      </div>

      {/* SUBTAB 1: WORKOUT TEMPLATES */}
      {subTab === 'workouts' && (
        <div>
          {/* Quick Start Empty Workout & Create Workout Bar */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            <button
              onClick={() => onStartWorkout(undefined)}
              className="py-3 px-3 rounded-2xl bg-amber-500 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:bg-amber-400 active:scale-95 transition"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Quick Empty Start</span>
            </button>
            <button
              onClick={onCreateWorkout}
              className="py-3 px-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-95 transition"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Create Workout</span>
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Templates List */}
          <div className="space-y-3">
            {filteredTemplates.map((template) => {
              return (
                <div
                  key={template.id}
                  className="rounded-2xl bg-[#11131a] border border-slate-800/80 p-4 hover:border-slate-700/80 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                        {template.category}
                      </span>
                      <h3 className="text-base font-bold font-display text-white mt-0.5">
                        {template.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDuplicate(template)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEditWorkout(template)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Edit Workout"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {!template.isPrebuilt && (
                        <button
                          onClick={() => setDeleteTemplateId(template.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1 mb-3">
                    {template.description ||
                      template.exercises
                        .map((ex) => allExercises.find((e) => e.id === ex.exerciseId)?.name)
                        .filter(Boolean)
                        .join(' · ')}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Dumbbell className="w-3.5 h-3.5 text-slate-500" />
                        {template.exercises.length} exercises
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {template.estimatedDurationMin} min
                      </span>
                    </div>

                    <button
                      onClick={() => onStartWorkout(template)}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/10 hover:bg-amber-400 active:scale-95 transition"
                    >
                      <Play className="w-3 h-3 fill-black" />
                      <span>Start</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredTemplates.length === 0 && (
              <div className="text-center py-10 rounded-2xl bg-slate-900/30 border border-slate-800 p-6">
                <p className="text-slate-400 text-xs mb-3">
                  No workouts found in this category.
                </p>
                <button
                  onClick={onCreateWorkout}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold"
                >
                  Create Custom Workout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: ROUTINES & WEEKLY SCHEDULE */}
      {subTab === 'routines' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 mb-2">
            <h3 className="text-sm font-bold text-white mb-1">Weekly Training Routine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Assign workouts to days of the week. IRONMIND automatically cues today's planned routine on your Home screen.
            </p>
          </div>

          {routines.map((routine) => {
            const isActive = routine.id === activeRoutine?.id;
            const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

            return (
              <div
                key={routine.id}
                className={`rounded-2xl border p-4 transition ${
                  isActive
                    ? 'bg-[#11131a] border-amber-500/40 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-900/50 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">{routine.name}</h3>
                    <span className="text-[11px] text-slate-400">
                      {routine.days.filter((d) => d.templateId !== null).length} training days / week
                    </span>
                  </div>

                  {isActive ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-extrabold uppercase">
                      Active Routine
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSelectActiveRoutine(routine.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                    >
                      Make Active
                    </button>
                  )}
                </div>

                {/* Days visualizer */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  {routine.days.map((day) => {
                    const template = day.templateId
                      ? templates.find((t) => t.id === day.templateId)
                      : null;
                    const isRest = !template;

                    return (
                      <div
                        key={day.dayOfWeek}
                        className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-slate-900/70 text-xs"
                      >
                        <span className="font-mono font-bold text-slate-400 w-10">
                          {dayLabels[day.dayOfWeek]}
                        </span>
                        <span
                          className={`flex-1 truncate text-left px-2 font-medium ${
                            isRest ? 'text-slate-500 italic' : 'text-slate-200'
                          }`}
                        >
                          {template ? template.name : 'Rest & Recovery'}
                        </span>
                        {template && (
                          <button
                            onClick={() => onStartWorkout(template)}
                            className="text-[11px] font-bold text-amber-400 hover:text-amber-300"
                          >
                            Start
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUBTAB 3: COMPLETE WORKOUT HISTORY (REQUIREMENT #15) */}
      {subTab === 'history' && (
        <div className="space-y-3">
          {sessions
            .filter((s) => s.isCompleted)
            .map((session) => {
              const dateStr = new Date(session.completedAt || session.startedAt).toLocaleDateString(
                undefined,
                {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                }
              );

              return (
                <div
                  key={session.id}
                  onClick={() => setSelectedHistorySession(session)}
                  className="rounded-2xl bg-[#11131a] border border-slate-800/80 p-4 cursor-pointer hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      {dateStr}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{session.name}</h3>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                    <span>{Math.round(session.durationSeconds / 60)} min</span>
                    <span>·</span>
                    <span>
                      {profile.unitSystem === 'imperial'
                        ? `${UnitConverter.kgToLb(session.totalVolumeKg)} lb`
                        : `${Math.round(session.totalVolumeKg)} kg`}
                    </span>
                    <span>·</span>
                    <span>{session.totalSetsCompleted} sets</span>
                    {session.prsAchieved.length > 0 && (
                      <>
                        <span>·</span>
                        <span className="text-amber-400 font-bold">
                          {session.prsAchieved.length} PRs
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

          {sessions.filter((s) => s.isCompleted).length === 0 && (
            <div className="text-center py-12 rounded-2xl bg-slate-900/30 border border-slate-800 p-6">
              <span className="text-3xl mb-2 block">🏋️</span>
              <h3 className="text-sm font-bold text-white mb-1">No workout history yet</h3>
              <p className="text-xs text-slate-400 mb-4 max-w-xs mx-auto">
                Complete your first workout and every set, rep, and volume figure will appear here.
              </p>
              <button
                onClick={() => onStartWorkout(templates[0])}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-bold shadow-md shadow-amber-500/20 hover:bg-amber-400"
              >
                Start First Workout
              </button>
            </div>
          )}
        </div>
      )}

      {/* SESSION DETAILS MODAL */}
      {selectedHistorySession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#13151b] border border-slate-800 p-6 text-slate-100 shadow-2xl max-h-[85vh] flex flex-col justify-between">
            <div className="overflow-y-auto pr-1">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Session Log
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {selectedHistorySession.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedHistorySession(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900/80 rounded-xl mb-4 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Duration</span>
                  <span className="text-sm font-bold font-mono text-white">
                    {Math.round(selectedHistorySession.durationSeconds / 60)} min
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Volume</span>
                  <span className="text-sm font-bold font-mono text-white">
                    {profile.unitSystem === 'imperial'
                      ? `${UnitConverter.kgToLb(selectedHistorySession.totalVolumeKg)} lb`
                      : `${Math.round(selectedHistorySession.totalVolumeKg)} kg`}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Sets</span>
                  <span className="text-sm font-bold font-mono text-white">
                    {selectedHistorySession.totalSetsCompleted}
                  </span>
                </div>
              </div>

              {/* Exact Sets Completed */}
              <div className="space-y-3 mb-4">
                <h4 className="text-xs font-bold uppercase text-slate-300">Logged Sets</h4>
                {selectedHistorySession.exercises.map((ex, i) => {
                  const exData = allExercises.find((e) => e.id === ex.exerciseId);
                  const completed = ex.sets.filter((s) => s.isCompleted);
                  if (completed.length === 0) return null;

                  return (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-xs font-bold text-slate-200 block mb-1.5">
                        {exData?.name || `Exercise ${i + 1}`}
                      </span>
                      <div className="flex flex-wrap gap-1 font-mono">
                        {completed.map((s, si) => (
                          <span
                            key={si}
                            className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300"
                          >
                            Set {s.setNumber}:{' '}
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

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setDeleteSessionId(selectedHistorySession.id)}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Log
              </button>
              <button
                onClick={() => setSelectedHistorySession(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE SESSION MODAL */}
      {deleteSessionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[#13151b] border border-slate-800 p-6 text-slate-100 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Delete Workout Log?</h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              This will remove this completed workout session and its volume from your history. This action cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDeleteSessionId(null)}
                className="py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSession(deleteSessionId)}
                className="py-2.5 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE TEMPLATE MODAL */}
      {deleteTemplateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[#13151b] border border-slate-800 p-6 text-slate-100 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Delete Workout Template?</h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Are you sure you want to remove this custom workout template?
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDeleteTemplateId(null)}
                className="py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTemplate(deleteTemplateId)}
                className="py-2.5 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

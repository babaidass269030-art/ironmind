import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Dumbbell,
  Clock,
  Save,
  Check
} from 'lucide-react';
import { WorkoutTemplate, WorkoutCategory, Exercise, WorkoutTemplateExercise } from '../../types';
import { StorageService } from '../../services/storage';

interface WorkoutBuilderProps {
  initialTemplate?: WorkoutTemplate | null;
  allExercises: Exercise[];
  onSave: () => void;
  onCancel: () => void;
  onOpenExercisePicker: (onSelect: (exercise: Exercise) => void) => void;
}

export const WorkoutBuilderScreen: React.FC<WorkoutBuilderProps> = ({
  initialTemplate,
  allExercises,
  onSave,
  onCancel,
  onOpenExercisePicker
}) => {
  const isEditing = !!initialTemplate;

  const [name, setName] = useState(initialTemplate?.name || '');
  const [category, setCategory] = useState<WorkoutCategory>(initialTemplate?.category || 'push');
  const [description, setDescription] = useState(initialTemplate?.description || '');
  const [exercises, setExercises] = useState<WorkoutTemplateExercise[]>(
    initialTemplate?.exercises || []
  );
  const [estimatedDuration, setEstimatedDuration] = useState(
    initialTemplate?.estimatedDurationMin || 50
  );
  const [errorMessage, setErrorMessage] = useState('');

  const categories: { id: WorkoutCategory; label: string }[] = [
    { id: 'push', label: 'Push' },
    { id: 'pull', label: 'Pull' },
    { id: 'legs', label: 'Legs' },
    { id: 'upper', label: 'Upper' },
    { id: 'lower', label: 'Lower' },
    { id: 'full_body', label: 'Full Body' },
    { id: 'chest', label: 'Chest' },
    { id: 'back', label: 'Back' },
    { id: 'shoulders', label: 'Shoulders' },
    { id: 'arms', label: 'Arms' },
    { id: 'custom', label: 'Custom' }
  ];

  const handleAddExercise = (exercise: Exercise) => {
    // Prevent duplicate exercises if already present
    if (exercises.some((e) => e.exerciseId === exercise.id)) {
      return;
    }

    const newEntry: WorkoutTemplateExercise = {
      exerciseId: exercise.id,
      defaultSets: 3,
      defaultReps: exercise.recommendedReps || '8-12',
      restSeconds: 90,
      notes: ''
    };

    const updated = [...exercises, newEntry];
    setExercises(updated);
    // Auto estimate duration ~ 10-12 mins per exercise
    setEstimatedDuration(Math.max(25, updated.length * 10));
  };

  const handleRemoveExercise = (index: number) => {
    const updated = exercises.filter((_, i) => i !== index);
    setExercises(updated);
    setEstimatedDuration(Math.max(20, updated.length * 10));
  };

  const handleMoveExercise = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === exercises.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...exercises];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setExercises(updated);
  };

  const handleUpdateExercise = (
    index: number,
    field: keyof WorkoutTemplateExercise,
    value: unknown
  ) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const handleSave = () => {
    if (!name.trim()) {
      setErrorMessage('Please enter a workout title.');
      return;
    }
    if (exercises.length === 0) {
      setErrorMessage('Please add at least one exercise.');
      return;
    }

    const template: WorkoutTemplate = {
      id: initialTemplate?.id || `template_custom_${Date.now()}`,
      name: name.trim(),
      category,
      description: description.trim() || undefined,
      exercises,
      estimatedDurationMin: estimatedDuration,
      isPrebuilt: initialTemplate?.isPrebuilt || false,
      lastPerformedAt: initialTemplate?.lastPerformedAt || null
    };

    StorageService.saveTemplate(template);
    onSave();
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 p-4 max-w-md mx-auto pb-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <button
          onClick={onCancel}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel</span>
        </button>
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          {isEditing ? 'Edit Workout' : 'New Workout'}
        </h2>
        <button
          onClick={handleSave}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 active:scale-95 transition"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300">
          {errorMessage}
        </div>
      )}

      {/* Main Details */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
            Workout Title
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrorMessage('');
            }}
            placeholder="e.g. Heavy Upper Power"
            className="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Category Pills */}
        <div>
          <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Category
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  category === cat.id
                    ? 'bg-amber-500 text-black shadow'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
            Description or Focus Notes
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Focus on explosive concentric pressing"
            className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Exercises Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Exercises ({exercises.length})
          </span>
          <button
            type="button"
            onClick={() => onOpenExercisePicker(handleAddExercise)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/20 active:scale-95 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Exercise</span>
          </button>
        </div>

        <div className="space-y-3">
          {exercises.map((entry, idx) => {
            const exData = allExercises.find((e) => e.id === entry.exerciseId);

            return (
              <div
                key={entry.exerciseId}
                className="rounded-2xl bg-[#11131a] border border-slate-800 p-3.5 space-y-3"
              >
                {/* Exercise top row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-mono font-bold text-slate-400 flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-white truncate max-w-[190px]">
                      {exData?.name || 'Exercise'}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveExercise(idx, 'up')}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === exercises.length - 1}
                      onClick={() => handleMoveExercise(idx, 'down')}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(idx)}
                      className="p-1 text-slate-400 hover:text-rose-400 ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Target Sets, Reps, Rest Config */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/80">
                  <div>
                    <label className="text-[10px] text-slate-400 block uppercase">Sets</label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={entry.defaultSets}
                      onChange={(e) =>
                        handleUpdateExercise(idx, 'defaultSets', parseInt(e.target.value) || 3)
                      }
                      className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono font-bold text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block uppercase">Reps</label>
                    <input
                      type="text"
                      value={entry.defaultReps}
                      onChange={(e) => handleUpdateExercise(idx, 'defaultReps', e.target.value)}
                      placeholder="8-12"
                      className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono font-bold text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block uppercase">Rest (s)</label>
                    <input
                      type="number"
                      step="15"
                      min="30"
                      max="300"
                      value={entry.restSeconds}
                      onChange={(e) =>
                        handleUpdateExercise(idx, 'restSeconds', parseInt(e.target.value) || 90)
                      }
                      className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono font-bold text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {exercises.length === 0 && (
            <div
              onClick={() => onOpenExercisePicker(handleAddExercise)}
              className="py-10 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-slate-700 transition"
            >
              <Dumbbell className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-xs font-semibold text-slate-300">No exercises added yet</p>
              <span className="text-[11px] text-amber-400 mt-1">+ Tap to browse Exercise Library</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

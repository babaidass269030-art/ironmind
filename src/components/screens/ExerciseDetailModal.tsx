import React from 'react';
import { X, Star, Dumbbell, ShieldAlert, Award, Layers } from 'lucide-react';
import { Exercise, PersonalRecord, UserProfile } from '../../types';
import { UnitConverter } from '../../utils/unitConverter';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  pr?: PersonalRecord;
  profile: UserProfile;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
  onSelectExercise?: (exercise: Exercise) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  pr,
  profile,
  isFavorite,
  onToggleFavorite,
  onClose,
  onSelectExercise
}) => {
  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-[#11131a] border border-slate-800 p-6 text-slate-100 shadow-2xl max-h-[88vh] flex flex-col justify-between overflow-hidden">
        <div className="overflow-y-auto pr-1">
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-slate-800 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                  {exercise.category} · {exercise.equipment}
                </span>
                <span className="text-[10px] text-slate-400 capitalize">
                  ({exercise.difficulty})
                </span>
              </div>
              <h2 className="text-xl font-bold font-display text-white">
                {exercise.name}
              </h2>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onToggleFavorite}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800"
                title="Favorite"
              >
                <Star
                  className={`w-5 h-5 ${
                    isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'
                  }`}
                />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Personal Record Banner if achieved */}
          {pr && (
            <div className="p-3 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 block">
                    Your Personal Record
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    {UnitConverter.formatWeight(pr.maxWeightKg, profile.unitSystem)} · Est. 1RM:{' '}
                    {UnitConverter.formatWeight(pr.estimatedOneRepMaxKg, profile.unitSystem)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Target Muscles */}
          <div className="mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Target Anatomy
            </span>
            <div className="text-xs space-y-1">
              <p className="text-slate-200">
                <strong className="text-amber-400">Primary:</strong> {exercise.primaryMuscle}
              </p>
              {exercise.secondaryMuscles.length > 0 && (
                <p className="text-slate-400">
                  <strong>Secondary:</strong> {exercise.secondaryMuscles.join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* Execution Instructions */}
          <div className="mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Step-by-Step Instructions
            </span>
            <ol className="text-xs text-slate-300 space-y-2 list-decimal pl-4 leading-relaxed">
              {exercise.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Form & Safety Cues */}
          {exercise.formTips.length > 0 && (
            <div className="mb-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
                <ShieldAlert className="w-3.5 h-3.5" />
                Form & Safety Cues
              </span>
              <ul className="text-xs text-slate-300 space-y-1.5">
                {exercise.formTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">·</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommended Range */}
          <div className="text-xs text-slate-400 pb-2">
            <span>Recommended Hypertrophy Target: </span>
            <strong className="text-white font-mono">{exercise.recommendedReps} reps</strong>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-3 border-t border-slate-800 mt-2">
          {onSelectExercise ? (
            <button
              onClick={() => {
                onSelectExercise(exercise);
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-amber-500 text-black text-xs font-bold shadow-md shadow-amber-500/20 hover:bg-amber-400"
            >
              Add to Workout
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

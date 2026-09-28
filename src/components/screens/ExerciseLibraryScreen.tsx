import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Star,
  Dumbbell,
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Exercise, MuscleCategory, EquipmentType, UserProfile } from '../../types';
import { StorageService } from '../../services/storage';
import { ExerciseDetailModal } from './ExerciseDetailModal';

interface ExerciseLibraryScreenProps {
  allExercises: Exercise[];
  favorites: string[];
  profile: UserProfile;
  onClose: () => void;
  onSelectExercise?: (exercise: Exercise) => void;
  onRefreshData: () => void;
}

export const ExerciseLibraryScreen: React.FC<ExerciseLibraryScreenProps> = ({
  allExercises,
  favorites,
  profile,
  onClose,
  onSelectExercise,
  onRefreshData
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [inspectExercise, setInspectExercise] = useState<Exercise | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Custom Exercise state
  const [newExName, setNewExName] = useState('');
  const [newExCategory, setNewExCategory] = useState<MuscleCategory>('chest');
  const [newExEquipment, setNewExEquipment] = useState<EquipmentType>('dumbbell');
  const [newExPrimaryMuscle, setNewExPrimaryMuscle] = useState('');
  const [newExInstructions, setNewExInstructions] = useState('');

  const muscleCategories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Muscles' },
    { id: 'chest', label: 'Chest' },
    { id: 'back', label: 'Back' },
    { id: 'shoulders', label: 'Shoulders' },
    { id: 'biceps', label: 'Biceps' },
    { id: 'triceps', label: 'Triceps' },
    { id: 'legs', label: 'Legs' },
    { id: 'calves', label: 'Calves' },
    { id: 'core', label: 'Core' }
  ];

  const equipmentList: { id: string; label: string }[] = [
    { id: 'all', label: 'All Equipment' },
    { id: 'barbell', label: 'Barbell' },
    { id: 'dumbbell', label: 'Dumbbell' },
    { id: 'cable', label: 'Cable' },
    { id: 'machine', label: 'Machine' },
    { id: 'bodyweight', label: 'Bodyweight' }
  ];

  const filteredExercises = allExercises.filter((ex) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ex.name.toLowerCase().includes(q);
      const matchMuscle = ex.primaryMuscle.toLowerCase().includes(q);
      const matchCat = ex.category.toLowerCase().includes(q);
      const matchEquip = ex.equipment.toLowerCase().includes(q);
      if (!matchName && !matchMuscle && !matchCat && !matchEquip) return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && ex.category !== selectedCategory) {
      return false;
    }

    // Equipment filter
    if (selectedEquipment !== 'all' && ex.equipment !== selectedEquipment) {
      return false;
    }

    // Favorites
    if (showFavoritesOnly && !favorites.includes(ex.id)) {
      return false;
    }

    return true;
  });

  const handleToggleFavorite = (exerciseId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    StorageService.toggleFavorite(exerciseId);
    onRefreshData();
  };

  const handleCreateCustomExercise = () => {
    if (!newExName.trim()) return;

    const newEx: Exercise = {
      id: `custom_ex_${Date.now()}`,
      name: newExName.trim(),
      category: newExCategory,
      primaryMuscle: newExPrimaryMuscle.trim() || newExCategory,
      secondaryMuscles: [],
      equipment: newExEquipment,
      difficulty: 'intermediate',
      recommendedReps: '8-12',
      instructions: newExInstructions.trim()
        ? [newExInstructions.trim()]
        : ['Execute with controlled eccentric and focused contraction.'],
      formTips: ['Keep joints stacked and core stabilized.'],
      isCustom: true
    };

    StorageService.saveCustomExercise(newEx);
    setShowCreateModal(false);
    setNewExName('');
    setNewExPrimaryMuscle('');
    setNewExInstructions('');
    onRefreshData();
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 p-4 max-w-md mx-auto pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h1 className="text-sm font-bold text-white uppercase tracking-wider">
          Exercise Library
        </h1>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/20 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by exercise, muscle, or equipment..."
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
        />
      </div>

      {/* Muscle Categories Horizontal Scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar">
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            showFavoritesOnly
              ? 'bg-amber-500 text-black shadow'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-black' : ''}`} />
          <span>Favorites</span>
        </button>

        {muscleCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-black shadow'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Equipment Selector Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 no-scrollbar">
        {equipmentList.map((eq) => (
          <button
            key={eq.id}
            onClick={() => setSelectedEquipment(eq.id)}
            className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
              selectedEquipment === eq.id
                ? 'bg-slate-800 text-amber-400 font-bold border border-slate-700'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {eq.label}
          </button>
        ))}
      </div>

      {/* Exercises List */}
      <div className="space-y-2.5">
        {filteredExercises.map((exercise) => {
          const isFav = favorites.includes(exercise.id);
          const pr = StorageService.getPRForExercise(exercise.id);

          return (
            <div
              key={exercise.id}
              onClick={() => {
                if (onSelectExercise) {
                  onSelectExercise(exercise);
                  onClose();
                } else {
                  setInspectExercise(exercise);
                }
              }}
              className="rounded-2xl bg-[#11131a] border border-slate-800/80 p-3.5 flex items-center justify-between hover:border-slate-700 active:scale-[0.99] transition cursor-pointer"
            >
              <div className="flex-1 min-w-0 pr-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    {exercise.category} · {exercise.equipment}
                  </span>
                  {exercise.isCustom && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                      Custom
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white truncate mt-0.5">
                  {exercise.name}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                  <span className="truncate">{exercise.primaryMuscle}</span>
                  {pr && (
                    <>
                      <span>·</span>
                      <span className="text-amber-400 font-mono font-semibold">
                        PR: {pr.maxWeightKg} kg
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => handleToggleFavorite(exercise.id, e)}
                  className="p-2 rounded-xl text-slate-500 hover:text-amber-400 hover:bg-slate-800"
                >
                  <Star
                    className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`}
                  />
                </button>
                {onSelectExercise ? (
                  <span className="px-3 py-1.5 rounded-xl bg-amber-500 text-black text-xs font-bold">
                    Select
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                )}
              </div>
            </div>
          );
        })}

        {filteredExercises.length === 0 && (
          <div className="text-center py-12 rounded-2xl bg-slate-900/30 border border-slate-800 p-6">
            <p className="text-slate-400 text-xs mb-3">No matching exercises found.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold"
            >
              Create Custom Exercise
            </button>
          </div>
        )}
      </div>

      {/* Inspect Detail Modal */}
      <ExerciseDetailModal
        exercise={inspectExercise}
        pr={inspectExercise ? StorageService.getPRForExercise(inspectExercise.id) : undefined}
        profile={profile}
        isFavorite={inspectExercise ? favorites.includes(inspectExercise.id) : false}
        onToggleFavorite={() => {
          if (inspectExercise) handleToggleFavorite(inspectExercise.id);
        }}
        onClose={() => setInspectExercise(null)}
        onSelectExercise={onSelectExercise}
      />

      {/* CREATE CUSTOM EXERCISE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#11131a] border border-slate-800 p-6 text-slate-100 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Create Custom Exercise</h3>
            <p className="text-xs text-slate-400 mb-4">
              Add your unique movements to track custom weights and PRs.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-[10px] font-semibold text-slate-300 uppercase block mb-1">
                  Exercise Name
                </label>
                <input
                  type="text"
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  placeholder="e.g. Bulgarian Split Squat"
                  className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-300 uppercase block mb-1">
                    Muscle Group
                  </label>
                  <select
                    value={newExCategory}
                    onChange={(e) => setNewExCategory(e.target.value as MuscleCategory)}
                    className="w-full h-10 px-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="chest">Chest</option>
                    <option value="back">Back</option>
                    <option value="shoulders">Shoulders</option>
                    <option value="biceps">Biceps</option>
                    <option value="triceps">Triceps</option>
                    <option value="legs">Legs</option>
                    <option value="calves">Calves</option>
                    <option value="core">Core</option>
                    <option value="full_body">Full Body</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-300 uppercase block mb-1">
                    Equipment
                  </label>
                  <select
                    value={newExEquipment}
                    onChange={(e) => setNewExEquipment(e.target.value as EquipmentType)}
                    className="w-full h-10 px-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="barbell">Barbell</option>
                    <option value="dumbbell">Dumbbell</option>
                    <option value="cable">Cable</option>
                    <option value="machine">Machine</option>
                    <option value="bodyweight">Bodyweight</option>
                    <option value="kettlebell">Kettlebell</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-300 uppercase block mb-1">
                  Primary Muscle Target
                </label>
                <input
                  type="text"
                  value={newExPrimaryMuscle}
                  onChange={(e) => setNewExPrimaryMuscle(e.target.value)}
                  placeholder="e.g. Quadriceps / Glutes"
                  className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-300 uppercase block mb-1">
                  Instructions / Cues (Optional)
                </label>
                <textarea
                  value={newExInstructions}
                  onChange={(e) => setNewExInstructions(e.target.value)}
                  rows={2}
                  placeholder="e.g. Keep front shin vertical and control knee descent..."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustomExercise}
                disabled={!newExName.trim()}
                className="py-2.5 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 disabled:opacity-50"
              >
                Save Exercise
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

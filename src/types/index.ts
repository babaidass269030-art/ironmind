export type MuscleCategory =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'glutes'
  | 'calves'
  | 'core'
  | 'full_body';

export type EquipmentType =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'kettlebell'
  | 'other';

export type WorkoutCategory =
  | 'push'
  | 'pull'
  | 'legs'
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'arms'
  | 'full_body'
  | 'upper'
  | 'lower'
  | 'custom';

export type FitnessGoal =
  | 'build_muscle'
  | 'lose_fat'
  | 'get_stronger'
  | 'improve_fitness'
  | 'maintain'
  | 'general_health'
  | 'custom';

export interface UserProfile {
  id: string;
  name: string;
  age: number | null;
  heightCm: number;
  weightKg: number;
  unitSystem: 'metric' | 'imperial';
  goal: FitnessGoal;
  customGoalTitle?: string;
  customGoalCurrent?: number;
  customGoalTarget?: number;
  customGoalUnit?: string;
  weeklyWorkoutTarget: number;
  defaultRestSeconds: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  theme: 'dark' | 'light' | 'system';
  hasCompletedOnboarding: boolean;
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: MuscleCategory;
  primaryMuscle: string;
  secondaryMuscles: string[];
  equipment: EquipmentType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  recommendedReps: string;
  instructions: string[];
  formTips: string[];
  isCustom?: boolean;
  isFavorite?: boolean;
}

export interface WorkoutSet {
  id: string;
  setNumber: number;
  type: 'warmup' | 'normal' | 'dropset' | 'failure';
  targetReps: number;
  targetWeight: number;
  completedReps: number;
  completedWeight: number;
  isCompleted: boolean;
  rpe?: number;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  notes?: string;
  targetRestSeconds: number;
  sets: WorkoutSet[];
}

export interface WorkoutTemplateExercise {
  exerciseId: string;
  defaultSets: number;
  defaultReps: string;
  restSeconds: number;
  notes?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  category: WorkoutCategory;
  description?: string;
  exercises: WorkoutTemplateExercise[];
  estimatedDurationMin: number;
  isPrebuilt?: boolean;
  lastPerformedAt?: string | null;
}

export interface PRAchievement {
  exerciseId: string;
  exerciseName: string;
  type: 'weight' | 'reps' | '1rm';
  value: number;
  previousValue?: number;
  unit: string;
}

export interface WorkoutSession {
  id: string;
  templateId?: string;
  name: string;
  startedAt: string;
  completedAt?: string;
  durationSeconds: number;
  exercises: WorkoutExercise[];
  notes?: string;
  totalVolumeKg: number;
  totalSetsCompleted: number;
  prsAchieved: PRAchievement[];
  isCompleted: boolean;
}

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  exerciseName: string;
  maxWeightKg: number;
  maxRepsAtWeight: { weightKg: number; reps: number };
  estimatedOneRepMaxKg: number;
  dateAchieved: string;
}

export interface BodyMeasurementLog {
  id: string;
  date: string;
  weightKg: number;
  bodyFatPercentage?: number | null;
  chestCm?: number | null;
  waistCm?: number | null;
  armsCm?: number | null;
  thighsCm?: number | null;
  shouldersCm?: number | null;
  hipsCm?: number | null;
  notes?: string;
}

export interface RoutineDay {
  dayOfWeek: number; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  templateId: string | null; // null = Rest Day
  customLabel?: string;
}

export interface RoutineSchedule {
  id: string;
  name: string;
  days: RoutineDay[];
  isActive: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badge: string;
  tier: 'bronze' | 'silver' | 'gold' | 'iron';
  isUnlocked: boolean;
  unlockedAt?: string | null;
  currentValue: number;
  targetValue: number;
  unit?: string;
}

export interface AppDataBackup {
  app: 'IRONMIND';
  backupVersion: number;
  exportedAt: string;
  data: {
    profile: UserProfile;
    customExercises: Exercise[];
    favoriteExerciseIds: string[];
    templates: WorkoutTemplate[];
    sessions: WorkoutSession[];
    personalRecords: PersonalRecord[];
    bodyMeasurements: BodyMeasurementLog[];
    routines: RoutineSchedule[];
    achievements: Achievement[];
    activeSession: WorkoutSession | null;
  };
}

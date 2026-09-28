import {
  UserProfile,
  Exercise,
  WorkoutTemplate,
  WorkoutSession,
  PersonalRecord,
  BodyMeasurementLog,
  RoutineSchedule,
  Achievement,
  AppDataBackup
} from '../types';
import { DEFAULT_EXERCISES } from '../data/defaultExercises';
import { DEFAULT_WORKOUT_TEMPLATES } from '../data/defaultWorkouts';
import { INITIAL_ACHIEVEMENTS } from '../data/defaultAchievements';
import { DEFAULT_ROUTINES } from '../data/defaultRoutines';

const STORAGE_KEYS = {
  PROFILE: 'ironmind_profile',
  CUSTOM_EXERCISES: 'ironmind_custom_exercises',
  FAVORITES: 'ironmind_favorites',
  TEMPLATES: 'ironmind_templates',
  SESSIONS: 'ironmind_sessions',
  PRS: 'ironmind_prs',
  MEASUREMENTS: 'ironmind_measurements',
  ROUTINES: 'ironmind_routines',
  ACHIEVEMENTS: 'ironmind_achievements',
  ACTIVE_SESSION: 'ironmind_active_session',
  REST_TIMER_STATE: 'ironmind_rest_timer'
};

const DEFAULT_PROFILE: UserProfile = {
  id: 'user_main',
  name: '',
  age: 26,
  heightCm: 178,
  weightKg: 75,
  unitSystem: 'metric',
  goal: 'build_muscle',
  weeklyWorkoutTarget: 4,
  defaultRestSeconds: 90,
  soundEnabled: true,
  vibrationEnabled: true,
  theme: 'dark',
  hasCompletedOnboarding: false,
  createdAt: new Date().toISOString()
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Error writing to localStorage key "${key}":`, err);
    return false;
  }
}

export const StorageService = {
  // PROFILE
  getProfile(): UserProfile {
    return safeGet<UserProfile>(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
  },
  saveProfile(profile: UserProfile): void {
    safeSet(STORAGE_KEYS.PROFILE, profile);
  },

  // EXERCISES
  getAllExercises(): Exercise[] {
    const custom = safeGet<Exercise[]>(STORAGE_KEYS.CUSTOM_EXERCISES, []);
    const favorites = new Set(safeGet<string[]>(STORAGE_KEYS.FAVORITES, []));

    const combined = [...DEFAULT_EXERCISES, ...custom];
    return combined.map((ex) => ({
      ...ex,
      isFavorite: favorites.has(ex.id)
    }));
  },

  getCustomExercises(): Exercise[] {
    return safeGet<Exercise[]>(STORAGE_KEYS.CUSTOM_EXERCISES, []);
  },

  saveCustomExercise(exercise: Exercise): void {
    const custom = safeGet<Exercise[]>(STORAGE_KEYS.CUSTOM_EXERCISES, []);
    const index = custom.findIndex((e) => e.id === exercise.id);
    if (index >= 0) {
      custom[index] = { ...exercise, isCustom: true };
    } else {
      custom.push({ ...exercise, isCustom: true });
    }
    safeSet(STORAGE_KEYS.CUSTOM_EXERCISES, custom);
  },

  deleteCustomExercise(exerciseId: string): void {
    const custom = safeGet<Exercise[]>(STORAGE_KEYS.CUSTOM_EXERCISES, []);
    safeSet(
      STORAGE_KEYS.CUSTOM_EXERCISES,
      custom.filter((e) => e.id !== exerciseId)
    );
  },

  // FAVORITES
  getFavorites(): string[] {
    return safeGet<string[]>(STORAGE_KEYS.FAVORITES, []);
  },

  toggleFavorite(exerciseId: string): boolean {
    const current = safeGet<string[]>(STORAGE_KEYS.FAVORITES, []);
    let updated: string[];
    let isNowFavorite = false;
    if (current.includes(exerciseId)) {
      updated = current.filter((id) => id !== exerciseId);
    } else {
      updated = [...current, exerciseId];
      isNowFavorite = true;
    }
    safeSet(STORAGE_KEYS.FAVORITES, updated);
    return isNowFavorite;
  },

  // TEMPLATES
  getTemplates(): WorkoutTemplate[] {
    return safeGet<WorkoutTemplate[]>(STORAGE_KEYS.TEMPLATES, DEFAULT_WORKOUT_TEMPLATES);
  },

  saveTemplate(template: WorkoutTemplate): void {
    const templates = this.getTemplates();
    const index = templates.findIndex((t) => t.id === template.id);
    if (index >= 0) {
      templates[index] = template;
    } else {
      templates.push(template);
    }
    safeSet(STORAGE_KEYS.TEMPLATES, templates);
  },

  deleteTemplate(templateId: string): void {
    const templates = this.getTemplates().filter((t) => t.id !== templateId);
    safeSet(STORAGE_KEYS.TEMPLATES, templates);
  },

  // SESSIONS (WORKOUT HISTORY)
  getSessions(): WorkoutSession[] {
    return safeGet<WorkoutSession[]>(STORAGE_KEYS.SESSIONS, []);
  },

  saveSession(session: WorkoutSession): void {
    const sessions = this.getSessions();
    const index = sessions.findIndex((s) => s.id === session.id);
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.unshift(session); // most recent first
    }
    safeSet(STORAGE_KEYS.SESSIONS, sessions);

    // Update template's lastPerformedAt
    if (session.templateId) {
      const templates = this.getTemplates();
      const tIndex = templates.findIndex((t) => t.id === session.templateId);
      if (tIndex >= 0) {
        templates[tIndex].lastPerformedAt = session.completedAt || new Date().toISOString();
        safeSet(STORAGE_KEYS.TEMPLATES, templates);
      }
    }

    // Refresh achievements progress
    this.evaluateAchievements();
  },

  deleteSession(sessionId: string): void {
    const sessions = this.getSessions().filter((s) => s.id !== sessionId);
    safeSet(STORAGE_KEYS.SESSIONS, sessions);
    this.evaluateAchievements();
  },

  // ACTIVE WORKOUT PERSISTENCE
  getActiveSession(): WorkoutSession | null {
    return safeGet<WorkoutSession | null>(STORAGE_KEYS.ACTIVE_SESSION, null);
  },

  saveActiveSession(session: WorkoutSession | null): void {
    if (session === null) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    } else {
      safeSet(STORAGE_KEYS.ACTIVE_SESSION, session);
    }
  },

  // PERSONAL RECORDS (PRs)
  getPersonalRecords(): PersonalRecord[] {
    return safeGet<PersonalRecord[]>(STORAGE_KEYS.PRS, []);
  },

  getPRForExercise(exerciseId: string): PersonalRecord | undefined {
    return this.getPersonalRecords().find((pr) => pr.exerciseId === exerciseId);
  },

  savePersonalRecord(pr: PersonalRecord): void {
    const prs = this.getPersonalRecords();
    const index = prs.findIndex((p) => p.exerciseId === pr.exerciseId);
    if (index >= 0) {
      prs[index] = pr;
    } else {
      prs.push(pr);
    }
    safeSet(STORAGE_KEYS.PRS, prs);
    this.evaluateAchievements();
  },

  // BODY MEASUREMENTS
  getBodyMeasurements(): BodyMeasurementLog[] {
    const measurements = safeGet<BodyMeasurementLog[]>(STORAGE_KEYS.MEASUREMENTS, []);
    // sort by date desc
    return measurements.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  saveBodyMeasurement(log: BodyMeasurementLog): void {
    const measurements = safeGet<BodyMeasurementLog[]>(STORAGE_KEYS.MEASUREMENTS, []);
    const index = measurements.findIndex((m) => m.id === log.id);
    if (index >= 0) {
      measurements[index] = log;
    } else {
      measurements.push(log);
    }
    safeSet(STORAGE_KEYS.MEASUREMENTS, measurements);

    // Also update profile weight if modern
    const profile = this.getProfile();
    profile.weightKg = log.weightKg;
    this.saveProfile(profile);
  },

  deleteBodyMeasurement(id: string): void {
    const measurements = safeGet<BodyMeasurementLog[]>(STORAGE_KEYS.MEASUREMENTS, []).filter(
      (m) => m.id !== id
    );
    safeSet(STORAGE_KEYS.MEASUREMENTS, measurements);
  },

  // ROUTINES
  getRoutines(): RoutineSchedule[] {
    return safeGet<RoutineSchedule[]>(STORAGE_KEYS.ROUTINES, DEFAULT_ROUTINES);
  },

  getActiveRoutine(): RoutineSchedule | undefined {
    const routines = this.getRoutines();
    return routines.find((r) => r.isActive) || routines[0];
  },

  saveRoutine(routine: RoutineSchedule): void {
    const routines = this.getRoutines();
    const index = routines.findIndex((r) => r.id === routine.id);
    if (index >= 0) {
      routines[index] = routine;
    } else {
      routines.push(routine);
    }
    safeSet(STORAGE_KEYS.ROUTINES, routines);
  },

  setActiveRoutine(routineId: string): void {
    const routines = this.getRoutines().map((r) => ({
      ...r,
      isActive: r.id === routineId
    }));
    safeSet(STORAGE_KEYS.ROUTINES, routines);
  },

  // ACHIEVEMENTS
  getAchievements(): Achievement[] {
    return safeGet<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, INITIAL_ACHIEVEMENTS);
  },

  evaluateAchievements(): void {
    const sessions = this.getSessions().filter((s) => s.isCompleted);
    const prs = this.getPersonalRecords();
    const totalVolume = sessions.reduce((acc, s) => acc + (s.totalVolumeKg || 0), 0);
    const workoutCount = sessions.length;
    const prCount = prs.length;

    const achievements = this.getAchievements();
    let updated = false;

    achievements.forEach((ach) => {
      let progress = 0;
      if (ach.id.includes('workout')) {
        progress = workoutCount;
      } else if (ach.id.includes('pr')) {
        progress = prCount;
      } else if (ach.id.includes('volume')) {
        progress = totalVolume;
      }

      ach.currentValue = progress;
      if (!ach.isUnlocked && progress >= ach.targetValue) {
        ach.isUnlocked = true;
        ach.unlockedAt = new Date().toISOString();
        updated = true;
      }
    });

    if (updated || true) {
      safeSet(STORAGE_KEYS.ACHIEVEMENTS, achievements);
    }
  },

  // BACKUP & RESTORE
  exportBackupData(): string {
    const backup: AppDataBackup = {
      app: 'IRONMIND',
      backupVersion: 1,
      exportedAt: new Date().toISOString(),
      data: {
        profile: this.getProfile(),
        customExercises: this.getCustomExercises(),
        favoriteExerciseIds: this.getFavorites(),
        templates: this.getTemplates(),
        sessions: this.getSessions(),
        personalRecords: this.getPersonalRecords(),
        bodyMeasurements: this.getBodyMeasurements(),
        routines: this.getRoutines(),
        achievements: this.getAchievements(),
        activeSession: this.getActiveSession()
      }
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackupData(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString) as AppDataBackup;
      if (!parsed || parsed.app !== 'IRONMIND' || !parsed.data) {
        return {
          success: false,
          message: 'Invalid backup file format. Expected IRONMIND backup payload.'
        };
      }

      const { data } = parsed;
      if (data.profile) safeSet(STORAGE_KEYS.PROFILE, data.profile);
      if (Array.isArray(data.customExercises)) safeSet(STORAGE_KEYS.CUSTOM_EXERCISES, data.customExercises);
      if (Array.isArray(data.favoriteExerciseIds)) safeSet(STORAGE_KEYS.FAVORITES, data.favoriteExerciseIds);
      if (Array.isArray(data.templates)) safeSet(STORAGE_KEYS.TEMPLATES, data.templates);
      if (Array.isArray(data.sessions)) safeSet(STORAGE_KEYS.SESSIONS, data.sessions);
      if (Array.isArray(data.personalRecords)) safeSet(STORAGE_KEYS.PRS, data.personalRecords);
      if (Array.isArray(data.bodyMeasurements)) safeSet(STORAGE_KEYS.MEASUREMENTS, data.bodyMeasurements);
      if (Array.isArray(data.routines)) safeSet(STORAGE_KEYS.ROUTINES, data.routines);
      if (Array.isArray(data.achievements)) safeSet(STORAGE_KEYS.ACHIEVEMENTS, data.achievements);
      if (data.activeSession !== undefined) safeSet(STORAGE_KEYS.ACTIVE_SESSION, data.activeSession);

      return { success: true, message: 'All fitness records successfully restored.' };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown parsing error';
      return { success: false, message: `Failed to import data: ${errorMsg}` };
    }
  },

  resetAllData(): void {
    localStorage.clear();
  }
};

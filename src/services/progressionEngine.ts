import { WorkoutSession, WorkoutSet, PersonalRecord, PRAchievement } from '../types';

export interface ExercisePreviousPerformance {
  lastSessionDate: string;
  workoutName: string;
  sets: {
    setNumber: number;
    weightKg: number;
    reps: number;
    type: string;
  }[];
  bestSet: {
    weightKg: number;
    reps: number;
    est1RM: number;
  };
}

export const ProgressionEngine = {
  // Epley Formula for 1RM
  calculateEstimated1RM(weightKg: number, reps: number): number {
    if (weightKg <= 0 || reps <= 0) return 0;
    if (reps === 1) return weightKg;
    const est = weightKg * (1 + reps / 30);
    return Math.round(est * 10) / 10;
  },

  // Get previous performance from history
  getPreviousPerformance(
    exerciseId: string,
    sessions: WorkoutSession[]
  ): ExercisePreviousPerformance | null {
    // Filter completed sessions that have this exercise with completed sets
    const relevantSessions = sessions
      .filter((s) => s.isCompleted)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

    for (const session of relevantSessions) {
      const exerciseEntry = session.exercises.find((e) => e.exerciseId === exerciseId);
      if (exerciseEntry) {
        const completedSets = exerciseEntry.sets.filter((s) => s.isCompleted);
        if (completedSets.length > 0) {
          let best1RM = 0;
          let bestSet = { weightKg: 0, reps: 0, est1RM: 0 };

          const setsData = completedSets.map((s) => {
            const est = this.calculateEstimated1RM(s.completedWeight, s.completedReps);
            if (est > best1RM) {
              best1RM = est;
              bestSet = {
                weightKg: s.completedWeight,
                reps: s.completedReps,
                est1RM: est
              };
            }
            return {
              setNumber: s.setNumber,
              weightKg: s.completedWeight,
              reps: s.completedReps,
              type: s.type
            };
          });

          return {
            lastSessionDate: session.completedAt || session.startedAt,
            workoutName: session.name,
            sets: setsData,
            bestSet
          };
        }
      }
    }

    return null;
  },

  // Check if a completed set breaks a Personal Record
  checkPersonalRecord(
    exerciseId: string,
    exerciseName: string,
    completedWeight: number,
    completedReps: number,
    currentPR?: PersonalRecord
  ): PRAchievement | null {
    if (completedWeight <= 0 || completedReps <= 0) return null;

    const est1RM = this.calculateEstimated1RM(completedWeight, completedReps);

    if (!currentPR) {
      return {
        exerciseId,
        exerciseName,
        type: 'weight',
        value: completedWeight,
        previousValue: 0,
        unit: 'kg'
      };
    }

    // Check higher weight
    if (completedWeight > currentPR.maxWeightKg) {
      return {
        exerciseId,
        exerciseName,
        type: 'weight',
        value: completedWeight,
        previousValue: currentPR.maxWeightKg,
        unit: 'kg'
      };
    }

    // Check higher 1RM
    if (est1RM > currentPR.estimatedOneRepMaxKg + 0.5) {
      return {
        exerciseId,
        exerciseName,
        type: '1rm',
        value: est1RM,
        previousValue: currentPR.estimatedOneRepMaxKg,
        unit: 'kg est. 1RM'
      };
    }

    // Check higher reps at current max weight
    if (
      completedWeight === currentPR.maxRepsAtWeight.weightKg &&
      completedReps > currentPR.maxRepsAtWeight.reps
    ) {
      return {
        exerciseId,
        exerciseName,
        type: 'reps',
        value: completedReps,
        previousValue: currentPR.maxRepsAtWeight.reps,
        unit: 'reps'
      };
    }

    return null;
  },

  // Generate transparent rule-based progression advice
  generateProgressionAdvice(
    exerciseId: string,
    currentSets: WorkoutSet[],
    previousPerf: ExercisePreviousPerformance | null
  ): string {
    const completedCurrent = currentSets.filter((s) => s.isCompleted);
    if (completedCurrent.length === 0) {
      if (previousPerf) {
        return `Previous best: ${previousPerf.bestSet.weightKg} kg × ${previousPerf.bestSet.reps} reps. Aim to match or beat this today.`;
      }
      return 'Set your baseline weight with strict technique and controlled tempo.';
    }

    if (!previousPerf) {
      return 'Initial baseline established. Keep form locked and note how recovery feels.';
    }

    // Compare total volume of current sets vs previous
    const currentVol = completedCurrent.reduce(
      (acc, s) => acc + s.completedWeight * s.completedReps,
      0
    );
    const prevVol = previousPerf.sets.reduce(
      (acc, s) => acc + s.weightKg * s.reps,
      0
    );

    const currentBest1RM = Math.max(
      ...completedCurrent.map((s) =>
        this.calculateEstimated1RM(s.completedWeight, s.completedReps)
      )
    );

    if (currentBest1RM > previousPerf.bestSet.est1RM) {
      const diff = Math.round((currentBest1RM - previousPerf.bestSet.est1RM) * 10) / 10;
      return `Strong progression (+${diff} kg est. 1RM). Consider increasing weight by 2.5 kg next session.`;
    }

    if (currentVol >= prevVol * 1.05) {
      return 'Total working volume increased (+5%). Outstanding muscular endurance progression.';
    }

    if (currentBest1RM < previousPerf.bestSet.est1RM * 0.9) {
      return 'Performance slightly below prior peak. Fatigue or tempo may be factors—maintain load and prioritize rest.';
    }

    return 'Solid consistency matching previous load. Focus on explosive concentric drive on final sets.';
  }
};

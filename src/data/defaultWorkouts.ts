import { WorkoutTemplate } from '../types';

export const DEFAULT_WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'template-push-a',
    name: 'Push Day A (Chest, Delts & Triceps)',
    category: 'push',
    description: 'High-energy upper body pushing session focused on chest development, deltoid strength, and triceps lockout.',
    estimatedDurationMin: 55,
    isPrebuilt: true,
    lastPerformedAt: null,
    exercises: [
      {
        exerciseId: 'bench-press',
        defaultSets: 4,
        defaultReps: '6-8',
        restSeconds: 120,
        notes: 'Main compound press. Warm up progressively to working weight.'
      },
      {
        exerciseId: 'incline-dumbbell-press',
        defaultSets: 3,
        defaultReps: '8-10',
        restSeconds: 90,
        notes: 'Focus on clavicular chest stretch at bottom.'
      },
      {
        exerciseId: 'dumbbell-shoulder-press',
        defaultSets: 3,
        defaultReps: '8-12',
        restSeconds: 90,
        notes: 'Upright posture, press in smooth arc.'
      },
      {
        exerciseId: 'lateral-raise',
        defaultSets: 4,
        defaultReps: '12-15',
        restSeconds: 60,
        notes: 'Strict form; pause for half a second at peak.'
      },
      {
        exerciseId: 'tricep-pushdown-cable',
        defaultSets: 3,
        defaultReps: '12-15',
        restSeconds: 60,
        notes: 'Elbows pinned to sides; lock out forcefully.'
      }
    ]
  },
  {
    id: 'template-pull-a',
    name: 'Pull Day A (Back, Rear Delts & Biceps)',
    category: 'pull',
    description: 'Comprehensive posterior chain pull targeting back width, upper back thickness, and bicep hypertrophy.',
    estimatedDurationMin: 55,
    isPrebuilt: true,
    lastPerformedAt: null,
    exercises: [
      {
        exerciseId: 'barbell-row',
        defaultSets: 4,
        defaultReps: '6-8',
        restSeconds: 120,
        notes: 'Torso held steady at 45 degrees, pull through elbows.'
      },
      {
        exerciseId: 'pull-ups',
        defaultSets: 3,
        defaultReps: '6-10',
        restSeconds: 90,
        notes: 'Full dead hang stretch to chin over bar.'
      },
      {
        exerciseId: 'seated-cable-row',
        defaultSets: 3,
        defaultReps: '10-12',
        restSeconds: 75,
        notes: 'Squeeze shoulder blades together for 1s pause.'
      },
      {
        exerciseId: 'face-pulls',
        defaultSets: 3,
        defaultReps: '15',
        restSeconds: 60,
        notes: 'High elbows, rotate thumbs backward to ears.'
      },
      {
        exerciseId: 'barbell-curl',
        defaultSets: 3,
        defaultReps: '10-12',
        restSeconds: 60,
        notes: 'No torso swinging; squeeze biceps at top.'
      },
      {
        exerciseId: 'dumbbell-hammer-curl',
        defaultSets: 3,
        defaultReps: '12',
        restSeconds: 60,
        notes: 'Target brachialis and forearm grip.'
      }
    ]
  },
  {
    id: 'template-legs-a',
    name: 'Leg Day A (Quads, Hamstrings & Calves)',
    category: 'legs',
    description: 'Foundational lower body strength workout emphasizing quad loading, hip hinge mechanics, and calf stamina.',
    estimatedDurationMin: 60,
    isPrebuilt: true,
    lastPerformedAt: null,
    exercises: [
      {
        exerciseId: 'barbell-squat',
        defaultSets: 4,
        defaultReps: '6-8',
        restSeconds: 150,
        notes: 'Hit parallel or below. Keep torso braced and knees tracking toes.'
      },
      {
        exerciseId: 'romanian-deadlift',
        defaultSets: 3,
        defaultReps: '8-10',
        restSeconds: 90,
        notes: 'Pure hip hinge; feel deep hamstring stretch.'
      },
      {
        exerciseId: 'leg-press',
        defaultSets: 3,
        defaultReps: '10-12',
        restSeconds: 90,
        notes: 'Full depth without tailbone curling off pad.'
      },
      {
        exerciseId: 'leg-curl',
        defaultSets: 3,
        defaultReps: '12-15',
        restSeconds: 60,
        notes: 'Keep hips pinned flat on bench.'
      },
      {
        exerciseId: 'standing-calf-raise',
        defaultSets: 4,
        defaultReps: '15-20',
        restSeconds: 45,
        notes: 'Deep stretch at bottom, hard squeeze at top.'
      }
    ]
  },
  {
    id: 'template-fullbody-a',
    name: 'Full Body Essentials',
    category: 'full_body',
    description: 'High-efficiency full-body session hitting all major compound movement patterns.',
    estimatedDurationMin: 50,
    isPrebuilt: true,
    lastPerformedAt: null,
    exercises: [
      {
        exerciseId: 'barbell-squat',
        defaultSets: 3,
        defaultReps: '8',
        restSeconds: 120,
        notes: 'Solid baseline quad and glute driver.'
      },
      {
        exerciseId: 'bench-press',
        defaultSets: 3,
        defaultReps: '8',
        restSeconds: 120,
        notes: 'Stable upper body push.'
      },
      {
        exerciseId: 'lat-pulldown',
        defaultSets: 3,
        defaultReps: '10',
        restSeconds: 90,
        notes: 'Smooth vertical back pull.'
      },
      {
        exerciseId: 'overhead-press',
        defaultSets: 3,
        defaultReps: '8-10',
        restSeconds: 90,
        notes: 'Delts and core stability.'
      },
      {
        exerciseId: 'plank',
        defaultSets: 3,
        defaultReps: '45s',
        restSeconds: 60,
        notes: 'Finish with rock-solid anterior core hold.'
      }
    ]
  }
];

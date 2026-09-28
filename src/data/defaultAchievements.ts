import { Achievement } from '../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-workout',
    title: 'First Step',
    description: 'Complete your first workout session in IRONMIND.',
    badge: '🏋️',
    tier: 'bronze',
    isUnlocked: false,
    unlockedAt: null,
    currentValue: 0,
    targetValue: 1,
    unit: 'workout'
  },
  {
    id: '5-workouts',
    title: 'Momentum',
    description: 'Complete 5 workout sessions.',
    badge: '🔥',
    tier: 'bronze',
    isUnlocked: false,
    unlockedAt: null,
    currentValue: 0,
    targetValue: 5,
    unit: 'workouts'
  },
  {
    id: '10-workouts',
    title: 'Dedication',
    description: 'Complete 10 workout sessions.',
    badge: '⚡',
    tier: 'silver',
    isUnlocked: false,
    unlockedAt: null,
    currentValue: 0,
    targetValue: 10,
    unit: 'workouts'
  },
  {
    id: '25-workouts',
    title: 'Unstoppable Force',
    description: 'Complete 25 workout sessions.',
    badge: '🛡️',
    tier: 'gold',
    isUnlocked: false,
    unlockedAt: null,
    currentValue: 0,
    targetValue: 25,
    unit: 'workouts'
  },
  {
    id: '50-workouts',
    title: 'Iron Veteran',
    description: 'Complete 50 workout sessions.',
    badge: '🏆',
    tier: 'iron',
    isUnlocked: false,
    unlockedAt: null,
    currentValue: 0,
    targetValue: 50,
    unit: 'workouts'
  },
  {
    id: 'first-pr',
    title: 'New Heights',
    description: 'Set your very first Personal Record (PR).',
    badge: '⭐',
    tier: 'bronze',
    isUnlocked: false,
    unlockedAt: null,
    currentValue: 0,
    targetValue: 1,
    unit: 'PR'
  },
  {
    id: '5-prs',
    title: 'Relentless Progression',
    description: 'Break 5 personal records across your exercises.',
    badge: '📈',
    tier: 'silver',
    isUnlocked: false,
    unlockedAt: null,
    currentValue: 0,
    targetValue: 5,
    unit: 'PRs'
  },
  {
    id: '10-prs',
    title: 'Peak Performance',
    description: 'Break 10 personal records across your exercises.',
    badge: '👑',
    tier: 'gold',
    isUnlocked: false,
    unlockedAt: null,
    currentValue: 0,
    targetValue: 10,
    unit: 'PRs'
  },
  {
    id: 'volume-50k',
    title: '50 Ton Club',
    description: 'Lift an aggregate total volume of 50,000 kg.',
    badge: '🧱',
    tier: 'silver',
    isUnlocked: false,
    unlockedAt: null,
    currentValue: 0,
    targetValue: 50000,
    unit: 'kg'
  },
  {
    id: 'volume-100k',
    title: 'Iron Titan',
    description: 'Lift an aggregate total volume of 100,000 kg.',
    badge: '🌋',
    tier: 'iron',
    isUnlocked: false,
    unlockedAt: null,
    currentValue: 0,
    targetValue: 100000,
    unit: 'kg'
  }
];

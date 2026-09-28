import { RoutineSchedule } from '../types';

export const DEFAULT_ROUTINES: RoutineSchedule[] = [
  {
    id: 'routine-ppl-classic',
    name: 'Push / Pull / Legs (3-Day Split)',
    isActive: true,
    days: [
      { dayOfWeek: 1, templateId: 'template-push-a', customLabel: 'Push Day A' },
      { dayOfWeek: 2, templateId: null, customLabel: 'Rest & Recovery' },
      { dayOfWeek: 3, templateId: 'template-pull-a', customLabel: 'Pull Day A' },
      { dayOfWeek: 4, templateId: null, customLabel: 'Rest & Mobility' },
      { dayOfWeek: 5, templateId: 'template-legs-a', customLabel: 'Leg Day A' },
      { dayOfWeek: 6, templateId: null, customLabel: 'Active Recovery' },
      { dayOfWeek: 0, templateId: null, customLabel: 'Rest & Fuel' }
    ]
  },
  {
    id: 'routine-fullbody',
    name: 'Full Body (3x Weekly)',
    isActive: false,
    days: [
      { dayOfWeek: 1, templateId: 'template-fullbody-a', customLabel: 'Full Body Session 1' },
      { dayOfWeek: 2, templateId: null, customLabel: 'Rest' },
      { dayOfWeek: 3, templateId: 'template-fullbody-a', customLabel: 'Full Body Session 2' },
      { dayOfWeek: 4, templateId: null, customLabel: 'Rest' },
      { dayOfWeek: 5, templateId: 'template-fullbody-a', customLabel: 'Full Body Session 3' },
      { dayOfWeek: 6, templateId: null, customLabel: 'Weekend Recovery' },
      { dayOfWeek: 0, templateId: null, customLabel: 'Weekend Recovery' }
    ]
  }
];

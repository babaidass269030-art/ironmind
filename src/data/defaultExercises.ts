import { Exercise } from '../types';

export const DEFAULT_EXERCISES: Exercise[] = [
  // CHEST
  {
    id: 'bench-press',
    name: 'Barbell Bench Press',
    category: 'chest',
    primaryMuscle: 'Pectoralis Major',
    secondaryMuscles: ['Anterior Deltoids', 'Triceps Brachii'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    recommendedReps: '6-10',
    instructions: [
      'Lie flat on the bench with eyes directly beneath the racked bar.',
      'Grip the bar slightly wider than shoulder-width, arch upper back, and plant feet firmly.',
      'Unrack and stabilize the bar directly over mid-chest.',
      'Lower under control to the sternum, tucking elbows at roughly 45 degrees.',
      'Drive powerfully off the chest through the midfoot back to the starting position.'
    ],
    formTips: [
      'Keep shoulder blades retracted and depressed against the pad throughout.',
      'Do not bounce the barbell off your sternum.',
      'Maintain tight leg drive without lifting your hips off the bench.'
    ]
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    category: 'chest',
    primaryMuscle: 'Clavicular Head (Upper Chest)',
    secondaryMuscles: ['Anterior Deltoids', 'Triceps'],
    equipment: 'dumbbell',
    difficulty: 'intermediate',
    recommendedReps: '8-12',
    instructions: [
      'Set an incline bench to roughly 30–45 degrees.',
      'Kick dumbbells to shoulder level and sit back with shoulder blades pinned.',
      'Press dumbbells up in a slight arc toward the midline without clanking them together.',
      'Lower with control until the dumbbells reach chest level and feel a deep stretch.'
    ],
    formTips: [
      'Avoid setting bench too high (>45°) which shifts load into front delts.',
      'Control the eccentric lowering phase for 2-3 seconds.'
    ]
  },
  {
    id: 'dumbbell-bench-press',
    name: 'Flat Dumbbell Press',
    category: 'chest',
    primaryMuscle: 'Mid Pectorals',
    secondaryMuscles: ['Triceps', 'Shoulders'],
    equipment: 'dumbbell',
    difficulty: 'beginner',
    recommendedReps: '8-12',
    instructions: [
      'Sit on bench, kick dumbbells up using your knees, and recline flat.',
      'Position weights at chest level with neutral or semi-pronated wrists.',
      'Press straight up, converging slightly at the top without touching.',
      'Lower smoothly until your elbows break roughly 90 degrees.'
    ],
    formTips: [
      'Greater range of motion than barbell press; keep wrists rigid.',
      'Keep your feet flat on the floor to maintain core stability.'
    ]
  },
  {
    id: 'chest-fly-cable',
    name: 'Standing Cable Chest Fly',
    category: 'chest',
    primaryMuscle: 'Pectoralis Major (Sternal)',
    secondaryMuscles: ['Anterior Deltoids'],
    equipment: 'cable',
    difficulty: 'beginner',
    recommendedReps: '12-15',
    instructions: [
      'Set cable pulleys at chest height. Take handles and step forward in a staggered stance.',
      'Maintain a slight bend in your elbows and bring hands together in a hugging motion.',
      'Squeeze chest hard at peak contraction for 1 second.',
      'Slowly open arms wide until you feel a comfortable chest stretch.'
    ],
    formTips: [
      'Keep elbows locked in a fixed soft angle; do not turn it into a press.',
      'Keep torso stationary; do not lurch forward with momentum.'
    ]
  },
  {
    id: 'push-ups',
    name: 'Push Ups',
    category: 'chest',
    primaryMuscle: 'Pectorals',
    secondaryMuscles: ['Triceps', 'Core', 'Anterior Deltoid'],
    equipment: 'bodyweight',
    difficulty: 'beginner',
    recommendedReps: '12-25',
    instructions: [
      'Begin in high plank position with hands slightly wider than shoulders.',
      'Brace core and glutes to keep body in a rigid straight line.',
      'Lower until chest is 1-2 inches above floor with elbows tucked at 45 degrees.',
      'Push the ground away to return to top plank position.'
    ],
    formTips: [
      'Prevent hips from sagging or piking upwards.',
      'Keep neck neutral by looking a few inches ahead of hands.'
    ]
  },

  // BACK
  {
    id: 'deadlift',
    name: 'Barbell Conventional Deadlift',
    category: 'back',
    primaryMuscle: 'Posterior Chain (Hamstrings, Glutes, Erector Spinae)',
    secondaryMuscles: ['Latissimus Dorsi', 'Trapezius', 'Forearms'],
    equipment: 'barbell',
    difficulty: 'advanced',
    recommendedReps: '3-6',
    instructions: [
      'Stand with midfoot directly under bar, hip-width stance.',
      'Hinge hips back and grip bar just outside shins with straight arms.',
      'Pull slack out of the bar, brace core, chest up, and pull lats into back pockets.',
      'Drive feet through floor, extending knees and hips simultaneously to lockout.'
    ],
    formTips: [
      'Never round the lumbar spine under heavy loads.',
      'Keep the barbell in contact with your legs throughout the pull.'
    ]
  },
  {
    id: 'barbell-row',
    name: 'Bent Over Barbell Row',
    category: 'back',
    primaryMuscle: 'Latissimus Dorsi & Rhomboids',
    secondaryMuscles: ['Biceps', 'Rear Deltoids', 'Lower Back'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    recommendedReps: '6-10',
    instructions: [
      'Hold barbell with overhand grip, hinge hips back with torso roughly 45 degrees.',
      'Let bar hang with arms extended below shoulders.',
      'Pull bar toward your belly button, driving elbows back and squeezing shoulder blades.',
      'Lower bar with control without letting shoulders round forward.'
    ],
    formTips: [
      'Do not jerk torso up and down to yank the weight.',
      'Keep your core tightly braced to safeguard your lumbar spine.'
    ]
  },
  {
    id: 'pull-ups',
    name: 'Pull Ups',
    category: 'back',
    primaryMuscle: 'Latissimus Dorsi',
    secondaryMuscles: ['Biceps Brachii', 'Middle Traps', 'Rhomboids'],
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    recommendedReps: '6-12',
    instructions: [
      'Grip overhead pull-up bar with overhand grip wider than shoulders.',
      'Hang with full stretch, engage scapulae by pulling them down.',
      'Pull elbows down toward ribs until chin clearly clears the bar.',
      'Lower under complete control back to full dead hang.'
    ],
    formTips: [
      'Avoid swinging or kicking legs for momentum.',
      'Focus on pulling through elbows rather than hands.'
    ]
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    category: 'back',
    primaryMuscle: 'Latissimus Dorsi',
    secondaryMuscles: ['Biceps', 'Rear Deltoids'],
    equipment: 'cable',
    difficulty: 'beginner',
    recommendedReps: '8-12',
    instructions: [
      'Sit at machine with thigh pads snug. Grip bar with medium-wide overhand grip.',
      'Lean back very slightly (~10°), keep chest lifted.',
      'Pull bar down to upper chest, pulling through your elbows.',
      'Control the ascent all the way up for a full stretch of the lats.'
    ],
    formTips: [
      'Do not swing aggressively backward to gain momentum.',
      'Keep shoulders pinned down away from ears at bottom contraction.'
    ]
  },
  {
    id: 'seated-cable-row',
    name: 'Seated Cable Row',
    category: 'back',
    primaryMuscle: 'Middle Traps & Rhomboids',
    secondaryMuscles: ['Lats', 'Biceps', 'Erectors'],
    equipment: 'cable',
    difficulty: 'beginner',
    recommendedReps: '10-12',
    instructions: [
      'Sit on bench with feet placed on footrests, knees slightly bent.',
      'Grab V-bar handle and sit upright with straight spine.',
      'Pull handle into lower abdomen while driving elbows backward.',
      'Pause for a beat, squeeze shoulder blades together, then return under control.'
    ],
    formTips: [
      'Avoid rocking back and forth from the lower back.',
      'Keep shoulders down and chest proud.'
    ]
  },

  // SHOULDERS
  {
    id: 'overhead-press',
    name: 'Overhead Barbell Press',
    category: 'shoulders',
    primaryMuscle: 'Anterior & Lateral Deltoids',
    secondaryMuscles: ['Triceps', 'Upper Chest', 'Core'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    recommendedReps: '5-8',
    instructions: [
      'Rack bar at collarbone height. Grip bar just outside shoulders.',
      'Unrack, step back, squeeze glutes, quads, and brace abdominal wall.',
      'Tilt head slightly back as you press vertically, moving head through "window" at top.',
      'Lock out bar directly overhead over midfoot, then lower to collarbones.'
    ],
    formTips: [
      'Do not overarch the lower back to compensate for shoulder mobility.',
      'Keep wrists straight above elbows.'
    ]
  },
  {
    id: 'lateral-raise',
    name: 'Dumbbell Lateral Raise',
    category: 'shoulders',
    primaryMuscle: 'Lateral Deltoids (Side Delts)',
    secondaryMuscles: ['Trapezius', 'Supraspinatus'],
    equipment: 'dumbbell',
    difficulty: 'beginner',
    recommendedReps: '12-16',
    instructions: [
      'Stand tall holding dumbbells at sides with slight forward torso lean.',
      'With soft bend in elbows, raise arms out to sides in scapular plane.',
      'Lift until dumbbells reach shoulder height with pinkies slightly higher than thumbs.',
      'Lower slowly over 2 seconds to starting position.'
    ],
    formTips: [
      'Lead with elbows, not wrists.',
      'Avoid shrugging your traps up toward your ears.'
    ]
  },
  {
    id: 'dumbbell-shoulder-press',
    name: 'Seated Dumbbell Shoulder Press',
    category: 'shoulders',
    primaryMuscle: 'Anterior & Medial Deltoids',
    secondaryMuscles: ['Triceps', 'Upper Trapezius'],
    equipment: 'dumbbell',
    difficulty: 'beginner',
    recommendedReps: '8-12',
    instructions: [
      'Sit on an upright or 80-degree bench with dumbbells at shoulder height.',
      'Press dumbbells upwards in an arc until arms are extended overhead.',
      'Do not bang the weights at the apex.',
      'Lower slowly until dumbbells are at ear level.'
    ],
    formTips: [
      'Keep back flat against the pad; do not arch excessively.',
      'Keep elbows slightly angled inward rather than flared 90 degrees out.'
    ]
  },
  {
    id: 'face-pulls',
    name: 'Cable Face Pull',
    category: 'shoulders',
    primaryMuscle: 'Rear Deltoids & External Rotators',
    secondaryMuscles: ['Rhomboids', 'Mid Trapezius'],
    equipment: 'cable',
    difficulty: 'beginner',
    recommendedReps: '12-15',
    instructions: [
      'Attach rope handle to cable at eye height. Grip with thumbs backward.',
      'Step back, pull rope toward nose while rotating knuckles backward.',
      'Flare elbows high and wide, creating a "double biceps" pose at contraction.',
      'Slowly return to start with control.'
    ],
    formTips: [
      'Crucial exercise for shoulder health and posture.',
      'Focus on external shoulder rotation rather than pulling with biceps.'
    ]
  },

  // LEGS & GLUTES & CALVES
  {
    id: 'barbell-squat',
    name: 'Barbell Back Squat',
    category: 'legs',
    primaryMuscle: 'Quadriceps & Gluteus Maximus',
    secondaryMuscles: ['Adductors', 'Hamstrings', 'Core'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    recommendedReps: '5-8',
    instructions: [
      'Position bar on upper traps, grip firmly, unrack, and take 2-3 controlled steps back.',
      'Feet shoulder-width apart, toes flared slightly out.',
      'Take deep diaphragmatic breath into belly, break at hips and knees simultaneously.',
      'Squat down until hip crease descends below top of knees (parallel or deeper).',
      'Drive up through whole foot, keeping chest proud and knees tracking over toes.'
    ],
    formTips: [
      'Never allow knees to cave inward (valgus collapse).',
      'Keep heels glued to the floor and maintain neutral spine.'
    ]
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift (RDL)',
    category: 'legs',
    primaryMuscle: 'Hamstrings & Gluteus Maximus',
    secondaryMuscles: ['Erector Spinae', 'Lats', 'Core'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    recommendedReps: '8-12',
    instructions: [
      'Stand tall holding bar at thigh level with overhand grip.',
      'Unlock knees slightly and keep them fixed at that angle.',
      'Push hips back as far as possible, tracing bar down shins until deep stretch.',
      'Contract glutes and hamstrings to drive hips forward to standing lockout.'
    ],
    formTips: [
      'This is a pure hip hinge, not a squat. Do not bend knees more during the descent.',
      'Keep barbell close to shins at all times.'
    ]
  },
  {
    id: 'leg-press',
    name: '45° Leg Press',
    category: 'legs',
    primaryMuscle: 'Quadriceps',
    secondaryMuscles: ['Glutes', 'Hamstrings'],
    equipment: 'machine',
    difficulty: 'beginner',
    recommendedReps: '10-15',
    instructions: [
      'Sit comfortably on machine with lower back firmly against pad.',
      'Place feet shoulder-width on footplate.',
      'Disengage safety levers and lower sled until knees reach ~90 degrees.',
      'Press platform away through midfoot without locking out knees at the top.'
    ],
    formTips: [
      'Do not allow lower back or tailbone to peel up from pad.',
      'Never hyperextend or forcefully slam knee joints at extension.'
    ]
  },
  {
    id: 'leg-extension',
    name: 'Leg Extension Machine',
    category: 'legs',
    primaryMuscle: 'Quadriceps (Rectus Femoris)',
    secondaryMuscles: ['Vastus Lateralis', 'Vastus Medialis'],
    equipment: 'machine',
    difficulty: 'beginner',
    recommendedReps: '12-15',
    instructions: [
      'Adjust back pad so knees align with machine pivot point.',
      'Place shin pad on top of lower shins just above ankles.',
      'Extend legs upwards, squeezing quads forcefully at full lockout.',
      'Lower weight slowly back to starting position over 2 seconds.'
    ],
    formTips: [
      'Avoid explosive kicking using inertia.',
      'Pause for 1 second at the top of contraction for maximal quad activation.'
    ]
  },
  {
    id: 'leg-curl',
    name: 'Lying or Seated Leg Curl',
    category: 'legs',
    primaryMuscle: 'Hamstrings (Biceps Femoris)',
    secondaryMuscles: ['Calves (Gastrocnemius)'],
    equipment: 'machine',
    difficulty: 'beginner',
    recommendedReps: '10-15',
    instructions: [
      'Adjust pad so it rests on lower calves just below calves.',
      'Grip side handles and brace hips firmly into seat/bench.',
      'Curl heels toward glutes as far as comfortably possible.',
      'Hold peak contraction for a beat, then release slowly under control.'
    ],
    formTips: [
      'Do not let hips lift up during the curl.',
      'Keep toes pointed slightly forward or dorsiflexed.'
    ]
  },
  {
    id: 'walking-lunges',
    name: 'Dumbbell Walking Lunges',
    category: 'legs',
    primaryMuscle: 'Quadriceps & Glutes',
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core'],
    equipment: 'dumbbell',
    difficulty: 'intermediate',
    recommendedReps: '10-12 per leg',
    instructions: [
      'Hold dumbbells at sides with tall posture.',
      'Take a large step forward, bending both knees to roughly 90 degrees.',
      'Back knee should gently hover just above floor.',
      'Drive through front heel to step smoothly into next lunge with trailing leg.'
    ],
    formTips: [
      'Keep torso upright; do not lean excessively forward.',
      'Ensure front knee stays aligned with toes.'
    ]
  },
  {
    id: 'standing-calf-raise',
    name: 'Standing Calf Raise',
    category: 'calves',
    primaryMuscle: 'Gastrocnemius',
    secondaryMuscles: ['Soleus'],
    equipment: 'machine',
    difficulty: 'beginner',
    recommendedReps: '12-20',
    instructions: [
      'Place balls of feet on step block with heels hanging off.',
      'Lower heels down as deep as possible for a full calf stretch.',
      'Drive up high on big toes to full ankle plantarflexion.',
      'Hold peak squeeze for 1-2 seconds before descending.'
    ],
    formTips: [
      'Do not bounce at the bottom Achilles stretch.',
      'Controlled pause eliminates elastic rebound.'
    ]
  },

  // ARMS: BICEPS & TRICEPS
  {
    id: 'barbell-curl',
    name: 'Standing Barbell Bicep Curl',
    category: 'biceps',
    primaryMuscle: 'Biceps Brachii',
    secondaryMuscles: ['Brachialis', 'Brachioradialis'],
    equipment: 'barbell',
    difficulty: 'beginner',
    recommendedReps: '8-12',
    instructions: [
      'Stand upright holding straight or EZ curl bar with shoulder-width underhand grip.',
      'Pin elbows at your sides and brace core.',
      'Curl the bar upward toward chest, squeezing biceps forcefully at top.',
      'Lower the bar under control until arms are fully extended.'
    ],
    formTips: [
      'Do not swing torso backwards to heave the bar up.',
      'Keep elbows stationary beside ribs.'
    ]
  },
  {
    id: 'dumbbell-hammer-curl',
    name: 'Dumbbell Hammer Curl',
    category: 'biceps',
    primaryMuscle: 'Brachialis & Brachioradialis',
    secondaryMuscles: ['Biceps Brachii'],
    equipment: 'dumbbell',
    difficulty: 'beginner',
    recommendedReps: '10-12',
    instructions: [
      'Stand holding dumbbells with palms facing each other (neutral grip).',
      'Keeping upper arms stationary, curl dumbbells upward.',
      'Pause and squeeze at the top of the range.',
      'Lower dumbbells slowly to the starting position.'
    ],
    formTips: [
      'Builds upper arm thickness and forearm grip strength.',
      'Alternate arms or curl both together with strict control.'
    ]
  },
  {
    id: 'tricep-pushdown-cable',
    name: 'Cable Tricep Pushdown',
    category: 'triceps',
    primaryMuscle: 'Triceps Brachii (Lateral & Medial Head)',
    secondaryMuscles: ['Anconeus'],
    equipment: 'cable',
    difficulty: 'beginner',
    recommendedReps: '10-15',
    instructions: [
      'Attach rope or straight bar to high cable pulley.',
      'Tuck elbows at sides with chest slightly tilted forward.',
      'Push handle straight down until arms are locked out.',
      'Spread rope handles slightly apart at bottom for extra contraction.',
      'Return up to 90 degrees elbow bend with control.'
    ],
    formTips: [
      'Keep elbows pinned to your ribcage; do not flare them forward and back.',
      'Avoid leaning over the cable using body weight.'
    ]
  },
  {
    id: 'skull-crusher',
    name: 'EZ-Bar Skull Crusher',
    category: 'triceps',
    primaryMuscle: 'Triceps Brachii (Long Head)',
    secondaryMuscles: ['Medial & Lateral Heads'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    recommendedReps: '8-12',
    instructions: [
      'Lie on flat bench holding EZ curl bar over upper chest with arms straight.',
      'Bend elbows to lower the bar toward forehead or slightly behind crown of head.',
      'Keep upper arms angled slightly back toward head to maintain tension.',
      'Extend forearms back to starting position by contracting triceps.'
    ],
    formTips: [
      'Do not flare elbows excessively outward.',
      'Lowering slightly behind the head places safer tension on elbow tendons.'
    ]
  },

  // CORE
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Leg Raise',
    category: 'core',
    primaryMuscle: 'Rectus Abdominis & Hip Flexors',
    secondaryMuscles: ['Obliques', 'Forearm Grip'],
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    recommendedReps: '10-15',
    instructions: [
      'Hang from pull-up bar with overhand grip and dead hang.',
      'Brace core and raise legs with slight bend in knees toward 90 degrees or chest.',
      'Curl pelvis up at top to fully recruit abdominal wall.',
      'Lower legs slowly without swinging back into extension.'
    ],
    formTips: [
      'Do not swing or kick using momentum.',
      'Tuck knees first if full straight-leg raises cause lower back fatigue.'
    ]
  },
  {
    id: 'plank',
    name: 'Forearm Plank',
    category: 'core',
    primaryMuscle: 'Transverse Abdominis & Rectus Abdominis',
    secondaryMuscles: ['Shoulders', 'Glutes', 'Lower Back'],
    equipment: 'bodyweight',
    difficulty: 'beginner',
    recommendedReps: '45-60s hold',
    instructions: [
      'Place forearms on floor with elbows directly under shoulders.',
      'Extend legs back on toes, body forming a straight plank.',
      'Squeeze glutes, quads, and draw navel toward spine.',
      'Breathe steadily and hold tension throughout.'
    ],
    formTips: [
      'Do not allow hips to sag or pike up into an inverted V.',
      'Keep head neutral by looking down at wrists.'
    ]
  }
];

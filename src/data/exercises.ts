import type { Exercise, MuscleGroup, ExerciseCategory, EquipmentType } from '../types/exercise';
import { generateId } from '../lib/id';

interface ExerciseDefinition {
  name: string;
  category: ExerciseCategory;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: EquipmentType;
}

const EXERCISE_DEFINITIONS: ExerciseDefinition[] = [
  // ─── Chest (strength) ───────────────────────────────────────────────
  {
    name: 'Barbell Bench Press',
    category: 'strength',
    primaryMuscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'barbell',
  },
  {
    name: 'Incline Dumbbell Press',
    category: 'strength',
    primaryMuscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'dumbbell',
  },
  {
    name: 'Dumbbell Flyes',
    category: 'strength',
    primaryMuscle: 'chest',
    secondaryMuscles: ['shoulders'],
    equipment: 'dumbbell',
  },
  {
    name: 'Cable Crossover',
    category: 'strength',
    primaryMuscle: 'chest',
    secondaryMuscles: ['shoulders'],
    equipment: 'cable',
  },
  {
    name: 'Push-ups',
    category: 'strength',
    primaryMuscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders', 'core'],
    equipment: 'bodyweight',
  },
  {
    name: 'Decline Bench Press',
    category: 'strength',
    primaryMuscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'barbell',
  },
  {
    name: 'Chest Dips',
    category: 'strength',
    primaryMuscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'bodyweight',
  },

  // ─── Back (strength) ────────────────────────────────────────────────
  {
    name: 'Barbell Row',
    category: 'strength',
    primaryMuscle: 'back',
    secondaryMuscles: ['biceps', 'forearms', 'core'],
    equipment: 'barbell',
  },
  {
    name: 'Pull-ups',
    category: 'strength',
    primaryMuscle: 'back',
    secondaryMuscles: ['biceps', 'forearms'],
    equipment: 'bodyweight',
  },
  {
    name: 'Lat Pulldown',
    category: 'strength',
    primaryMuscle: 'back',
    secondaryMuscles: ['biceps', 'forearms'],
    equipment: 'cable',
  },
  {
    name: 'Seated Cable Row',
    category: 'strength',
    primaryMuscle: 'back',
    secondaryMuscles: ['biceps', 'forearms'],
    equipment: 'cable',
  },
  {
    name: 'Dumbbell Row',
    category: 'strength',
    primaryMuscle: 'back',
    secondaryMuscles: ['biceps', 'forearms'],
    equipment: 'dumbbell',
  },
  {
    name: 'T-Bar Row',
    category: 'strength',
    primaryMuscle: 'back',
    secondaryMuscles: ['biceps', 'forearms', 'core'],
    equipment: 'barbell',
  },
  {
    name: 'Face Pulls',
    category: 'strength',
    primaryMuscle: 'back',
    secondaryMuscles: ['shoulders'],
    equipment: 'cable',
  },
  {
    name: 'Deadlift',
    category: 'strength',
    primaryMuscle: 'back',
    secondaryMuscles: ['hamstrings', 'glutes', 'forearms', 'core'],
    equipment: 'barbell',
  },

  // ─── Shoulders (strength) ──────────────────────────────────────────
  {
    name: 'Overhead Press',
    category: 'strength',
    primaryMuscle: 'shoulders',
    secondaryMuscles: ['triceps', 'core'],
    equipment: 'barbell',
  },
  {
    name: 'Lateral Raises',
    category: 'strength',
    primaryMuscle: 'shoulders',
    secondaryMuscles: [],
    equipment: 'dumbbell',
  },
  {
    name: 'Front Raises',
    category: 'strength',
    primaryMuscle: 'shoulders',
    secondaryMuscles: ['chest'],
    equipment: 'dumbbell',
  },
  {
    name: 'Rear Delt Flyes',
    category: 'strength',
    primaryMuscle: 'shoulders',
    secondaryMuscles: ['back'],
    equipment: 'dumbbell',
  },
  {
    name: 'Arnold Press',
    category: 'strength',
    primaryMuscle: 'shoulders',
    secondaryMuscles: ['triceps'],
    equipment: 'dumbbell',
  },
  {
    name: 'Upright Row',
    category: 'strength',
    primaryMuscle: 'shoulders',
    secondaryMuscles: ['biceps', 'forearms'],
    equipment: 'barbell',
  },
  {
    name: 'Shrugs',
    category: 'strength',
    primaryMuscle: 'shoulders',
    secondaryMuscles: ['forearms'],
    equipment: 'dumbbell',
  },

  // ─── Biceps (strength) ─────────────────────────────────────────────
  {
    name: 'Barbell Curl',
    category: 'strength',
    primaryMuscle: 'biceps',
    secondaryMuscles: ['forearms'],
    equipment: 'barbell',
  },
  {
    name: 'Dumbbell Curl',
    category: 'strength',
    primaryMuscle: 'biceps',
    secondaryMuscles: ['forearms'],
    equipment: 'dumbbell',
  },
  {
    name: 'Hammer Curl',
    category: 'strength',
    primaryMuscle: 'biceps',
    secondaryMuscles: ['forearms'],
    equipment: 'dumbbell',
  },
  {
    name: 'Preacher Curl',
    category: 'strength',
    primaryMuscle: 'biceps',
    secondaryMuscles: ['forearms'],
    equipment: 'dumbbell',
  },
  {
    name: 'Cable Curl',
    category: 'strength',
    primaryMuscle: 'biceps',
    secondaryMuscles: ['forearms'],
    equipment: 'cable',
  },
  {
    name: 'Concentration Curl',
    category: 'strength',
    primaryMuscle: 'biceps',
    secondaryMuscles: ['forearms'],
    equipment: 'dumbbell',
  },

  // ─── Triceps (strength) ────────────────────────────────────────────
  {
    name: 'Tricep Pushdown',
    category: 'strength',
    primaryMuscle: 'triceps',
    secondaryMuscles: [],
    equipment: 'cable',
  },
  {
    name: 'Overhead Tricep Extension',
    category: 'strength',
    primaryMuscle: 'triceps',
    secondaryMuscles: [],
    equipment: 'dumbbell',
  },
  {
    name: 'Skull Crushers',
    category: 'strength',
    primaryMuscle: 'triceps',
    secondaryMuscles: ['chest'],
    equipment: 'barbell',
  },
  {
    name: 'Close-Grip Bench Press',
    category: 'strength',
    primaryMuscle: 'triceps',
    secondaryMuscles: ['chest', 'shoulders'],
    equipment: 'barbell',
  },
  {
    name: 'Tricep Dips',
    category: 'strength',
    primaryMuscle: 'triceps',
    secondaryMuscles: ['chest', 'shoulders'],
    equipment: 'bodyweight',
  },
  {
    name: 'Diamond Push-ups',
    category: 'strength',
    primaryMuscle: 'triceps',
    secondaryMuscles: ['chest', 'shoulders', 'core'],
    equipment: 'bodyweight',
  },

  // ─── Core (strength) ───────────────────────────────────────────────
  {
    name: 'Plank',
    category: 'strength',
    primaryMuscle: 'core',
    secondaryMuscles: ['shoulders'],
    equipment: 'bodyweight',
  },
  {
    name: 'Hanging Leg Raise',
    category: 'strength',
    primaryMuscle: 'core',
    secondaryMuscles: ['forearms'],
    equipment: 'bodyweight',
  },
  {
    name: 'Cable Crunch',
    category: 'strength',
    primaryMuscle: 'core',
    secondaryMuscles: [],
    equipment: 'cable',
  },
  {
    name: 'Ab Wheel Rollout',
    category: 'strength',
    primaryMuscle: 'core',
    secondaryMuscles: ['shoulders', 'back'],
    equipment: 'other',
  },
  {
    name: 'Russian Twist',
    category: 'strength',
    primaryMuscle: 'core',
    secondaryMuscles: [],
    equipment: 'bodyweight',
  },
  {
    name: 'Dead Bug',
    category: 'strength',
    primaryMuscle: 'core',
    secondaryMuscles: [],
    equipment: 'bodyweight',
  },

  // ─── Quads (strength) ──────────────────────────────────────────────
  {
    name: 'Barbell Squat',
    category: 'strength',
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings', 'core'],
    equipment: 'barbell',
  },
  {
    name: 'Front Squat',
    category: 'strength',
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'core'],
    equipment: 'barbell',
  },
  {
    name: 'Leg Press',
    category: 'strength',
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings'],
    equipment: 'machine',
  },
  {
    name: 'Leg Extension',
    category: 'strength',
    primaryMuscle: 'quads',
    secondaryMuscles: [],
    equipment: 'machine',
  },
  {
    name: 'Bulgarian Split Squat',
    category: 'strength',
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings', 'core'],
    equipment: 'dumbbell',
  },
  {
    name: 'Goblet Squat',
    category: 'strength',
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'core'],
    equipment: 'kettlebell',
  },
  {
    name: 'Hack Squat',
    category: 'strength',
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings'],
    equipment: 'machine',
  },

  // ─── Hamstrings (strength) ─────────────────────────────────────────
  {
    name: 'Romanian Deadlift',
    category: 'strength',
    primaryMuscle: 'hamstrings',
    secondaryMuscles: ['glutes', 'back', 'forearms'],
    equipment: 'barbell',
  },
  {
    name: 'Leg Curl',
    category: 'strength',
    primaryMuscle: 'hamstrings',
    secondaryMuscles: ['calves'],
    equipment: 'machine',
  },
  {
    name: 'Good Morning',
    category: 'strength',
    primaryMuscle: 'hamstrings',
    secondaryMuscles: ['glutes', 'back', 'core'],
    equipment: 'barbell',
  },
  {
    name: 'Nordic Curl',
    category: 'strength',
    primaryMuscle: 'hamstrings',
    secondaryMuscles: ['glutes'],
    equipment: 'bodyweight',
  },

  // ─── Glutes (strength) ─────────────────────────────────────────────
  {
    name: 'Hip Thrust',
    category: 'strength',
    primaryMuscle: 'glutes',
    secondaryMuscles: ['hamstrings', 'core'],
    equipment: 'barbell',
  },
  {
    name: 'Glute Bridge',
    category: 'strength',
    primaryMuscle: 'glutes',
    secondaryMuscles: ['hamstrings', 'core'],
    equipment: 'bodyweight',
  },
  {
    name: 'Cable Kickback',
    category: 'strength',
    primaryMuscle: 'glutes',
    secondaryMuscles: ['hamstrings'],
    equipment: 'cable',
  },
  {
    name: 'Step-ups',
    category: 'strength',
    primaryMuscle: 'glutes',
    secondaryMuscles: ['quads', 'hamstrings', 'core'],
    equipment: 'dumbbell',
  },

  // ─── Calves (strength) ─────────────────────────────────────────────
  {
    name: 'Standing Calf Raise',
    category: 'strength',
    primaryMuscle: 'calves',
    secondaryMuscles: [],
    equipment: 'machine',
  },
  {
    name: 'Seated Calf Raise',
    category: 'strength',
    primaryMuscle: 'calves',
    secondaryMuscles: [],
    equipment: 'machine',
  },

  // ─── Cardio ────────────────────────────────────────────────────────
  {
    name: 'Running',
    category: 'cardio',
    primaryMuscle: 'cardio',
    secondaryMuscles: ['quads', 'hamstrings', 'calves'],
    equipment: 'none',
  },
  {
    name: 'Cycling',
    category: 'cardio',
    primaryMuscle: 'cardio',
    secondaryMuscles: ['quads', 'hamstrings', 'calves'],
    equipment: 'machine',
  },
  {
    name: 'Rowing',
    category: 'cardio',
    primaryMuscle: 'cardio',
    secondaryMuscles: ['back', 'biceps', 'core'],
    equipment: 'machine',
  },
  {
    name: 'Swimming',
    category: 'cardio',
    primaryMuscle: 'cardio',
    secondaryMuscles: ['full_body'],
    equipment: 'none',
  },
  {
    name: 'Jump Rope',
    category: 'cardio',
    primaryMuscle: 'cardio',
    secondaryMuscles: ['calves', 'shoulders', 'forearms'],
    equipment: 'other',
  },
  {
    name: 'Stair Climber',
    category: 'cardio',
    primaryMuscle: 'cardio',
    secondaryMuscles: ['quads', 'glutes', 'calves'],
    equipment: 'machine',
  },
  {
    name: 'Elliptical',
    category: 'cardio',
    primaryMuscle: 'cardio',
    secondaryMuscles: ['quads', 'hamstrings', 'glutes'],
    equipment: 'machine',
  },

  // ─── Flexibility ───────────────────────────────────────────────────
  {
    name: 'Static Stretching',
    category: 'flexibility',
    primaryMuscle: 'full_body',
    secondaryMuscles: [],
    equipment: 'none',
  },
  {
    name: 'Yoga Flow',
    category: 'flexibility',
    primaryMuscle: 'full_body',
    secondaryMuscles: ['core'],
    equipment: 'none',
  },
  {
    name: 'Foam Rolling',
    category: 'flexibility',
    primaryMuscle: 'full_body',
    secondaryMuscles: [],
    equipment: 'other',
  },

  // ─── HIIT ──────────────────────────────────────────────────────────
  {
    name: 'Burpees',
    category: 'hiit',
    primaryMuscle: 'full_body',
    secondaryMuscles: ['chest', 'quads', 'core', 'shoulders'],
    equipment: 'bodyweight',
  },
  {
    name: 'Mountain Climbers',
    category: 'hiit',
    primaryMuscle: 'full_body',
    secondaryMuscles: ['core', 'shoulders', 'quads'],
    equipment: 'bodyweight',
  },
  {
    name: 'Box Jumps',
    category: 'hiit',
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'calves', 'hamstrings'],
    equipment: 'other',
  },
  {
    name: 'Battle Ropes',
    category: 'hiit',
    primaryMuscle: 'full_body',
    secondaryMuscles: ['shoulders', 'back', 'core', 'forearms'],
    equipment: 'other',
  },
  {
    name: 'Kettlebell Swings',
    category: 'hiit',
    primaryMuscle: 'full_body',
    secondaryMuscles: ['glutes', 'hamstrings', 'core', 'shoulders'],
    equipment: 'kettlebell',
  },
];

export function getDefaultExercises(): Exercise[] {
  const now = Date.now();

  return EXERCISE_DEFINITIONS.map((def) => ({
    id: generateId(),
    name: def.name,
    category: def.category,
    primaryMuscle: def.primaryMuscle,
    secondaryMuscles: def.secondaryMuscles,
    equipment: def.equipment,
    isCustom: false,
    notes: '',
    createdAt: now,
  }));
}

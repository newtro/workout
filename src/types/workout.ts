import type { ID, Timestamp } from './common';
import type { ExerciseCategory } from './exercise';

export interface StrengthSet {
  id: ID;
  setNumber: number;
  reps: number | null;
  weight: number | null;
  rpe: number | null;
  isWarmup: boolean;
  isDropset: boolean;
  completed: boolean;
}

export interface CardioData {
  durationMinutes: number | null;
  distanceKm: number | null;
  avgHeartRate: number | null;
  calories: number | null;
}

export interface WorkoutExercise {
  id: ID;
  exerciseId: ID;
  exerciseName: string;
  category: ExerciseCategory;
  sets: StrengthSet[];
  cardio: CardioData | null;
  notes: string;
  order: number;
}

export type WorkoutStatus = 'in_progress' | 'completed' | 'abandoned';

export interface Workout {
  id: ID;
  name: string;
  templateId: ID | null;
  exercises: WorkoutExercise[];
  status: WorkoutStatus;
  startedAt: Timestamp;
  completedAt: Timestamp | null;
  durationMinutes: number | null;
  notes: string;
  rating: number | null;
  createdAt: Timestamp;
}

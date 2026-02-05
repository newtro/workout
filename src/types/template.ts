import type { ID, Timestamp } from './common';
import type { ExerciseCategory } from './exercise';

export interface TemplateExercise {
  id: ID;
  exerciseId: ID;
  exerciseName: string;
  category: ExerciseCategory;
  targetSets: number;
  targetReps: number | null;
  targetWeight: number | null;
  restSeconds: number | null;
  notes: string;
  order: number;
}

export interface WorkoutTemplate {
  id: ID;
  name: string;
  description: string;
  exercises: TemplateExercise[];
  tags: string[];
  color: string;
  lastUsedAt: Timestamp | null;
  timesUsed: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

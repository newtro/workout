import type { StrengthSet, WorkoutExercise } from '../types/workout';

/** Epley formula for estimated 1RM */
export function estimate1RM(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

/** Calculate total volume for a set of strength sets (reps * weight) */
export function calculateSetVolume(sets: StrengthSet[]): number {
  return sets
    .filter((s) => s.completed && !s.isWarmup)
    .reduce((total, s) => total + (s.reps ?? 0) * (s.weight ?? 0), 0);
}

/** Calculate total volume across all exercises in a workout */
export function calculateWorkoutVolume(exercises: WorkoutExercise[]): number {
  return exercises.reduce((total, ex) => total + calculateSetVolume(ex.sets), 0);
}

/** Calculate total sets completed */
export function calculateCompletedSets(exercises: WorkoutExercise[]): number {
  return exercises.reduce(
    (total, ex) => total + ex.sets.filter((s) => s.completed).length,
    0,
  );
}

/** Calculate pace (min/km) from distance and duration */
export function calculatePace(
  distanceKm: number | null,
  durationMinutes: number | null,
): number | null {
  if (!distanceKm || !durationMinutes || distanceKm <= 0) return null;
  return durationMinutes / distanceKm;
}

export function formatPace(pace: number | null): string {
  if (pace === null) return '—';
  const mins = Math.floor(pace);
  const secs = Math.round((pace - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')} /km`;
}

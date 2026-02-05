import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Workout } from '../types/workout';

interface WorkoutStore {
  workouts: Workout[];
  addWorkout: (workout: Workout) => void;
  updateWorkout: (id: string, updates: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  getWorkout: (id: string) => Workout | undefined;
  getActiveWorkout: () => Workout | undefined;
  completeWorkout: (id: string, rating?: number | null) => void;
  abandonWorkout: (id: string) => void;
  getRecentWorkouts: (limit: number) => Workout[];
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      workouts: [],
      addWorkout: (workout) =>
        set((state) => ({ workouts: [...state.workouts, workout] })),
      updateWorkout: (id, updates) =>
        set((state) => ({
          workouts: state.workouts.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        })),
      deleteWorkout: (id) =>
        set((state) => ({
          workouts: state.workouts.filter((w) => w.id !== id),
        })),
      getWorkout: (id) => get().workouts.find((w) => w.id === id),
      getActiveWorkout: () =>
        get().workouts.find((w) => w.status === 'in_progress'),
      completeWorkout: (id, rating) => {
        const now = Date.now();
        set((state) => ({
          workouts: state.workouts.map((w) => {
            if (w.id !== id) return w;
            const durationMinutes = Math.round(
              (now - w.startedAt) / 1000 / 60
            );
            return {
              ...w,
              status: 'completed' as const,
              completedAt: now,
              durationMinutes,
              rating: rating ?? w.rating,
            };
          }),
        }));
      },
      abandonWorkout: (id) =>
        set((state) => ({
          workouts: state.workouts.map((w) =>
            w.id === id ? { ...w, status: 'abandoned' as const } : w
          ),
        })),
      getRecentWorkouts: (limit) =>
        get()
          .workouts.filter((w) => w.status === 'completed')
          .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))
          .slice(0, limit),
    }),
    { name: 'workout-tracker-workouts', version: 1 }
  )
);

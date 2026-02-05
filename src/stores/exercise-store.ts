import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Exercise, ExerciseCategory, MuscleGroup } from '../types/exercise';
import { getDefaultExercises } from '../data/exercises';

interface ExerciseStore {
  exercises: Exercise[];
  initialized: boolean;
  initializeExercises: () => void;
  addExercise: (exercise: Exercise) => void;
  updateExercise: (id: string, updates: Partial<Exercise>) => void;
  deleteExercise: (id: string) => void;
  getExercise: (id: string) => Exercise | undefined;
  getExercisesByCategory: (category: ExerciseCategory) => Exercise[];
  getExercisesByMuscle: (muscle: MuscleGroup) => Exercise[];
  searchExercises: (query: string) => Exercise[];
}

export const useExerciseStore = create<ExerciseStore>()(
  persist(
    (set, get) => ({
      exercises: [],
      initialized: false,
      initializeExercises: () => {
        if (!get().initialized) {
          set({ exercises: getDefaultExercises(), initialized: true });
        }
      },
      addExercise: (exercise) =>
        set((state) => ({ exercises: [...state.exercises, exercise] })),
      updateExercise: (id, updates) =>
        set((state) => ({
          exercises: state.exercises.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),
      deleteExercise: (id) =>
        set((state) => ({
          exercises: state.exercises.filter((e) => e.id !== id),
        })),
      getExercise: (id) => get().exercises.find((e) => e.id === id),
      getExercisesByCategory: (cat) =>
        get().exercises.filter((e) => e.category === cat),
      getExercisesByMuscle: (muscle) =>
        get().exercises.filter(
          (e) =>
            e.primaryMuscle === muscle ||
            e.secondaryMuscles.includes(muscle)
        ),
      searchExercises: (query) => {
        const q = query.toLowerCase();
        return get().exercises.filter(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            e.primaryMuscle.toLowerCase().includes(q) ||
            e.category.toLowerCase().includes(q)
        );
      },
    }),
    { name: 'workout-tracker-exercises', version: 1 }
  )
);

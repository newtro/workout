import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIStore {
  activeWorkoutId: string | null;
  isAddExerciseOpen: boolean;
  restTimerEndAt: number | null;
  setActiveWorkout: (id: string | null) => void;
  setAddExerciseOpen: (open: boolean) => void;
  startRestTimer: (seconds: number) => void;
  clearRestTimer: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      activeWorkoutId: null,
      isAddExerciseOpen: false,
      restTimerEndAt: null,
      setActiveWorkout: (id) => set({ activeWorkoutId: id }),
      setAddExerciseOpen: (open) => set({ isAddExerciseOpen: open }),
      startRestTimer: (seconds) =>
        set({ restTimerEndAt: Date.now() + seconds * 1000 }),
      clearRestTimer: () => set({ restTimerEndAt: null }),
    }),
    {
      name: 'workout-tracker-ui',
      version: 1,
      partialize: (state) => ({ activeWorkoutId: state.activeWorkoutId }),
    }
  )
);

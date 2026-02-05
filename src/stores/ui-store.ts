import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light';

interface UIStore {
  activeWorkoutId: string | null;
  theme: Theme;
  isAddExerciseOpen: boolean;
  restTimerEndAt: number | null;
  setActiveWorkout: (id: string | null) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setAddExerciseOpen: (open: boolean) => void;
  startRestTimer: (seconds: number) => void;
  clearRestTimer: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      activeWorkoutId: null,
      theme: 'dark' as Theme,
      isAddExerciseOpen: false,
      restTimerEndAt: null,
      setActiveWorkout: (id) => set({ activeWorkoutId: id }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setAddExerciseOpen: (open) => set({ isAddExerciseOpen: open }),
      startRestTimer: (seconds) =>
        set({ restTimerEndAt: Date.now() + seconds * 1000 }),
      clearRestTimer: () => set({ restTimerEndAt: null }),
    }),
    {
      name: 'workout-tracker-ui',
      version: 2,
      partialize: (state) => ({
        activeWorkoutId: state.activeWorkoutId,
        theme: state.theme,
      }),
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WorkoutTemplate } from '../types/template';

interface TemplateStore {
  templates: WorkoutTemplate[];
  addTemplate: (template: WorkoutTemplate) => void;
  updateTemplate: (id: string, updates: Partial<WorkoutTemplate>) => void;
  deleteTemplate: (id: string) => void;
  getTemplate: (id: string) => WorkoutTemplate | undefined;
  recordTemplateUse: (id: string) => void;
}

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set, get) => ({
      templates: [],
      addTemplate: (template) =>
        set((state) => ({ templates: [...state.templates, template] })),
      updateTemplate: (id, updates) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
          ),
        })),
      deleteTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        })),
      getTemplate: (id) => get().templates.find((t) => t.id === id),
      recordTemplateUse: (id) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id
              ? {
                  ...t,
                  timesUsed: t.timesUsed + 1,
                  lastUsedAt: Date.now(),
                  updatedAt: Date.now(),
                }
              : t
          ),
        })),
    }),
    { name: 'workout-tracker-templates', version: 1 }
  )
);

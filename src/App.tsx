import { Routes, Route } from 'react-router'
import { Toaster } from 'react-hot-toast'
import { Shell } from './components/layout/Shell'
import { DashboardPage } from './pages/DashboardPage'
import { LogWorkoutPage } from './pages/LogWorkoutPage'
import { HistoryPage } from './pages/HistoryPage'
import { WorkoutDetailPage } from './pages/WorkoutDetailPage'
import { ProgressPage } from './pages/ProgressPage'
import { ExerciseLibraryPage } from './pages/ExerciseLibraryPage'
import { ExerciseDetailPage } from './pages/ExerciseDetailPage'
import { TemplatesPage } from './pages/TemplatesPage'
import { TemplateDetailPage } from './pages/TemplateDetailPage'
import { useExerciseStore } from './stores/exercise-store'
import { useEffect } from 'react'

export default function App() {
  const initializeExercises = useExerciseStore((s) => s.initializeExercises)

  useEffect(() => {
    initializeExercises()
  }, [initializeExercises])

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#27272a',
            color: '#f4f4f5',
            border: '1px solid #3f3f46',
            borderRadius: '12px',
          },
        }}
      />
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<DashboardPage />} />
          <Route path="log" element={<LogWorkoutPage />} />
          <Route path="log/:templateId" element={<LogWorkoutPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="history/:workoutId" element={<WorkoutDetailPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="exercises" element={<ExerciseLibraryPage />} />
          <Route path="exercises/:exerciseId" element={<ExerciseDetailPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="templates/:templateId" element={<TemplateDetailPage />} />
        </Route>
      </Routes>
    </>
  )
}

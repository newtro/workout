import { useParams, useNavigate } from 'react-router'
import { useMemo } from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { useExerciseStore } from '../stores/exercise-store'
import { useWorkoutStore } from '../stores/workout-store'
import { formatDate, formatWeight } from '../lib/formatters'
import { estimate1RM } from '../lib/calculators'

export function ExerciseDetailPage() {
  const { exerciseId } = useParams()
  const navigate = useNavigate()
  const getExercise = useExerciseStore((s) => s.getExercise)
  const workouts = useWorkoutStore((s) => s.workouts)

  const exercise = exerciseId ? getExercise(exerciseId) : undefined

  const history = useMemo(() => {
    if (!exerciseId) return []
    return workouts
      .filter((w) => w.status === 'completed')
      .flatMap((w) =>
        w.exercises
          .filter((e) => e.exerciseId === exerciseId)
          .map((e) => ({
            date: w.completedAt ?? w.createdAt,
            workoutName: w.name,
            sets: e.sets,
            cardio: e.cardio,
          })),
      )
      .sort((a, b) => b.date - a.date)
  }, [exerciseId, workouts])

  const personalRecords = useMemo(() => {
    let maxWeight = 0
    let maxReps = 0
    let max1RM = 0

    history.forEach((h) => {
      h.sets.forEach((s) => {
        if (s.completed && !s.isWarmup) {
          if (s.weight && s.weight > maxWeight) maxWeight = s.weight
          if (s.reps && s.reps > maxReps) maxReps = s.reps
          if (s.weight && s.reps) {
            const est = estimate1RM(s.weight, s.reps)
            if (est > max1RM) max1RM = est
          }
        }
      })
    })

    return { maxWeight, maxReps, max1RM }
  }, [history])

  if (!exercise) {
    return (
      <div className="p-4 lg:p-8 max-w-3xl mx-auto">
        <EmptyState
          icon="🔍"
          title="Exercise not found"
          description="This exercise doesn't exist or was deleted"
          action={<Button variant="secondary" onClick={() => navigate('/exercises')}>Back to Library</Button>}
        />
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <Header
        title={exercise.name}
        actions={
          <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
            Back
          </Button>
        }
      />

      {/* Exercise info */}
      <div className="flex items-center gap-2 mb-6">
        <Badge variant={exercise.category}>{exercise.category}</Badge>
        <span className="text-sm text-surface-400">
          {exercise.primaryMuscle.replace('_', ' ')} · {exercise.equipment}
        </span>
        {exercise.isCustom && (
          <span className="text-xs text-energy-400 font-medium">Custom</span>
        )}
      </div>

      {/* Personal Records */}
      {history.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card>
            <p className="text-sm text-surface-400">Max Weight</p>
            <p className="text-xl font-extrabold tabular-nums text-gold-500">
              {formatWeight(personalRecords.maxWeight || null)}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-surface-400">Max Reps</p>
            <p className="text-xl font-extrabold tabular-nums text-gold-500">
              {personalRecords.maxReps || '—'}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-surface-400">Est. 1RM</p>
            <p className="text-xl font-extrabold tabular-nums text-gold-500">
              {formatWeight(personalRecords.max1RM || null)}
            </p>
          </Card>
        </div>
      )}

      {/* History */}
      <h2 className="text-lg font-bold mb-3">History</h2>
      {history.length === 0 ? (
        <EmptyState
          icon="📊"
          title="No history yet"
          description="Use this exercise in a workout to see your progress"
        />
      ) : (
        <div className="space-y-3">
          {history.map((entry, i) => (
            <Card key={i}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{entry.workoutName}</p>
                <p className="text-sm text-surface-400">{formatDate(entry.date)}</p>
              </div>
              {entry.cardio ? (
                <p className="text-sm text-surface-300">
                  {entry.cardio.durationMinutes}min · {entry.cardio.distanceKm}km
                </p>
              ) : (
                <div className="space-y-0.5">
                  {entry.sets
                    .filter((s) => s.completed)
                    .map((s, j) => (
                      <p key={j} className="text-sm text-surface-300 tabular-nums">
                        Set {s.setNumber}: {formatWeight(s.weight)} × {s.reps ?? 0}
                        {s.isWarmup && <span className="text-surface-500 ml-1">(warmup)</span>}
                      </p>
                    ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

import { useParams, useNavigate, Link } from 'react-router'
import { Header } from '../components/layout/Header'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { useWorkoutStore } from '../stores/workout-store'
import { formatDate, formatTime, formatDuration, formatWeight, formatVolume, formatDistance } from '../lib/formatters'
import { calculateWorkoutVolume, calculateCompletedSets, calculateSetVolume, calculatePace, formatPace } from '../lib/calculators'

export function WorkoutDetailPage() {
  const { workoutId } = useParams()
  const navigate = useNavigate()
  const getWorkout = useWorkoutStore((s) => s.getWorkout)
  const workout = workoutId ? getWorkout(workoutId) : undefined

  if (!workout) {
    return (
      <div className="p-4 lg:p-8 max-w-3xl mx-auto">
        <EmptyState
          icon="🔍"
          title="Workout not found"
          description="This workout doesn't exist or was deleted"
          action={
            <Link to="/history">
              <Button variant="secondary">Back to History</Button>
            </Link>
          }
        />
      </div>
    )
  }

  const totalVolume = calculateWorkoutVolume(workout.exercises)
  const totalSets = calculateCompletedSets(workout.exercises)

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <Header
        title={workout.name}
        actions={
          <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
            Back
          </Button>
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Card>
          <p className="text-sm text-surface-400">Date</p>
          <p className="font-bold">{formatDate(workout.completedAt ?? workout.createdAt)}</p>
          <p className="text-xs text-surface-500">{formatTime(workout.startedAt)}</p>
        </Card>
        <Card>
          <p className="text-sm text-surface-400">Duration</p>
          <p className="font-bold text-xl tabular-nums">{formatDuration(workout.durationMinutes)}</p>
        </Card>
        <Card>
          <p className="text-sm text-surface-400">Volume</p>
          <p className="font-bold text-xl tabular-nums">{formatVolume(totalVolume)}</p>
        </Card>
        <Card>
          <p className="text-sm text-surface-400">Sets</p>
          <p className="font-bold text-xl tabular-nums">{totalSets}</p>
        </Card>
      </div>

      {workout.rating && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-surface-400">Rating:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((r) => (
              <span
                key={r}
                className={`text-lg ${r <= workout.rating! ? 'text-gold-500' : 'text-surface-700'}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Exercises */}
      <div className="space-y-4">
        {workout.exercises.map((we) => (
          <Card key={we.id}>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-bold text-lg">{we.exerciseName}</h3>
              <Badge variant={we.category}>{we.category}</Badge>
            </div>

            {we.cardio ? (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-surface-400">Duration</p>
                  <p className="font-bold tabular-nums">{formatDuration(we.cardio.durationMinutes)}</p>
                </div>
                <div>
                  <p className="text-surface-400">Distance</p>
                  <p className="font-bold tabular-nums">{formatDistance(we.cardio.distanceKm)}</p>
                </div>
                {we.cardio.durationMinutes && we.cardio.distanceKm && (
                  <div>
                    <p className="text-surface-400">Pace</p>
                    <p className="font-bold tabular-nums">
                      {formatPace(calculatePace(we.cardio.distanceKm, we.cardio.durationMinutes))}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-2 text-xs text-surface-500 mb-1 px-1">
                  <span>SET</span>
                  <span>WEIGHT</span>
                  <span>REPS</span>
                  <span></span>
                </div>
                {we.sets.map((set) => (
                  <div
                    key={set.id}
                    className={`grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-2 items-center py-1 px-1 rounded text-sm ${
                      set.completed ? 'text-surface-100' : 'text-surface-500'
                    }`}
                  >
                    <span className="text-surface-500 tabular-nums">
                      {set.isWarmup ? 'W' : set.setNumber}
                    </span>
                    <span className="tabular-nums">{formatWeight(set.weight)}</span>
                    <span className="tabular-nums">{set.reps ?? '—'}</span>
                    <span>{set.completed ? '✓' : ''}</span>
                  </div>
                ))}
                <div className="mt-2 pt-2 border-t border-surface-800 text-sm text-surface-400">
                  Volume: {formatVolume(calculateSetVolume(we.sets))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {workout.notes && (
        <Card>
          <p className="text-sm text-surface-400 mb-1">Notes</p>
          <p className="text-surface-200">{workout.notes}</p>
        </Card>
      )}
    </div>
  )
}

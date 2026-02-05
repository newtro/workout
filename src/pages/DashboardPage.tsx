import { Link } from 'react-router'
import { Header } from '../components/layout/Header'
import { Card } from '../components/ui/Card'
import { useWorkoutStore } from '../stores/workout-store'
import { useUIStore } from '../stores/ui-store'
import { formatRelativeDate, formatDuration, formatVolume } from '../lib/formatters'
import { calculateWorkoutVolume, calculateCompletedSets } from '../lib/calculators'
import { Badge } from '../components/ui/Badge'

export function DashboardPage() {
  const workouts = useWorkoutStore((s) => s.workouts)
  const activeWorkoutId = useUIStore((s) => s.activeWorkoutId)

  const completedWorkouts = workouts
    .filter((w) => w.status === 'completed')
    .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))

  const recentWorkouts = completedWorkouts.slice(0, 5)
  const thisWeek = completedWorkouts.filter(
    (w) => (w.completedAt ?? 0) > Date.now() - 7 * 86400000
  )
  const totalVolumeThisWeek = thisWeek.reduce(
    (sum, w) => sum + calculateWorkoutVolume(w.exercises),
    0
  )

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <Header title="Dashboard" />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Card>
          <p className="text-sm text-surface-400">This Week</p>
          <p className="text-2xl font-extrabold tabular-nums">{thisWeek.length}</p>
          <p className="text-xs text-surface-500">workouts</p>
        </Card>
        <Card>
          <p className="text-sm text-surface-400">Volume</p>
          <p className="text-2xl font-extrabold tabular-nums">
            {formatVolume(totalVolumeThisWeek)}
          </p>
          <p className="text-xs text-surface-500">this week</p>
        </Card>
        <Card>
          <p className="text-sm text-surface-400">Total</p>
          <p className="text-2xl font-extrabold tabular-nums">{completedWorkouts.length}</p>
          <p className="text-xs text-surface-500">workouts logged</p>
        </Card>
        <Card>
          <p className="text-sm text-surface-400">Streak</p>
          <p className="text-2xl font-extrabold tabular-nums">
            {thisWeek.length > 0 ? thisWeek.length : 0}
          </p>
          <p className="text-xs text-surface-500">days this week</p>
        </Card>
      </div>

      {/* Start Workout CTA */}
      <div className="mb-6">
        {activeWorkoutId ? (
          <Link to="/log">
            <div className="gradient-energy rounded-2xl p-5 text-white cursor-pointer hover:opacity-90 transition-opacity">
              <p className="text-sm font-medium opacity-80">Workout in progress</p>
              <p className="text-xl font-extrabold">Tap to resume</p>
            </div>
          </Link>
        ) : (
          <div className="flex gap-3">
            <Link to="/log" className="flex-1">
              <div className="gradient-brand rounded-2xl p-5 text-white cursor-pointer hover:opacity-90 transition-opacity">
                <p className="text-sm font-medium opacity-80">Ready to go?</p>
                <p className="text-xl font-extrabold">Start Empty Workout</p>
              </div>
            </Link>
            <Link to="/templates" className="flex-1">
              <Card>
                <p className="text-sm text-surface-400">Or choose a</p>
                <p className="text-xl font-extrabold text-brand-400">Template</p>
              </Card>
            </Link>
          </div>
        )}
      </div>

      {/* Recent Workouts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Recent Workouts</h2>
          <Link to="/history" className="text-sm text-brand-400 hover:text-brand-300">
            View all
          </Link>
        </div>
        {recentWorkouts.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-4xl mb-2">💪</p>
              <p className="text-surface-400">No workouts yet. Start your first one!</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-2">
            {recentWorkouts.map((workout) => (
              <Link key={workout.id} to={`/history/${workout.id}`}>
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">{workout.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-surface-400">
                          {formatRelativeDate(workout.completedAt ?? workout.createdAt)}
                        </span>
                        <span className="text-surface-600">·</span>
                        <span className="text-sm text-surface-400">
                          {formatDuration(workout.durationMinutes)}
                        </span>
                        <span className="text-surface-600">·</span>
                        <span className="text-sm text-surface-400">
                          {calculateCompletedSets(workout.exercises)} sets
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...new Set(workout.exercises.map((e) => e.category))].map((cat) => (
                        <Badge key={cat} variant={cat}>
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

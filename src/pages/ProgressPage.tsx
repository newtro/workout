import { useState, useMemo } from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/ui/Card'
import { Tabs } from '../components/ui/Tabs'
import { EmptyState } from '../components/ui/EmptyState'
import { useWorkoutStore } from '../stores/workout-store'
import { useExerciseStore } from '../stores/exercise-store'
import { calculateWorkoutVolume, calculateCompletedSets, estimate1RM } from '../lib/calculators'
import { formatVolume, formatDuration } from '../lib/formatters'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { format, startOfWeek, subDays } from 'date-fns'

const timeRangeTabs = [
  { key: '1w', label: '1W' },
  { key: '1m', label: '1M' },
  { key: '3m', label: '3M' },
  { key: '1y', label: '1Y' },
  { key: 'all', label: 'All' },
]

const MUSCLE_COLORS: Record<string, string> = {
  chest: '#8b5cf6',
  back: '#0ea5e9',
  shoulders: '#f97316',
  biceps: '#10b981',
  triceps: '#ec4899',
  core: '#eab308',
  quads: '#6c2bd9',
  hamstrings: '#ef4444',
  glutes: '#38bdf8',
  calves: '#34d399',
  forearms: '#fb923c',
  full_body: '#a855f7',
  cardio: '#0ea5e9',
}

export function ProgressPage() {
  const workouts = useWorkoutStore((s) => s.workouts)
  const exercises = useExerciseStore((s) => s.exercises)
  const [timeRange, setTimeRange] = useState('1m')
  const [selectedExercise, setSelectedExercise] = useState<string>('')

  const cutoffDate = useMemo(() => {
    const now = Date.now()
    switch (timeRange) {
      case '1w': return subDays(now, 7).getTime()
      case '1m': return subDays(now, 30).getTime()
      case '3m': return subDays(now, 90).getTime()
      case '1y': return subDays(now, 365).getTime()
      default: return 0
    }
  }, [timeRange])

  const completed = useMemo(
    () =>
      workouts
        .filter((w) => w.status === 'completed' && (w.completedAt ?? 0) >= cutoffDate)
        .sort((a, b) => (a.completedAt ?? 0) - (b.completedAt ?? 0)),
    [workouts, cutoffDate],
  )

  // Weekly volume data
  const weeklyVolume = useMemo(() => {
    const weeks = new Map<string, number>()
    completed.forEach((w) => {
      const weekStart = format(startOfWeek(w.completedAt ?? w.createdAt), 'MMM d')
      const vol = calculateWorkoutVolume(w.exercises)
      weeks.set(weekStart, (weeks.get(weekStart) ?? 0) + vol)
    })
    return Array.from(weeks.entries()).map(([week, volume]) => ({ week, volume }))
  }, [completed])

  // Workout frequency data
  const weeklyFrequency = useMemo(() => {
    const weeks = new Map<string, number>()
    completed.forEach((w) => {
      const weekStart = format(startOfWeek(w.completedAt ?? w.createdAt), 'MMM d')
      weeks.set(weekStart, (weeks.get(weekStart) ?? 0) + 1)
    })
    return Array.from(weeks.entries()).map(([week, count]) => ({ week, count }))
  }, [completed])

  // Muscle group breakdown
  const muscleBreakdown = useMemo(() => {
    const groups = new Map<string, number>()
    completed.forEach((w) => {
      w.exercises.forEach((we) => {
        const exercise = exercises.find((e) => e.id === we.exerciseId)
        if (exercise) {
          const vol = we.sets
            .filter((s) => s.completed && !s.isWarmup)
            .reduce((sum, s) => sum + (s.reps ?? 0) * (s.weight ?? 0), 0)
          const muscle = exercise.primaryMuscle
          groups.set(muscle, (groups.get(muscle) ?? 0) + vol)
        }
      })
    })
    return Array.from(groups.entries())
      .map(([muscle, volume]) => ({ muscle: muscle.replace('_', ' '), volume }))
      .sort((a, b) => b.volume - a.volume)
  }, [completed, exercises])

  // Exercise progression data
  const exerciseProgression = useMemo(() => {
    if (!selectedExercise) return []
    return completed
      .flatMap((w) =>
        w.exercises
          .filter((e) => e.exerciseId === selectedExercise)
          .map((e) => {
            const bestSet = e.sets
              .filter((s) => s.completed && !s.isWarmup && s.weight)
              .sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))[0]
            return bestSet
              ? {
                  date: format(w.completedAt ?? w.createdAt, 'MMM d'),
                  weight: bestSet.weight ?? 0,
                  est1rm: bestSet.reps ? estimate1RM(bestSet.weight ?? 0, bestSet.reps) : 0,
                }
              : null
          })
          .filter(Boolean),
      )
  }, [completed, selectedExercise])

  // Unique exercises used in workouts
  const usedExercises = useMemo(() => {
    const ids = new Set<string>()
    completed.forEach((w) => w.exercises.forEach((e) => ids.add(e.exerciseId)))
    return exercises.filter((e) => ids.has(e.id) && e.category === 'strength')
  }, [completed, exercises])

  const totalVolume = completed.reduce((sum, w) => sum + calculateWorkoutVolume(w.exercises), 0)
  const totalSets = completed.reduce((sum, w) => sum + calculateCompletedSets(w.exercises), 0)
  const avgDuration =
    completed.length > 0
      ? completed.reduce((sum, w) => sum + (w.durationMinutes ?? 0), 0) / completed.length
      : 0

  const tooltipStyle = {
    backgroundColor: '#18181b',
    border: '1px solid #3f3f46',
    borderRadius: '12px',
    color: '#f4f4f5',
  }

  if (completed.length === 0) {
    return (
      <div className="p-4 lg:p-8 max-w-4xl mx-auto">
        <Header title="Progress" />
        <EmptyState
          icon="📊"
          title="No data yet"
          description="Complete workouts to see your progress charts"
        />
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <Header title="Progress" />

      <div className="mb-6">
        <Tabs tabs={timeRangeTabs} activeTab={timeRange} onChange={setTimeRange} />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Card>
          <p className="text-sm text-surface-400">Workouts</p>
          <p className="text-2xl font-extrabold tabular-nums">{completed.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-surface-400">Total Volume</p>
          <p className="text-2xl font-extrabold tabular-nums">{formatVolume(totalVolume)}</p>
        </Card>
        <Card>
          <p className="text-sm text-surface-400">Total Sets</p>
          <p className="text-2xl font-extrabold tabular-nums">{totalSets}</p>
        </Card>
        <Card>
          <p className="text-sm text-surface-400">Avg Duration</p>
          <p className="text-2xl font-extrabold tabular-nums">{formatDuration(avgDuration)}</p>
        </Card>
      </div>

      {/* Weekly Volume Chart */}
      {weeklyVolume.length > 1 && (
        <Card>
          <h3 className="text-lg font-bold mb-4">Weekly Volume</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyVolume}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="week" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="volume" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Workout Frequency */}
      {weeklyFrequency.length > 1 && (
        <Card>
          <h3 className="text-lg font-bold mb-4 mt-4">Workout Frequency</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyFrequency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="week" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Muscle Group Breakdown */}
      {muscleBreakdown.length > 0 && (
        <Card>
          <h3 className="text-lg font-bold mb-4 mt-4">Muscle Group Breakdown</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={muscleBreakdown}
                  dataKey="volume"
                  nameKey="muscle"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {muscleBreakdown.map((entry) => (
                    <Cell
                      key={entry.muscle}
                      fill={MUSCLE_COLORS[entry.muscle.replace(' ', '_')] ?? '#71717a'}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1">
              {muscleBreakdown.slice(0, 6).map((entry) => (
                <div key={entry.muscle} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: MUSCLE_COLORS[entry.muscle.replace(' ', '_')] ?? '#71717a' }}
                    />
                    <span className="capitalize">{entry.muscle}</span>
                  </div>
                  <span className="text-surface-400 tabular-nums">{formatVolume(entry.volume)}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Exercise Progression */}
      {usedExercises.length > 0 && (
        <Card>
          <h3 className="text-lg font-bold mb-4 mt-4">Exercise Progression</h3>
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="w-full bg-surface-800 border border-surface-700 rounded-xl px-3 py-2 text-surface-100 outline-none focus:border-brand-500 mb-4"
          >
            <option value="">Select an exercise</option>
            {usedExercises.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>

          {exerciseProgression.length > 1 && (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={exerciseProgression}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="est1rm"
                  stroke="#f97316"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
      )}
    </div>
  )
}

import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import { Header } from '../components/layout/Header'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Tabs } from '../components/ui/Tabs'
import { SearchInput } from '../components/ui/SearchInput'
import { EmptyState } from '../components/ui/EmptyState'
import { useWorkoutStore } from '../stores/workout-store'
import { formatDate, formatDuration, formatVolume } from '../lib/formatters'
import { calculateWorkoutVolume, calculateCompletedSets } from '../lib/calculators'
import type { ExerciseCategory } from '../types/exercise'

const categoryTabs = [
  { key: 'all', label: 'All' },
  { key: 'strength', label: 'Strength' },
  { key: 'cardio', label: 'Cardio' },
  { key: 'hiit', label: 'HIIT' },
  { key: 'flexibility', label: 'Flexibility' },
]

export function HistoryPage() {
  const workouts = useWorkoutStore((s) => s.workouts)
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')

  const filteredWorkouts = useMemo(() => {
    let filtered = workouts.filter((w) => w.status === 'completed')

    if (category !== 'all') {
      filtered = filtered.filter((w) =>
        w.exercises.some((e) => e.category === category),
      )
    }

    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.exercises.some((e) => e.exerciseName.toLowerCase().includes(q)),
      )
    }

    return filtered.sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))
  }, [workouts, category, search])

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <Header title="History" />

      <div className="mb-4">
        <SearchInput
          placeholder="Search workouts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
        />
      </div>

      <div className="mb-4">
        <Tabs tabs={categoryTabs} activeTab={category} onChange={setCategory} />
      </div>

      {filteredWorkouts.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No workouts found"
          description={search ? 'Try a different search term' : 'Complete your first workout to see it here'}
        />
      ) : (
        <div className="space-y-2">
          {filteredWorkouts.map((workout) => (
            <Link key={workout.id} to={`/history/${workout.id}`}>
              <Card>
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold truncate">{workout.name}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-surface-400">
                      <span>{formatDate(workout.completedAt ?? workout.createdAt)}</span>
                      <span className="text-surface-600">·</span>
                      <span>{formatDuration(workout.durationMinutes)}</span>
                      <span className="text-surface-600">·</span>
                      <span>{calculateCompletedSets(workout.exercises)} sets</span>
                      <span className="text-surface-600">·</span>
                      <span>{formatVolume(calculateWorkoutVolume(workout.exercises))}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-3">
                    {[...new Set(workout.exercises.map((e) => e.category))].map((cat) => (
                      <Badge key={cat} variant={cat as ExerciseCategory}>
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
                {workout.rating && (
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <span
                        key={r}
                        className={`text-xs ${r <= workout.rating! ? 'text-gold-500' : 'text-surface-700'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

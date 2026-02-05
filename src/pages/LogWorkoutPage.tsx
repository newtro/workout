import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Header } from '../components/layout/Header'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { NumberInput } from '../components/ui/NumberInput'
import { Badge } from '../components/ui/Badge'
import { SearchInput } from '../components/ui/SearchInput'
import { useWorkoutStore } from '../stores/workout-store'
import { useExerciseStore } from '../stores/exercise-store'
import { useTemplateStore } from '../stores/template-store'
import { useUIStore } from '../stores/ui-store'
import { generateId } from '../lib/id'
import { formatDuration, formatVolume } from '../lib/formatters'
import { calculateWorkoutVolume, calculateCompletedSets } from '../lib/calculators'
import type { Workout, WorkoutExercise, StrengthSet } from '../types/workout'
import type { Exercise } from '../types/exercise'
import toast from 'react-hot-toast'

function createEmptySet(setNumber: number): StrengthSet {
  return {
    id: generateId(),
    setNumber,
    reps: null,
    weight: null,
    rpe: null,
    isWarmup: false,
    isDropset: false,
    completed: false,
  }
}

function createWorkoutExercise(exercise: Exercise, order: number): WorkoutExercise {
  return {
    id: generateId(),
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    category: exercise.category,
    sets: exercise.category === 'cardio' || exercise.category === 'flexibility'
      ? []
      : [createEmptySet(1)],
    cardio: exercise.category === 'cardio'
      ? { durationMinutes: null, distanceKm: null, avgHeartRate: null, calories: null }
      : null,
    notes: '',
    order,
  }
}

export function LogWorkoutPage() {
  const { templateId } = useParams()
  const navigate = useNavigate()
  const exercises = useExerciseStore((s) => s.exercises)
  const getTemplate = useTemplateStore((s) => s.getTemplate)
  const recordTemplateUse = useTemplateStore((s) => s.recordTemplateUse)
  const addWorkout = useWorkoutStore((s) => s.addWorkout)
  const updateWorkout = useWorkoutStore((s) => s.updateWorkout)
  const getWorkout = useWorkoutStore((s) => s.getWorkout)
  const completeWorkout = useWorkoutStore((s) => s.completeWorkout)
  const { activeWorkoutId, setActiveWorkout, isAddExerciseOpen, setAddExerciseOpen } = useUIStore()

  const [workout, setWorkout] = useState<Workout | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [summaryRating, setSummaryRating] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [elapsedMinutes, setElapsedMinutes] = useState(0)

  // Initialize or resume workout
  useEffect(() => {
    if (activeWorkoutId) {
      const existing = getWorkout(activeWorkoutId)
      if (existing && existing.status === 'in_progress') {
        setWorkout(existing)
        return
      }
    }

    // Create new workout
    let name = 'Workout'
    const workoutExercises: WorkoutExercise[] = []

    if (templateId) {
      const template = getTemplate(templateId)
      if (template) {
        name = template.name
        template.exercises.forEach((te, i) => {
          const exercise = exercises.find((e) => e.id === te.exerciseId)
          if (exercise) {
            const we = createWorkoutExercise(exercise, i)
            // Pre-fill sets from template
            if (te.targetSets > 0 && we.sets.length > 0) {
              we.sets = Array.from({ length: te.targetSets }, (_, j) => ({
                ...createEmptySet(j + 1),
                weight: te.targetWeight,
                reps: te.targetReps,
              }))
            }
            workoutExercises.push(we)
          }
        })
        recordTemplateUse(templateId)
      }
    }

    const newWorkout: Workout = {
      id: generateId(),
      name,
      templateId: templateId ?? null,
      exercises: workoutExercises,
      status: 'in_progress',
      startedAt: Date.now(),
      completedAt: null,
      durationMinutes: null,
      notes: '',
      rating: null,
      createdAt: Date.now(),
    }

    addWorkout(newWorkout)
    setActiveWorkout(newWorkout.id)
    setWorkout(newWorkout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Timer
  useEffect(() => {
    if (!workout) return
    const interval = setInterval(() => {
      setElapsedMinutes(Math.floor((Date.now() - workout.startedAt) / 60000))
    }, 10000)
    setElapsedMinutes(Math.floor((Date.now() - workout.startedAt) / 60000))
    return () => clearInterval(interval)
  }, [workout?.startedAt]) // eslint-disable-line react-hooks/exhaustive-deps

  // Persist workout changes
  useEffect(() => {
    if (workout) {
      updateWorkout(workout.id, {
        exercises: workout.exercises,
        name: workout.name,
        notes: workout.notes,
      })
    }
  }, [workout?.exercises, workout?.name, workout?.notes]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!workout) return null

  const handleAddExercise = (exercise: Exercise) => {
    setWorkout((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        exercises: [
          ...prev.exercises,
          createWorkoutExercise(exercise, prev.exercises.length),
        ],
      }
    })
    setAddExerciseOpen(false)
  }

  const handleUpdateSet = (
    exerciseIdx: number,
    setIdx: number,
    updates: Partial<StrengthSet>,
  ) => {
    setWorkout((prev) => {
      if (!prev) return prev
      const newExercises = [...prev.exercises]
      const newSets = [...newExercises[exerciseIdx].sets]
      newSets[setIdx] = { ...newSets[setIdx], ...updates }
      newExercises[exerciseIdx] = { ...newExercises[exerciseIdx], sets: newSets }
      return { ...prev, exercises: newExercises }
    })
  }

  const handleAddSet = (exerciseIdx: number) => {
    setWorkout((prev) => {
      if (!prev) return prev
      const newExercises = [...prev.exercises]
      const currentSets = newExercises[exerciseIdx].sets
      const lastSet = currentSets[currentSets.length - 1]
      const newSet = createEmptySet(currentSets.length + 1)
      if (lastSet) {
        newSet.weight = lastSet.weight
        newSet.reps = lastSet.reps
      }
      newExercises[exerciseIdx] = {
        ...newExercises[exerciseIdx],
        sets: [...currentSets, newSet],
      }
      return { ...prev, exercises: newExercises }
    })
  }

  const handleRemoveSet = (exerciseIdx: number, setIdx: number) => {
    setWorkout((prev) => {
      if (!prev) return prev
      const newExercises = [...prev.exercises]
      newExercises[exerciseIdx] = {
        ...newExercises[exerciseIdx],
        sets: newExercises[exerciseIdx].sets
          .filter((_, i) => i !== setIdx)
          .map((s, i) => ({ ...s, setNumber: i + 1 })),
      }
      return { ...prev, exercises: newExercises }
    })
  }

  const handleRemoveExercise = (exerciseIdx: number) => {
    setWorkout((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        exercises: prev.exercises
          .filter((_, i) => i !== exerciseIdx)
          .map((e, i) => ({ ...e, order: i })),
      }
    })
  }

  const handleUpdateCardio = (
    exerciseIdx: number,
    updates: Partial<NonNullable<WorkoutExercise['cardio']>>,
  ) => {
    setWorkout((prev) => {
      if (!prev) return prev
      const newExercises = [...prev.exercises]
      newExercises[exerciseIdx] = {
        ...newExercises[exerciseIdx],
        cardio: { ...newExercises[exerciseIdx].cardio!, ...updates },
      }
      return { ...prev, exercises: newExercises }
    })
  }

  const handleFinish = () => {
    completeWorkout(workout.id, summaryRating ?? undefined)
    setActiveWorkout(null)
    toast.success('Workout saved!')
    navigate('/history/' + workout.id)
  }

  const filteredExercises = searchQuery
    ? exercises.filter(
        (e) =>
          e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.primaryMuscle.includes(searchQuery.toLowerCase()),
      )
    : exercises

  const totalVolume = calculateWorkoutVolume(workout.exercises)
  const totalSets = calculateCompletedSets(workout.exercises)

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <Header
        title={workout.name}
        actions={
          <div className="flex items-center gap-3">
            <span className="text-sm text-surface-400 tabular-nums">
              {formatDuration(elapsedMinutes)}
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowSummary(true)}
            >
              Finish
            </Button>
          </div>
        }
      />

      {/* Workout name edit */}
      <div className="mb-4">
        <input
          type="text"
          value={workout.name}
          onChange={(e) => setWorkout((p) => p ? { ...p, name: e.target.value } : p)}
          className="bg-transparent text-2xl font-extrabold text-surface-100 border-none outline-none w-full placeholder-surface-600"
          placeholder="Workout name..."
        />
      </div>

      {/* Quick stats bar */}
      <div className="flex gap-4 mb-6 text-sm text-surface-400">
        <span>{workout.exercises.length} exercises</span>
        <span>{totalSets} sets</span>
        <span>{formatVolume(totalVolume)}</span>
      </div>

      {/* Exercise entries */}
      <div className="space-y-4 mb-6">
        {workout.exercises.map((we, exIdx) => (
          <Card key={we.id}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{we.exerciseName}</h3>
                <Badge variant={we.category}>{we.category}</Badge>
              </div>
              <button
                onClick={() => handleRemoveExercise(exIdx)}
                className="text-surface-500 hover:text-fire-400 transition-colors p-1"
              >
                ✕
              </button>
            </div>

            {we.cardio !== null ? (
              /* Cardio entry */
              <div className="grid grid-cols-2 gap-3">
                <NumberInput
                  label="Duration (min)"
                  value={we.cardio.durationMinutes}
                  onChange={(v) => handleUpdateCardio(exIdx, { durationMinutes: v })}
                  step={1}
                />
                <NumberInput
                  label="Distance (km)"
                  value={we.cardio.distanceKm}
                  onChange={(v) => handleUpdateCardio(exIdx, { distanceKm: v })}
                  step={0.1}
                />
              </div>
            ) : (
              /* Strength sets */
              <div>
                {/* Set header */}
                <div className="grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-2 text-xs text-surface-500 mb-1 px-1">
                  <span>SET</span>
                  <span>WEIGHT</span>
                  <span>REPS</span>
                  <span></span>
                </div>

                {we.sets.map((set, setIdx) => (
                  <div
                    key={set.id}
                    className={`grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-2 items-center py-1.5 px-1 rounded-lg transition-colors ${
                      set.completed ? 'bg-success-500/10' : ''
                    }`}
                  >
                    <span className="text-sm text-surface-500 tabular-nums font-medium">
                      {set.isWarmup ? 'W' : set.setNumber}
                    </span>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={set.weight ?? ''}
                      onChange={(e) =>
                        handleUpdateSet(exIdx, setIdx, {
                          weight: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      placeholder="0"
                      className="bg-surface-800 border border-surface-700 rounded-lg px-2 py-1.5 text-sm tabular-nums text-center outline-none focus:border-brand-500 transition-colors"
                    />
                    <input
                      type="number"
                      inputMode="numeric"
                      value={set.reps ?? ''}
                      onChange={(e) =>
                        handleUpdateSet(exIdx, setIdx, {
                          reps: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      placeholder="0"
                      className="bg-surface-800 border border-surface-700 rounded-lg px-2 py-1.5 text-sm tabular-nums text-center outline-none focus:border-brand-500 transition-colors"
                    />
                    <button
                      onClick={() =>
                        handleUpdateSet(exIdx, setIdx, { completed: !set.completed })
                      }
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all text-sm ${
                        set.completed
                          ? 'bg-success-500 text-white'
                          : 'bg-surface-800 border border-surface-700 text-surface-500 hover:border-success-500'
                      }`}
                    >
                      ✓
                    </button>
                  </div>
                ))}

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleAddSet(exIdx)}
                    className="text-sm text-brand-400 hover:text-brand-300 font-medium py-1"
                  >
                    + Add Set
                  </button>
                  {we.sets.length > 1 && (
                    <button
                      onClick={() => handleRemoveSet(exIdx, we.sets.length - 1)}
                      className="text-sm text-surface-500 hover:text-fire-400 font-medium py-1"
                    >
                      - Remove Set
                    </button>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Add exercise button */}
      <Button
        variant="secondary"
        size="lg"
        onClick={() => setAddExerciseOpen(true)}
        className="w-full"
      >
        + Add Exercise
      </Button>

      {/* Add exercise modal */}
      <Modal
        isOpen={isAddExerciseOpen}
        onClose={() => setAddExerciseOpen(false)}
        title="Add Exercise"
      >
        <div className="mb-4">
          <SearchInput
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
          />
        </div>
        <div className="max-h-96 overflow-y-auto space-y-1">
          {filteredExercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => handleAddExercise(exercise)}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-surface-800 transition-colors flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{exercise.name}</p>
                <p className="text-sm text-surface-500">{exercise.primaryMuscle} · {exercise.equipment}</p>
              </div>
              <Badge variant={exercise.category}>{exercise.category}</Badge>
            </button>
          ))}
        </div>
      </Modal>

      {/* Workout summary modal */}
      <Modal
        isOpen={showSummary}
        onClose={() => setShowSummary(false)}
        title="Workout Complete!"
      >
        <div className="text-center py-4">
          <p className="text-5xl mb-4">🎉</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-2xl font-extrabold tabular-nums">{formatDuration(elapsedMinutes)}</p>
              <p className="text-sm text-surface-400">Duration</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold tabular-nums">{totalSets}</p>
              <p className="text-sm text-surface-400">Sets</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold tabular-nums">{formatVolume(totalVolume)}</p>
              <p className="text-sm text-surface-400">Volume</p>
            </div>
          </div>

          {/* Rating */}
          <p className="text-sm text-surface-400 mb-2">How was your workout?</p>
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                onClick={() => setSummaryRating(r)}
                className={`w-10 h-10 rounded-full text-lg transition-all ${
                  summaryRating === r
                    ? 'bg-brand-600 text-white scale-110'
                    : 'bg-surface-800 text-surface-400 hover:bg-surface-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <Button variant="primary" size="lg" onClick={handleFinish} className="w-full">
            Save Workout
          </Button>
        </div>
      </Modal>
    </div>
  )
}

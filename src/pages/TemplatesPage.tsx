import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Header } from '../components/layout/Header'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { SearchInput } from '../components/ui/SearchInput'
import { EmptyState } from '../components/ui/EmptyState'
import { useTemplateStore } from '../stores/template-store'
import { useExerciseStore } from '../stores/exercise-store'
import { generateId } from '../lib/id'
import { formatRelativeDate } from '../lib/formatters'
import type { WorkoutTemplate, TemplateExercise } from '../types/template'
import type { Exercise } from '../types/exercise'

const TEMPLATE_COLORS = [
  '#6c2bd9', '#0ea5e9', '#f97316', '#10b981', '#ef4444',
  '#ec4899', '#eab308', '#8b5cf6', '#38bdf8', '#34d399',
]

export function TemplatesPage() {
  const templates = useTemplateStore((s) => s.templates)
  const addTemplate = useTemplateStore((s) => s.addTemplate)
  const exercises = useExerciseStore((s) => s.exercises)
  const navigate = useNavigate()

  const [showForm, setShowForm] = useState(false)
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formExercises, setFormExercises] = useState<TemplateExercise[]>([])
  const [showExercisePicker, setShowExercisePicker] = useState(false)
  const [exerciseSearch, setExerciseSearch] = useState('')

  const handleAddExercise = (exercise: Exercise) => {
    const te: TemplateExercise = {
      id: generateId(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      category: exercise.category,
      targetSets: 3,
      targetReps: exercise.category === 'strength' ? 10 : null,
      targetWeight: null,
      restSeconds: 90,
      notes: '',
      order: formExercises.length,
    }
    setFormExercises((prev) => [...prev, te])
    setShowExercisePicker(false)
    setExerciseSearch('')
  }

  const handleRemoveExercise = (idx: number) => {
    setFormExercises((prev) =>
      prev.filter((_, i) => i !== idx).map((e, i) => ({ ...e, order: i })),
    )
  }

  const handleCreateTemplate = () => {
    if (!formName.trim()) return
    const template: WorkoutTemplate = {
      id: generateId(),
      name: formName.trim(),
      description: formDescription.trim(),
      exercises: formExercises,
      tags: [],
      color: TEMPLATE_COLORS[Math.floor(Math.random() * TEMPLATE_COLORS.length)],
      lastUsedAt: null,
      timesUsed: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    addTemplate(template)
    setShowForm(false)
    setFormName('')
    setFormDescription('')
    setFormExercises([])
  }

  const filteredExercises = exerciseSearch
    ? exercises.filter(
        (e) =>
          e.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
          e.primaryMuscle.includes(exerciseSearch.toLowerCase()),
      )
    : exercises

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <Header
        title="Templates"
        actions={
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            + New
          </Button>
        }
      />

      {templates.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No templates yet"
          description="Create a template to quickly start your favorite workouts"
          action={
            <Button variant="primary" onClick={() => setShowForm(true)}>
              Create Template
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {templates.map((template) => (
            <Link key={template.id} to={`/templates/${template.id}`}>
              <div className="relative rounded-2xl overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{ backgroundColor: template.color }}
                />
                <Card>
                  <div
                    className="w-10 h-1 rounded-full mb-3"
                    style={{ backgroundColor: template.color }}
                  />
                  <h3 className="font-bold text-lg">{template.name}</h3>
                  {template.description && (
                    <p className="text-sm text-surface-400 mt-1">{template.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-3 text-sm text-surface-500">
                    <span>{template.exercises.length} exercises</span>
                    {template.timesUsed > 0 && (
                      <span>Used {template.timesUsed}×</span>
                    )}
                    {template.lastUsedAt && (
                      <span>Last: {formatRelativeDate(template.lastUsedAt)}</span>
                    )}
                  </div>
                  <div className="mt-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        navigate(`/log/${template.id}`)
                      }}
                    >
                      Start Workout
                    </Button>
                  </div>
                </Card>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create template modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="New Template">
        <div className="space-y-4">
          <Input
            label="Template Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="e.g. Push Day, Full Body, 5K Run"
          />
          <Input
            label="Description (optional)"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="e.g. Chest, shoulders, and triceps"
          />

          <div>
            <label className="block text-sm text-surface-400 mb-2">Exercises</label>
            {formExercises.length > 0 && (
              <div className="space-y-1 mb-3">
                {formExercises.map((te, idx) => (
                  <div
                    key={te.id}
                    className="flex items-center justify-between bg-surface-800 rounded-xl px-3 py-2"
                  >
                    <div>
                      <p className="font-medium text-sm">{te.exerciseName}</p>
                      <p className="text-xs text-surface-500">
                        {te.targetSets} sets
                        {te.targetReps && ` × ${te.targetReps} reps`}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveExercise(idx)}
                      className="text-surface-500 hover:text-fire-400 p-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowExercisePicker(true)}
            >
              + Add Exercise
            </Button>
          </div>

          <Button
            variant="primary"
            onClick={handleCreateTemplate}
            className="w-full"
            disabled={!formName.trim()}
          >
            Create Template
          </Button>
        </div>
      </Modal>

      {/* Exercise picker modal */}
      <Modal
        isOpen={showExercisePicker}
        onClose={() => {
          setShowExercisePicker(false)
          setExerciseSearch('')
        }}
        title="Add Exercise"
      >
        <div className="mb-4">
          <SearchInput
            placeholder="Search exercises..."
            value={exerciseSearch}
            onChange={(e) => setExerciseSearch(e.target.value)}
            onClear={() => setExerciseSearch('')}
          />
        </div>
        <div className="max-h-80 overflow-y-auto space-y-1">
          {filteredExercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => handleAddExercise(exercise)}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-surface-800 transition-colors"
            >
              <p className="font-medium">{exercise.name}</p>
              <p className="text-sm text-surface-500">
                {exercise.primaryMuscle.replace('_', ' ')} · {exercise.equipment}
              </p>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}

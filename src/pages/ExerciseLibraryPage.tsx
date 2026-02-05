import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import { Header } from '../components/layout/Header'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Tabs } from '../components/ui/Tabs'
import { SearchInput } from '../components/ui/SearchInput'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { EmptyState } from '../components/ui/EmptyState'
import { useExerciseStore } from '../stores/exercise-store'
import { generateId } from '../lib/id'
import type { Exercise, ExerciseCategory, MuscleGroup, EquipmentType } from '../types/exercise'

const categoryTabs = [
  { key: 'all', label: 'All' },
  { key: 'strength', label: 'Strength' },
  { key: 'cardio', label: 'Cardio' },
  { key: 'hiit', label: 'HIIT' },
  { key: 'flexibility', label: 'Flexibility' },
]

const muscleGroups: MuscleGroup[] = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
  'core', 'quads', 'hamstrings', 'glutes', 'calves', 'full_body', 'cardio',
]

const equipmentTypes: EquipmentType[] = [
  'barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'kettlebell', 'band', 'other', 'none',
]

export function ExerciseLibraryPage() {
  const exercises = useExerciseStore((s) => s.exercises)
  const addExercise = useExerciseStore((s) => s.addExercise)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Form state
  const [formName, setFormName] = useState('')
  const [formCategory, setFormCategory] = useState<ExerciseCategory>('strength')
  const [formMuscle, setFormMuscle] = useState<MuscleGroup>('chest')
  const [formEquipment, setFormEquipment] = useState<EquipmentType>('barbell')

  const filtered = useMemo(() => {
    let result = exercises

    if (category !== 'all') {
      result = result.filter((e) => e.category === category)
    }

    if (selectedMuscle) {
      result = result.filter(
        (e) => e.primaryMuscle === selectedMuscle || e.secondaryMuscles.includes(selectedMuscle),
      )
    }

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.primaryMuscle.includes(q) ||
          e.equipment.includes(q),
      )
    }

    return result.sort((a, b) => a.name.localeCompare(b.name))
  }, [exercises, category, selectedMuscle, search])

  const handleCreateExercise = () => {
    if (!formName.trim()) return
    const exercise: Exercise = {
      id: generateId(),
      name: formName.trim(),
      category: formCategory,
      primaryMuscle: formMuscle,
      secondaryMuscles: [],
      equipment: formEquipment,
      isCustom: true,
      notes: '',
      createdAt: Date.now(),
    }
    addExercise(exercise)
    setShowForm(false)
    setFormName('')
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <Header
        title="Exercises"
        actions={
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            + New
          </Button>
        }
      />

      <div className="mb-4">
        <SearchInput
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
        />
      </div>

      <div className="mb-4">
        <Tabs tabs={categoryTabs} activeTab={category} onChange={setCategory} />
      </div>

      {/* Muscle group chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {muscleGroups.map((mg) => (
          <button
            key={mg}
            onClick={() => setSelectedMuscle(selectedMuscle === mg ? null : mg)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedMuscle === mg
                ? 'bg-brand-600 text-white'
                : 'bg-surface-800 text-surface-400 hover:bg-surface-700'
            }`}
          >
            {mg.replace('_', ' ')}
          </button>
        ))}
      </div>

      <p className="text-sm text-surface-500 mb-3">{filtered.length} exercises</p>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No exercises found"
          description="Try adjusting your filters or create a custom exercise"
          action={
            <Button variant="secondary" onClick={() => setShowForm(true)}>
              Create Exercise
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {filtered.map((exercise) => (
            <Link key={exercise.id} to={`/exercises/${exercise.id}`}>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{exercise.name}</p>
                      {exercise.isCustom && (
                        <span className="text-xs text-energy-400 font-medium">Custom</span>
                      )}
                    </div>
                    <p className="text-sm text-surface-400 mt-0.5">
                      {exercise.primaryMuscle.replace('_', ' ')} · {exercise.equipment}
                    </p>
                  </div>
                  <Badge variant={exercise.category}>{exercise.category}</Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Create exercise modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="New Exercise">
        <div className="space-y-4">
          <Input
            label="Exercise Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="e.g. Cable Lateral Raise"
          />

          <div>
            <label className="block text-sm text-surface-400 mb-1">Category</label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as ExerciseCategory)}
              className="w-full bg-surface-800 border border-surface-700 rounded-xl px-3 py-2 text-surface-100 outline-none focus:border-brand-500"
            >
              <option value="strength">Strength</option>
              <option value="cardio">Cardio</option>
              <option value="hiit">HIIT</option>
              <option value="flexibility">Flexibility</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-surface-400 mb-1">Primary Muscle</label>
            <select
              value={formMuscle}
              onChange={(e) => setFormMuscle(e.target.value as MuscleGroup)}
              className="w-full bg-surface-800 border border-surface-700 rounded-xl px-3 py-2 text-surface-100 outline-none focus:border-brand-500"
            >
              {muscleGroups.map((mg) => (
                <option key={mg} value={mg}>{mg.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-surface-400 mb-1">Equipment</label>
            <select
              value={formEquipment}
              onChange={(e) => setFormEquipment(e.target.value as EquipmentType)}
              className="w-full bg-surface-800 border border-surface-700 rounded-xl px-3 py-2 text-surface-100 outline-none focus:border-brand-500"
            >
              {equipmentTypes.map((eq) => (
                <option key={eq} value={eq}>{eq}</option>
              ))}
            </select>
          </div>

          <Button variant="primary" onClick={handleCreateExercise} className="w-full">
            Create Exercise
          </Button>
        </div>
      </Modal>
    </div>
  )
}

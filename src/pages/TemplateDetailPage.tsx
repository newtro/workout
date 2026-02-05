import { useParams, useNavigate, Link } from 'react-router'
import { Header } from '../components/layout/Header'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { useTemplateStore } from '../stores/template-store'
import { formatRelativeDate } from '../lib/formatters'
import { useState } from 'react'
import toast from 'react-hot-toast'

export function TemplateDetailPage() {
  const { templateId } = useParams()
  const navigate = useNavigate()
  const getTemplate = useTemplateStore((s) => s.getTemplate)
  const deleteTemplate = useTemplateStore((s) => s.deleteTemplate)
  const [showDelete, setShowDelete] = useState(false)

  const template = templateId ? getTemplate(templateId) : undefined

  if (!template) {
    return (
      <div className="p-4 lg:p-8 max-w-3xl mx-auto">
        <EmptyState
          icon="🔍"
          title="Template not found"
          description="This template doesn't exist or was deleted"
          action={
            <Link to="/templates">
              <Button variant="secondary">Back to Templates</Button>
            </Link>
          }
        />
      </div>
    )
  }

  const handleDelete = () => {
    deleteTemplate(template.id)
    toast.success('Template deleted')
    navigate('/templates')
  }

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <Header
        title={template.name}
        actions={
          <div className="flex gap-2">
            <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}>
              Delete
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        }
      />

      {template.description && (
        <p className="text-surface-400 mb-4">{template.description}</p>
      )}

      <div className="flex items-center gap-4 text-sm text-surface-500 mb-6">
        <span>{template.exercises.length} exercises</span>
        {template.timesUsed > 0 && <span>Used {template.timesUsed} times</span>}
        {template.lastUsedAt && (
          <span>Last used {formatRelativeDate(template.lastUsedAt)}</span>
        )}
      </div>

      <Link to={`/log/${template.id}`}>
        <div className="gradient-brand rounded-2xl p-5 text-white text-center mb-6 hover:opacity-90 transition-opacity">
          <p className="text-xl font-extrabold">Start Workout</p>
        </div>
      </Link>

      <h2 className="text-lg font-bold mb-3">Exercises</h2>
      <div className="space-y-2">
        {template.exercises.map((te) => (
          <Card key={te.id}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold">{te.exerciseName}</p>
                  <Badge variant={te.category}>{te.category}</Badge>
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-surface-400">
                  <span>{te.targetSets} sets</span>
                  {te.targetReps && <span>{te.targetReps} reps</span>}
                  {te.targetWeight && <span>{te.targetWeight} lbs</span>}
                  {te.restSeconds && <span>{te.restSeconds}s rest</span>}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Template"
        message={`Are you sure you want to delete "${template.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}

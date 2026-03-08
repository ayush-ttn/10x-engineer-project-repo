import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCollection } from '../api/collections'
import Button from '../components/Button'

const NAME_MAX = 100
const DESCRIPTION_MAX = 500

export default function CollectionForm({ onSuccess, onCancel, embedded = false }) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  const validate = () => {
    const err = {}
    if (!name.trim()) err.name = 'Name is required'
    else if (name.length > NAME_MAX) err.name = `Name must be at most ${NAME_MAX} characters`
    if (description.length > DESCRIPTION_MAX) err.description = `Description must be at most ${DESCRIPTION_MAX} characters`
    setFieldErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!validate()) return
    setSaving(true)
    try {
      await createCollection({
        name: name.trim(),
        description: description.trim() || undefined,
      })
      if (onSuccess) onSuccess()
      else navigate('/collections')
    } catch (err) {
      setError(err.message || 'Failed to create collection')
      if (err.errors) {
        const byField = {}
        err.errors.forEach(({ loc, msg }) => {
          const field = Array.isArray(loc) ? loc[loc.length - 1] : loc
          if (field) byField[field] = msg
        })
        setFieldErrors((prev) => ({ ...prev, ...byField }))
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!embedded && (
        <h1 className="text-2xl font-bold text-stone-900">New collection</h1>
      )}
      {error && (
        <div role="alert" className="rounded-lg bg-red-50 p-3 text-red-800">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Name (required, 1–100 chars)
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={NAME_MAX}
          className="mt-1 min-h-touch w-full rounded-lg border border-slate-300 px-4 py-2 text-base focus:ring-2 focus:ring-primary-500"
          aria-invalid={Boolean(fieldErrors.name)}
        />
        {fieldErrors.name && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
        )}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700">
          Description (optional, max 500 chars)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={DESCRIPTION_MAX}
          rows={2}
          className="mt-1 min-h-touch w-full rounded-lg border border-slate-300 px-4 py-2 text-base focus:ring-2 focus:ring-primary-500"
          aria-invalid={Boolean(fieldErrors.description)}
        />
        {fieldErrors.description && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Creating…' : 'Create'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel ?? (() => navigate(-1))}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

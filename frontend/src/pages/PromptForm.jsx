import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPrompt, createPrompt, updatePrompt } from '../api/prompts'
import { getCollections } from '../api/collections'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const TITLE_MAX = 200
const CONTENT_MIN = 1
const DESCRIPTION_MAX = 500

export default function PromptForm({ onSuccess, onCancel, embedded = false, editId = null }) {
  const { id: routeId } = useParams()
  const navigate = useNavigate()
  const id = embedded && editId ? editId : routeId
  const isEdit = Boolean(id)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [description, setDescription] = useState('')
  const [collectionId, setCollectionId] = useState('')
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(Boolean(isEdit && id))
  const [loadingCollections, setLoadingCollections] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    let cancelled = false
    getCollections()
      .then((data) => {
        if (!cancelled) setCollections(data.collections || [])
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingCollections(false)
      })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!isEdit || !id) return
    let cancelled = false
    getPrompt(id)
      .then((data) => {
        if (!cancelled) {
          setTitle(data.title || '')
          setContent(data.content || '')
          setDescription(data.description || '')
          setCollectionId(data.collection_id || '')
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id, isEdit])

  const validate = () => {
    const err = {}
    if (!title.trim()) err.title = 'Title is required'
    else if (title.length > TITLE_MAX) err.title = `Title must be at most ${TITLE_MAX} characters`
    if (!content.trim()) err.content = 'Content is required'
    else if (content.trim().length < CONTENT_MIN) err.content = 'Content must be at least 1 character'
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
      const payload = {
        title: title.trim(),
        content: content.trim(),
        description: description.trim() || undefined,
        collection_id: collectionId || undefined,
      }
      if (isEdit) {
        await updatePrompt(id, payload)
        if (onSuccess) onSuccess()
        else navigate(`/prompts/${id}`)
      } else {
        const created = await createPrompt(payload)
        if (onSuccess) onSuccess(created)
        else navigate(`/prompts/${created.id}`)
      }
    } catch (err) {
      setError(err.message || 'Failed to save')
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

  if (loading && !embedded) return <LoadingSpinner />
  if (error && isEdit && !embedded) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      {!embedded && (
        <h1 className="text-2xl font-bold text-stone-900">
          {isEdit ? 'Edit prompt' : 'New prompt'}
        </h1>
      )}
      {error && (
        <div role="alert" className="rounded-lg bg-red-50 p-3 text-red-800">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700">
          Title (required, 1–200 chars)
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={TITLE_MAX}
          className="mt-1 min-h-touch w-full rounded-lg border border-slate-300 px-4 py-2 text-base focus:ring-2 focus:ring-primary-500"
          aria-invalid={Boolean(fieldErrors.title)}
          aria-describedby={fieldErrors.title ? 'title-error' : undefined}
        />
        {fieldErrors.title && (
          <p id="title-error" className="mt-1 text-sm text-red-600">
            {fieldErrors.title}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-slate-700">
          Content (required)
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="mt-1 min-h-touch w-full rounded-lg border border-slate-300 px-4 py-2 text-base focus:ring-2 focus:ring-primary-500"
          aria-invalid={Boolean(fieldErrors.content)}
          aria-describedby={fieldErrors.content ? 'content-error' : undefined}
        />
        {fieldErrors.content && (
          <p id="content-error" className="mt-1 text-sm text-red-600">
            {fieldErrors.content}
          </p>
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
      {!loadingCollections && (
        <div>
          <label htmlFor="collection" className="block text-sm font-medium text-slate-700">
            Collection (optional)
          </label>
          <select
            id="collection"
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
            className="mt-1 min-h-touch w-full rounded-lg border border-slate-300 px-4 py-2 text-base focus:ring-2 focus:ring-primary-500"
          >
            <option value="">None</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Save' : 'Create'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel ?? (() => navigate(-1))}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getPrompt, deletePrompt, addTagToPrompt, removeTagFromPrompt } from '../api/prompts'
import { getCollection } from '../api/collections'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import EmptyState from './EmptyState'
import Button from './Button'
import Modal from './Modal'

const PencilIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
)

const BinIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

const BackIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
)

/**
 * Renders a single prompt's detail (title, description, content, tags, edit/delete, add tag).
 * Can be used as a full page or inside a modal.
 * @param {string} promptId - The prompt ID to load and display
 * @param {() => void} [onClose] - If provided (e.g. in modal), called when user wants to close
 * @param {() => void} [onDeleted] - If provided, called after successful delete (instead of navigating)
 * @param {(id: string) => void} [onEditClick] - If provided (e.g. in modal), called when user clicks Edit; opens edit modal instead of navigating
 * @param {object} [initialPrompt] - Optional prompt object (e.g. from list) for title before fetch
 * @param {() => void} [onPromptUpdated] - If provided (e.g. in modal), called when prompt is updated (e.g. tag added/removed) so list can refetch
 */
export default function PromptDetailView({ promptId, onClose, onDeleted, onEditClick, initialPrompt, onPromptUpdated }) {
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState(null)
  const [collectionName, setCollectionName] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [tagError, setTagError] = useState(null)

  const fetchPrompt = async () => {
    if (!promptId) return
    setLoading(true)
    setError(null)
    try {
      const data = await getPrompt(promptId)
      setPrompt(data)
    } catch (err) {
      setError(err.status === 404 ? null : err.message)
      setPrompt(err.status === 404 ? 'not-found' : null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrompt()
  }, [promptId])

  useEffect(() => {
    if (!prompt?.collection_id || prompt === 'not-found') {
      setCollectionName(null)
      return
    }
    let cancelled = false
    getCollection(prompt.collection_id)
      .then((c) => { if (!cancelled) setCollectionName(c.name || null) })
      .catch(() => { if (!cancelled) setCollectionName(null) })
    return () => { cancelled = true }
  }, [prompt?.collection_id])

  const handleDelete = async () => {
    if (!promptId) return
    setDeleting(true)
    try {
      await deletePrompt(promptId)
      setDeleteModalOpen(false)
      if (onDeleted) onDeleted()
      else navigate('/')
    } catch (err) {
      setTagError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  const handleAddTag = async (e) => {
    e.preventDefault()
    const name = newTagName.trim()
    if (!name || !promptId) return
    setTagError(null)
    try {
      const updated = await addTagToPrompt(promptId, { name })
      setPrompt(updated)
      setNewTagName('')
      onPromptUpdated?.()
    } catch (err) {
      setTagError(err.message || 'Failed to add tag')
    }
  }

  const handleRemoveTag = async (tagId) => {
    setTagError(null)
    try {
      const updated = await removeTagFromPrompt(promptId, tagId)
      setPrompt(updated)
      onPromptUpdated?.()
    } catch (err) {
      setTagError(err.message || 'Failed to remove tag')
    }
  }

  if (!promptId) return null
  const showHeaderWithLoading = onClose && initialPrompt && loading
  if (loading && !showHeaderWithLoading) return <LoadingSpinner />
  if (prompt === 'not-found' || (error && !prompt))
    return (
      <EmptyState
        title="This prompt doesn't exist or was removed"
        actionLabel="Back to prompts"
        onAction={onClose ?? (() => navigate('/'))}
      />
    )
  if (error)
    return <ErrorMessage message={error} onRetry={fetchPrompt} />

  const displayTitle = prompt?.title ?? initialPrompt?.title ?? 'Prompt'

  if (showHeaderWithLoading) {
    return (
      <article className="max-w-3xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-touch shrink-0 rounded-xl p-2 text-stone-700 hover:bg-stone-100 focus:ring-2 focus:ring-primary-500"
              aria-label="Back"
            >
              <BackIcon />
            </button>
            <h2 className="truncate text-xl font-semibold text-stone-900">
              {displayTitle}
            </h2>
          </div>
          <div className="shrink-0" />
        </div>
        <LoadingSpinner />
      </article>
    )
  }

  return (
    <article className="max-w-3xl">
      {onClose ? (
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-touch shrink-0 rounded-xl p-2 text-stone-700 hover:bg-stone-100 focus:ring-2 focus:ring-primary-500"
              aria-label="Back"
            >
              <BackIcon />
            </button>
            <h2 className="truncate text-xl font-semibold text-stone-900">
              {displayTitle}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {onEditClick ? (
              <button
                type="button"
                onClick={() => onEditClick(promptId)}
                className="min-h-touch min-w-[44px] rounded-xl p-2 text-stone-600 hover:bg-stone-100 focus:ring-2 focus:ring-primary-500"
                aria-label="Edit"
              >
                <PencilIcon />
              </button>
            ) : (
              <Link
                to={`/prompts/${promptId}/edit`}
                className="min-h-touch min-w-[44px] rounded-xl p-2 text-stone-600 hover:bg-stone-100 focus:ring-2 focus:ring-primary-500 inline-flex items-center justify-center"
                aria-label="Edit"
              >
                <PencilIcon />
              </Link>
            )}
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="min-h-touch min-w-[44px] rounded-xl p-2 text-red-600 hover:bg-red-50 focus:ring-2 focus:ring-red-500"
              aria-label="Delete"
            >
              <BinIcon />
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Link
            to="/"
            className="min-h-touch inline-flex items-center rounded-xl p-2 text-stone-700 hover:bg-stone-100 focus:ring-2 focus:ring-primary-500"
            aria-label="Back to prompts"
          >
            <BackIcon />
          </Link>
          <Link
            to={`/prompts/${promptId}/edit`}
            className="min-h-touch rounded-xl px-3 py-2 text-stone-700 hover:bg-stone-100"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="min-h-touch rounded-xl p-2 text-red-600 hover:bg-red-50 focus:ring-2 focus:ring-red-500"
            aria-label="Delete"
          >
            <BinIcon />
          </button>
        </div>
      )}
      {!onClose && <h1 className="text-2xl font-bold text-stone-900">{prompt.title}</h1>}
      {collectionName && (
        <p className="mt-1 text-sm text-stone-500">
          Collection: <span className="font-medium text-stone-700">{collectionName}</span>
        </p>
      )}
      {prompt.description && (
        <p className="mt-2 text-stone-600">{prompt.description}</p>
      )}
      <div className="mt-4 rounded-xl bg-stone-100 p-4">
        <pre className="whitespace-pre-wrap font-sans text-sm text-stone-800">
          {prompt.content}
        </pre>
      </div>
      {prompt.tags?.length > 0 && (
        <div className="mt-4">
          <h2 className="text-sm font-semibold text-stone-600">Tags</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {prompt.tags.map((tag) => (
              <span
                key={tag.tag_id}
                className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-800"
              >
                {tag.name}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag.tag_id)}
                  className="ml-1 rounded-full p-0.5 hover:bg-primary-200 focus:ring-2 focus:ring-primary-500"
                  aria-label={`Remove tag ${tag.name}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
      <form onSubmit={handleAddTag} className="mt-4 flex flex-wrap gap-2">
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="Add tag (1–100 chars)"
          maxLength={100}
          className="min-h-touch rounded-lg border border-stone-300 px-3 py-2 text-base focus:ring-2 focus:ring-primary-500"
        />
        <Button type="submit" disabled={!newTagName.trim()}>
          Add tag
        </Button>
      </form>
      {tagError && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {tagError}
        </p>
      )}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete prompt?"
      >
        <p className="text-stone-600">
          This cannot be undone. Are you sure you want to delete this prompt?
        </p>
        <div className="mt-4 flex gap-2">
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
          <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </article>
  )
}

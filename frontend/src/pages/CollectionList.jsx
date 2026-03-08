import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCollections, deleteCollection } from '../api/collections'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'
import Modal from '../components/Modal'
import CollectionForm from './CollectionForm'

const BinIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

export default function CollectionList() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const fetchCollections = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCollections()
      setCollections(data.collections || [])
    } catch (err) {
      setError(err.message || 'Failed to load collections')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCollections()
  }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteCollection(deleteTarget.id)
      setDeleteTarget(null)
      fetchCollections()
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} onRetry={fetchCollections} />

  return (
    <section aria-label="Collections list">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Collections</h1>
        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="min-h-touch inline-flex items-center justify-center rounded-xl bg-primary-600 px-5 py-2.5 text-base font-semibold text-white shadow-card transition hover:bg-primary-700 hover:shadow-card-hover focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          New collection
        </button>
      </div>
      {collections.length === 0 ? (
        <EmptyState
          title="No collections yet"
          description="Create a collection to organize your prompts."
          actionLabel="Create a collection"
          onAction={() => setCreateModalOpen(true)}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <Link
                  to={`/?collection_id=${c.id}`}
                  className="font-semibold text-slate-900 hover:text-primary-600 focus:ring-2 focus:ring-primary-500 rounded"
                >
                  {c.name}
                </Link>
                {c.description && (
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                    {c.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setDeleteTarget(c)}
                className="min-h-touch ml-2 shrink-0 rounded-xl p-2 text-red-600 hover:bg-red-50 focus:ring-2 focus:ring-red-500"
                aria-label={`Delete ${c.name}`}
              >
                <BinIcon />
              </button>
            </li>
          ))}
        </ul>
      )}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="New collection"
      >
        <CollectionForm
          embedded
          onSuccess={() => {
            setCreateModalOpen(false)
            fetchCollections()
          }}
          onCancel={() => setCreateModalOpen(false)}
        />
      </Modal>
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete collection?"
      >
        <p className="text-stone-600">
          Prompts in this collection will be kept but no longer linked to it. Continue?
        </p>
        <div className="mt-4 flex gap-2">
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </section>
  )
}

import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getPrompts } from '../api/prompts'
import PromptCard from './PromptCard'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import EmptyState from './EmptyState'
import SearchBar from './SearchBar'
import Modal from './Modal'
import PromptForm from '../pages/PromptForm'
import PromptDetailView from './PromptDetailView'

const SEARCH_DEBOUNCE_MS = 350

export default function PromptList() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const collectionId = searchParams.get('collection_id') || undefined
  const [prompts, setPrompts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editPromptId, setEditPromptId] = useState(null)
  const [detailPromptId, setDetailPromptId] = useState(null)
  const [detailPrompt, setDetailPrompt] = useState(null)

  const hasFilters = collectionId || searchQuery

  const openCreateModal = () => {
    setEditPromptId(null)
    setCreateModalOpen(true)
  }
  const openEditModal = (id) => {
    setDetailPromptId(null)
    setDetailPrompt(null)
    setEditPromptId(id)
    setCreateModalOpen(true)
  }
  const closeCreateModal = () => {
    setCreateModalOpen(false)
    setEditPromptId(null)
  }

  const fetchPrompts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPrompts({
        collection_id: collectionId,
        search: searchQuery || undefined,
      })
      setPrompts(data.prompts || [])
      setTotal(data.total ?? 0)
    } catch (err) {
      setError(err.message || 'Failed to load prompts')
    } finally {
      setLoading(false)
    }
  }, [collectionId, searchQuery])

  useEffect(() => {
    fetchPrompts()
  }, [fetchPrompts])

  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput.trim()), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [searchInput])

  return (
    <section aria-label="Prompts list" className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          placeholder="Search prompts..."
        />
        <button
          type="button"
          onClick={openCreateModal}
          className="min-h-touch inline-flex shrink-0 items-center justify-center rounded-xl bg-primary-600 px-5 py-2.5 text-base font-semibold text-white shadow-card transition hover:bg-primary-700 hover:shadow-card-hover focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          New prompt
        </button>
      </div>

      <Modal
        open={createModalOpen}
        onClose={closeCreateModal}
        title={editPromptId ? 'Edit prompt' : 'New prompt'}
      >
        <PromptForm
          embedded
          editId={editPromptId}
          onSuccess={() => {
            closeCreateModal()
            fetchPrompts()
          }}
          onCancel={closeCreateModal}
        />
      </Modal>

      <Modal
        open={Boolean(detailPromptId)}
        onClose={() => { setDetailPromptId(null); setDetailPrompt(null) }}
        noHeader
      >
        {detailPromptId && (
          <PromptDetailView
            promptId={detailPromptId}
            initialPrompt={detailPrompt}
            onClose={() => { setDetailPromptId(null); setDetailPrompt(null) }}
            onEditClick={openEditModal}
            onPromptUpdated={fetchPrompts}
            onDeleted={() => {
              setDetailPromptId(null)
              setDetailPrompt(null)
              fetchPrompts()
            }}
          />
        )}
      </Modal>

      {error ? (
        <ErrorMessage message={error} onRetry={fetchPrompts} />
      ) : loading ? (
        <div className="min-h-[200px] flex items-center justify-center rounded-2xl border border-stone-200/80 bg-white/60">
          <LoadingSpinner />
        </div>
      ) : prompts.length === 0 ? (
        <EmptyState
          title={hasFilters ? 'No prompts match your filters' : 'No prompts yet'}
          description={
            hasFilters
              ? 'Try clearing filters or search to see all prompts.'
              : 'Create your first prompt to get started.'
          }
          actionLabel={hasFilters ? 'View all prompts' : 'Create your first prompt'}
          onAction={
            hasFilters
              ? () => {
                  setSearchInput('')
                  setSearchQuery('')
                  navigate('/')
                }
              : openCreateModal
          }
        />
      ) : (
        <>
          <p className="text-sm font-medium text-stone-500">
            {total} prompt{total !== 1 ? 's' : ''}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {prompts.map((p) => (
              <PromptCard
                key={p.id}
                prompt={p}
                onSelect={(prompt) => {
                  setDetailPrompt(prompt)
                  setDetailPromptId(prompt.id)
                }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

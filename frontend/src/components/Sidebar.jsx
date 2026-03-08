import { Link, useSearchParams, useLocation } from 'react-router-dom'

export default function Sidebar({ open, onClose, collections = [] }) {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const currentCollectionId = searchParams.get('collection_id') || ''

  const pageLinkClass = (path) =>
    `block min-h-touch w-full rounded-xl px-4 py-3 text-left text-stone-700 hover:bg-primary-50 focus:ring-2 focus:ring-primary-500 ${
      location.pathname === path ? 'bg-primary-50 font-semibold text-primary-700' : ''
    }`

  const linkClass = (id) =>
    `block min-h-touch w-full rounded-xl px-4 py-3 text-left text-stone-700 hover:bg-primary-50 focus:ring-2 focus:ring-primary-500 ${
      currentCollectionId === id ? 'bg-primary-50 font-semibold text-primary-700' : ''
    }`

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-stone-900/50 backdrop-blur-sm lg:hidden"
          aria-hidden
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-64 border-r border-stone-200 bg-white/95 shadow-card-hover backdrop-blur-sm transition-transform duration-200 lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navigation"
      >
        <div className="flex h-full flex-col gap-6 overflow-y-auto p-4">
          <nav className="flex flex-col gap-1" aria-label="Pages">
            <Link to="/" className={pageLinkClass('/')} onClick={onClose}>
              Prompts
            </Link>
            <Link to="/collections" className={pageLinkClass('/collections')} onClick={onClose}>
              Collections
            </Link>
          </nav>
          <nav className="flex flex-col gap-1" aria-label="Filter by collection">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
              Filter by collection
            </h2>
            <Link to="/" className={linkClass('')} onClick={onClose}>
              All prompts
            </Link>
            {collections.map((c) => (
              <Link
                key={c.id}
                to={`/?collection_id=${c.id}`}
                className={linkClass(c.id)}
                onClick={onClose}
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  )
}

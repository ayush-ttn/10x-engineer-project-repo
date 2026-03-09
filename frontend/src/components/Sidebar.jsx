import { Link, useLocation } from 'react-router-dom'

export default function Sidebar({ open, onClose }) {
  const location = useLocation()

  const pageLinkClass = (path) =>
    `block min-h-touch w-full rounded-xl px-4 py-3 text-left text-stone-700 hover:bg-primary-50 focus:ring-2 focus:ring-primary-500 ${
      location.pathname === path ? 'bg-primary-50 font-semibold text-primary-700' : ''
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
        <div className="p-4">
          <nav className="flex flex-col gap-1" aria-label="Pages">
            <Link to="/" className={pageLinkClass('/')} onClick={onClose}>
              Prompts
            </Link>
            <Link to="/collections" className={pageLinkClass('/collections')} onClick={onClose}>
              Collections
            </Link>
          </nav>
        </div>
      </aside>
    </>
  )
}

import { Link } from 'react-router-dom'

export default function Header({ onMenuClick }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-stone-200/90 bg-white/95 px-4 shadow-card backdrop-blur-sm">
      <div className="flex min-h-touch items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex min-h-touch min-w-[44px] items-center justify-center rounded-xl text-stone-600 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-primary-500 lg:hidden"
          aria-label="Open menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
        >
          PromptLab
        </Link>
      </div>
      <nav className="hidden gap-1 lg:flex">
        <Link
          to="/"
          className="min-h-touch inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium text-stone-700 hover:bg-primary-50 hover:text-primary-700 focus:ring-2 focus:ring-primary-500"
        >
          Prompts
        </Link>
        <Link
          to="/collections"
          className="min-h-touch inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium text-stone-700 hover:bg-primary-50 hover:text-primary-700 focus:ring-2 focus:ring-primary-500"
        >
          Collections
        </Link>
      </nav>
    </header>
  )
}

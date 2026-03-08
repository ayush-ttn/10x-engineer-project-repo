export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  id = 'search',
}) {
  return (
    <label htmlFor={id} className="block w-full">
      <span className="sr-only">Search</span>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`min-h-touch w-full rounded-full border border-stone-200 bg-white/90 px-5 py-2.5 text-base text-stone-900 shadow-card placeholder-stone-400 transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/25 ${className}`}
        aria-label="Search"
      />
    </label>
  )
}

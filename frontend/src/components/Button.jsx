export default function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}) {
  const base =
    'min-h-touch inline-flex items-center justify-center rounded-xl px-4 py-2 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none transition shadow-card'
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 hover:shadow-card-hover',
    secondary: 'bg-stone-200 text-stone-800 hover:bg-stone-300 focus:ring-stone-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-stone-700 hover:bg-stone-100 focus:ring-stone-400 shadow-none',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

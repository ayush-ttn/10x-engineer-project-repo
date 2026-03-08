import Button from './Button'

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-white/70 px-8 py-12 text-center ${className}`}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-2xl">
        ✦
      </div>
      <h3 className="text-xl font-semibold text-stone-800">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-stone-600">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

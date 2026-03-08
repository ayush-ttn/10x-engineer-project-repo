import Button from './Button'

export default function ErrorMessage({ message, onRetry, className = '' }) {
  return (
    <div
      role="alert"
      className={`rounded-2xl border border-red-200 bg-red-50/90 p-5 text-red-800 ${className}`}
    >
      <p className="font-medium">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-3">
          Try again
        </Button>
      )}
    </div>
  )
}

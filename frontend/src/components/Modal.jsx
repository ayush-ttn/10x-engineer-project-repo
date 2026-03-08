import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Button from './Button'

export default function Modal({ open, onClose, title, noHeader = false, children }) {
  useEffect(() => {
    if (!open) return
    const handleEscape = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title && !noHeader ? 'modal-title' : undefined}
    >
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
        aria-hidden
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl border border-stone-200 bg-white p-6 shadow-card-hover">
        {!noHeader && (
          <div className="flex items-center justify-between gap-4">
            {title && (
              <h2 id="modal-title" className="text-xl font-semibold text-stone-900">
                {title}
              </h2>
            )}
            <Button
              variant="ghost"
              onClick={onClose}
              className="min-h-touch ml-auto"
              aria-label="Close"
            >
              Close
            </Button>
          </div>
        )}
        <div className={noHeader ? '' : 'mt-4'}>{children}</div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

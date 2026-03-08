import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorMessage from './ErrorMessage'

describe('ErrorMessage', () => {
  it('renders message', () => {
    render(<ErrorMessage message="Something went wrong" />)
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('when onRetry provided, shows Retry button and calls it on click', async () => {
    const onRetry = vi.fn()
    render(<ErrorMessage message="Failed" onRetry={onRetry} />)
    const btn = screen.getByRole('button', { name: /try again|retry/i })
    expect(btn).toBeInTheDocument()
    await userEvent.click(btn)
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})

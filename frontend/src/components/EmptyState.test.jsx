import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EmptyState from './EmptyState'

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(
      <EmptyState
        title="No prompts yet"
        description="Create your first prompt to get started."
      />
    )
    expect(screen.getByText(/no prompts yet/i)).toBeInTheDocument()
    expect(screen.getByText(/create your first prompt/i)).toBeInTheDocument()
  })

  it('when actionLabel and onAction provided, renders button that calls onAction', async () => {
    const onAction = vi.fn()
    render(
      <EmptyState
        title="Empty"
        description="Desc"
        actionLabel="Create one"
        onAction={onAction}
      />
    )
    const btn = screen.getByRole('button', { name: /create one/i })
    await userEvent.click(btn)
    expect(onAction).toHaveBeenCalledTimes(1)
  })
})

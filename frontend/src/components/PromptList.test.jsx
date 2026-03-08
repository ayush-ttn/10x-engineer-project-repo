import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import PromptList from './PromptList'
import * as promptsApi from '../api/prompts'

vi.mock('../api/prompts')

function renderPromptList(initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <PromptList />
    </MemoryRouter>
  )
}

describe('PromptList', () => {
  beforeEach(() => {
    vi.mocked(promptsApi.getPrompts).mockReset()
  })

  it('shows loading state then empty state when no prompts', async () => {
    vi.mocked(promptsApi.getPrompts).mockResolvedValue({ prompts: [], total: 0 })
    renderPromptList()

    await waitFor(() => {
      expect(promptsApi.getPrompts).toHaveBeenCalled()
    })

    expect(screen.getByRole('heading', { name: /no prompts yet/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create your first prompt/i })).toBeInTheDocument()
  })

  it('shows prompt cards when prompts are returned', async () => {
    vi.mocked(promptsApi.getPrompts).mockResolvedValue({
      prompts: [
        { id: '1', title: 'First prompt', content: 'Content 1', description: null, collection_id: null, tags: [] },
        { id: '2', title: 'Second prompt', content: 'Content 2', description: null, collection_id: null, tags: [] },
      ],
      total: 2,
    })
    renderPromptList()

    await waitFor(() => {
      expect(screen.getByText('First prompt')).toBeInTheDocument()
    })

    expect(screen.getByText('Second prompt')).toBeInTheDocument()
    expect(screen.getByText(/2 prompt/)).toBeInTheDocument()
  })

  it('shows error message when fetch fails and Retry works', async () => {
    vi.mocked(promptsApi.getPrompts).mockRejectedValue(new Error('Network error'))
    renderPromptList()

    await waitFor(() => {
      expect(screen.getByText(/network error|failed to load/i)).toBeInTheDocument()
    })

    vi.mocked(promptsApi.getPrompts).mockResolvedValue({ prompts: [], total: 0 })
    const retryButton = screen.getByRole('button', { name: /try again|retry/i })
    await userEvent.click(retryButton)

    await waitFor(() => {
      expect(promptsApi.getPrompts).toHaveBeenCalledTimes(2)
    })
  })

  it('opens create modal when New prompt is clicked', async () => {
    vi.mocked(promptsApi.getPrompts).mockResolvedValue({ prompts: [], total: 0 })
    renderPromptList()

    await waitFor(() => {
      expect(screen.getByText(/no prompts yet/i)).toBeInTheDocument()
    })

    const newPromptButton = screen.getByRole('button', { name: /new prompt/i })
    await userEvent.click(newPromptButton)

    expect(screen.getByRole('heading', { name: /new prompt/i })).toBeInTheDocument()
  })
})

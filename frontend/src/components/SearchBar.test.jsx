import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from './SearchBar'

describe('SearchBar', () => {
  it('renders with value and placeholder', () => {
    render(
      <SearchBar value="" onChange={() => {}} placeholder="Search prompts..." />
    )
    const input = screen.getByPlaceholderText(/search prompts/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('calls onChange when user types', async () => {
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} placeholder="Search" />)
    await userEvent.type(screen.getByPlaceholderText(/search/i), 'a')
    expect(onChange).toHaveBeenCalled()
  })
})

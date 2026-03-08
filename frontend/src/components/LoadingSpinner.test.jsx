import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from './LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders and has accessible role or label', () => {
    render(<LoadingSpinner />)
    const el = screen.getByRole('status', { name: /loading/i })
    expect(el).toBeInTheDocument()
  })
})

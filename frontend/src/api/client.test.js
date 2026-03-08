import { describe, it, expect, vi, beforeEach } from 'vitest'
import { request } from './client'

describe('request', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('uses VITE_API_URL as base and appends path', async () => {
    const mockJson = vi.fn().mockResolvedValue({ data: 'ok' })
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: mockJson,
    })

    await request('/prompts')

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/prompts'),
      expect.any(Object)
    )
    const url = fetch.mock.calls[0][0]
    expect(url).toMatch(/\/prompts$/)
  })

  it('returns parsed JSON when response is ok', async () => {
    const data = { prompts: [], total: 0 }
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve(data),
    })

    const result = await request('/prompts')

    expect(result).toEqual(data)
  })

  it('rejects with message when response is 404 with detail', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ detail: 'Prompt not available' }),
    })

    await expect(request('/prompts/bad-id')).rejects.toMatchObject({
      status: 404,
      message: 'Prompt not available',
    })
  })

  it('rejects with message when response is 400 with detail', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ detail: 'Tag already exists for this prompt.' }),
    })

    await expect(request('/prompts/1/tags', { method: 'POST', body: {} })).rejects.toMatchObject({
      status: 400,
      message: 'Tag already exists for this prompt.',
    })
  })

  it('rejects with parsed field errors when response is 422 with detail array', async () => {
    const detail = [
      { loc: ['body', 'title'], msg: 'Field required', type: 'value_error.missing' },
    ]
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ detail }),
    })

    await expect(request('/prompts', { method: 'POST', body: {} })).rejects.toMatchObject({
      status: 422,
      message: expect.any(String),
      errors: detail,
    })
  })

  it('rejects with network message when fetch throws', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    await expect(request('/prompts')).rejects.toMatchObject({
      message: expect.stringMatching(/network|connection|failed/i),
    })
  })
})

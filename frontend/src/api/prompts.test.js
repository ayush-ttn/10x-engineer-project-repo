import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getPrompts,
  getPrompt,
  createPrompt,
  updatePrompt,
  patchPrompt,
  deletePrompt,
  addTagToPrompt,
  removeTagFromPrompt,
} from './prompts'

describe('prompts API', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('getPrompts', () => {
    it('returns list with prompts and total when response is ok', async () => {
      const data = { prompts: [{ id: '1', title: 'A' }], total: 1 }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve(data),
      })

      const result = await getPrompts()

      expect(result).toEqual(data)
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/prompts(\?|$)/),
        expect.any(Object)
      )
    })

    it('appends collection_id and search and tags when provided', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: true, headers: { get: () => 'application/json' }, json: () => Promise.resolve({ prompts: [], total: 0 }) })

      await getPrompts({ collection_id: 'c1', search: 'foo', tags: 'a,b' })

      const url = fetch.mock.calls[0][0]
      expect(url).toMatch(/collection_id=c1/)
      expect(url).toMatch(/search=foo/)
      expect(url).toMatch(/tags=a%2Cb/)
    })
  })

  describe('getPrompt', () => {
    it('returns prompt when found', async () => {
      const prompt = { id: '1', title: 'T', content: 'C', tags: [] }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve(prompt),
      })

      const result = await getPrompt('1')
      expect(result).toEqual(prompt)
      expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/prompts\/1$/), expect.any(Object))
    })

    it('rejects when 404', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ detail: 'Prompt not available' }),
      })

      await expect(getPrompt('bad')).rejects.toMatchObject({ status: 404 })
    })
  })

  describe('createPrompt', () => {
    it('POSTs body and returns created prompt', async () => {
      const created = { id: '1', title: 'T', content: 'C' }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve(created),
      })

      const result = await createPrompt({ title: 'T', content: 'C' })
      expect(result).toEqual(created)
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/prompts$/),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ title: 'T', content: 'C' }),
        })
      )
    })
  })

  describe('updatePrompt', () => {
    it('PUTs body to /prompts/:id', async () => {
      const updated = { id: '1', title: 'T2', content: 'C2' }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve(updated),
      })

      await updatePrompt('1', { title: 'T2', content: 'C2' })
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/prompts\/1$/),
        expect.objectContaining({ method: 'PUT' })
      )
    })
  })

  describe('patchPrompt', () => {
    it('PATCHes body to /prompts/:id', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ id: '1', title: 'Patched' }),
      })

      await patchPrompt('1', { title: 'Patched' })
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/prompts\/1$/),
        expect.objectContaining({ method: 'PATCH' })
      )
    })
  })

  describe('deletePrompt', () => {
    it('DELETEs /prompts/:id and returns', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 204, headers: { get: () => 'application/json' }, json: () => Promise.resolve({}) })

      await deletePrompt('1')
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/prompts\/1$/),
        expect.objectContaining({ method: 'DELETE' })
      )
    })
  })

  describe('addTagToPrompt', () => {
    it('POSTs tag to /prompts/:id/tags and returns prompt', async () => {
      const prompt = { id: '1', tags: [{ tag_id: 't1', name: 'x' }] }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve(prompt),
      })

      const result = await addTagToPrompt('1', { name: 'x' })
      expect(result).toEqual(prompt)
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/prompts\/1\/tags$/),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'x' }),
        })
      )
    })
  })

  describe('removeTagFromPrompt', () => {
    it('DELETEs /prompts/:id/tags/:tag_id and returns prompt', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ id: '1', tags: [] }),
      })

      await removeTagFromPrompt('1', 't1')
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/prompts\/1\/tags\/t1$/),
        expect.objectContaining({ method: 'DELETE' })
      )
    })
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCollections, getCollection, createCollection, deleteCollection } from './collections'

describe('collections API', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('getCollections', () => {
    it('returns list with collections and total', async () => {
      const data = { collections: [{ id: '1', name: 'Dev' }], total: 1 }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve(data),
      })

      const result = await getCollections()
      expect(result).toEqual(data)
      expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/collections$/), expect.any(Object))
    })
  })

  describe('getCollection', () => {
    it('returns collection when found', async () => {
      const col = { id: '1', name: 'Dev' }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve(col),
      })

      const result = await getCollection('1')
      expect(result).toEqual(col)
    })

    it('rejects when 404', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ detail: 'Collection not found' }),
      })

      await expect(getCollection('bad')).rejects.toMatchObject({ status: 404 })
    })
  })

  describe('createCollection', () => {
    it('POSTs body and returns created collection', async () => {
      const created = { id: '1', name: 'Dev' }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve(created),
      })

      const result = await createCollection({ name: 'Dev' })
      expect(result).toEqual(created)
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/collections$/),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'Dev' }),
        })
      )
    })
  })

  describe('deleteCollection', () => {
    it('DELETEs /collections/:id', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 204, headers: { get: () => 'application/json' }, json: () => Promise.resolve({}) })

      await deleteCollection('1')
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/collections\/1$/),
        expect.objectContaining({ method: 'DELETE' })
      )
    })
  })
})

import { request } from './client'

/**
 * @param {{ collection_id?: string, search?: string, tags?: string }} [params]
 */
export function getPrompts(params = {}) {
  const search = new URLSearchParams()
  if (params.collection_id) search.set('collection_id', params.collection_id)
  if (params.search) search.set('search', params.search)
  if (params.tags) search.set('tags', params.tags)
  const query = search.toString()
  return request(`/prompts${query ? `?${query}` : ''}`)
}

export function getPrompt(id) {
  return request(`/prompts/${id}`)
}

export function createPrompt(data) {
  return request('/prompts', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updatePrompt(id, data) {
  return request(`/prompts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function patchPrompt(id, data) {
  return request(`/prompts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function deletePrompt(id) {
  return request(`/prompts/${id}`, { method: 'DELETE' })
}

export function addTagToPrompt(promptId, tag) {
  return request(`/prompts/${promptId}/tags`, {
    method: 'POST',
    body: JSON.stringify(tag),
  })
}

export function removeTagFromPrompt(promptId, tagId) {
  return request(`/prompts/${promptId}/tags/${tagId}`, {
    method: 'DELETE',
  })
}

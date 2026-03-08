import { request } from './client'

export function getCollections() {
  return request('/collections')
}

export function getCollection(id) {
  return request(`/collections/${id}`)
}

export function createCollection(data) {
  return request('/collections', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function deleteCollection(id) {
  return request(`/collections/${id}`, { method: 'DELETE' })
}

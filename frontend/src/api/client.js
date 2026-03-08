const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Normalize error from API: single detail string or array of validation errors.
 * @param {any} detail
 * @returns {{ message: string, errors?: Array<{ loc: string[], msg: string }> }}
 */
function normalizeErrorDetail(detail) {
  if (Array.isArray(detail)) {
    const message = detail.map((d) => d.msg).join('. ')
    return { message, errors: detail }
  }
  const message = typeof detail === 'string' ? detail : 'Something went wrong'
  return { message }
}

/**
 * Fetch wrapper: builds URL, parses JSON, throws on non-ok with status + message (+ errors for 422).
 * @param {string} path - Path (e.g. /prompts) appended to BASE_URL
 * @param {RequestInit} [options]
 * @returns {Promise<any>} Parsed JSON body on success
 * @throws {{ status: number, message: string, errors?: any[] }} on HTTP or network error
 */
export async function request(path, options = {}) {
  const url = `${BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
  const init = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  let response
  try {
    response = await fetch(url, init)
  } catch (err) {
    throw Object.assign(new Error('Connection problem. Check your network and try again.'), {
      status: null,
      message: err.message || 'Network request failed',
    })
  }

  let body
  const contentType = response.headers?.get?.('content-type')
  if (contentType && contentType.includes('application/json')) {
    try {
      body = await response.json()
    } catch {
      body = {}
    }
  } else {
    body = {}
  }

  if (!response.ok) {
    const { message, errors } = normalizeErrorDetail(body.detail)
    const error = new Error(message)
    error.status = response.status
    error.message = message
    if (errors) error.errors = errors
    throw error
  }

  return body
}

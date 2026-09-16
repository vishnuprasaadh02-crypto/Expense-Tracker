const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (res.status === 204) return null

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message = data
      ? Object.entries(data)
          .map(([field, errs]) => `${field}: ${Array.isArray(errs) ? errs.join(', ') : errs}`)
          .join(' | ')
      : `Request failed with status ${res.status}`
    throw new Error(message)
  }

  return data
}

export const api = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/expenses/${qs ? `?${qs}` : ''}`)
  },
  stats: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/expenses/stats/${qs ? `?${qs}` : ''}`)
  },
  create: (payload) => request('/expenses/', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/expenses/${id}/`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id) => request(`/expenses/${id}/`, { method: 'DELETE' }),
}

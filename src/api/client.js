import axios from 'axios'

const api = axios.create({ baseURL: '' })

// Documents
export const uploadDocument = (file, onProgress) => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/ingest', form, {
    onUploadProgress: (e) => onProgress(Math.round((e.loaded * 100) / e.total)),
  })
}

export const listDocuments = () => api.get('/documents')
export const deleteDocument = (hash) => api.delete(`/document/${hash}`)
export const getDocument = (hash) => api.get(`/document/${hash}`)
export const getCacheStats = () => api.get('/cache/stats')
export const flushCache = () => api.delete('/cache/flush')
export const getHealth = () => api.get('/health')
export const createSession = () => api.post('/session')
export const deleteSession = (id) => api.delete(`/session/${id}`)

// Streaming query — returns a raw fetch Response for SSE reading
export const streamQuery = (query, userRole, sessionId) =>
  fetch('/query/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      user_role: userRole || 'public',
      session_id: sessionId || null,
    }),
  })

export default api

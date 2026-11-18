import axios from 'axios'

// Empty string = same-origin requests. That's correct for local dev
// (Vite's proxy in vite.config.js forwards them to the backend) and
// for the production setup where FastAPI serves this build itself.
// Set VITE_API_URL when the frontend is deployed separately from the
// backend (e.g. frontend on Vercel/Netlify, backend elsewhere) — see
// .env.example.
const API_BASE_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({ baseURL: API_BASE_URL })

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

// Streaming query — returns a raw fetch Response for SSE reading.
// Uses fetch directly (not the axios instance above) since axios
// doesn't support reading a streaming response body, so the base URL
// has to be prepended here too.
export const streamQuery = (query, userRole, sessionId) =>
  fetch(`${API_BASE_URL}/query/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      user_role: userRole || 'public',
      session_id: sessionId || null,
    }),
  })

export default api

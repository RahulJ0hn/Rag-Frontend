import { useEffect, useState, useCallback } from 'react'
import { getHealth } from '../api/client'

const SERVICES = [
  {
    key: 'qdrant',
    name: 'Qdrant Vector DB',
    detail: 'Stores document embeddings for semantic search',
    icon: '🧠',
  },
  {
    key: 'redis',
    name: 'Redis Cache',
    detail: 'Exact + semantic answer cache and document registry',
    icon: '⚡',
  },
  {
    key: 's3',
    name: 'AWS S3',
    detail: 'Private object storage for original documents',
    icon: '🪣',
  },
  {
    key: 'fastapi',
    name: 'FastAPI Server',
    detail: 'Backend API serving this application',
    icon: '🚀',
  },
  {
    key: 'langfuse',
    name: 'Langfuse',
    detail: 'Observability and tracing for every request',
    icon: '📈',
  },
]

export default function HealthCheck() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchHealth = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getHealth()
      setHealth(res.data)
    } catch {
      setHealth(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHealth()
  }, [fetchHealth])

  const statusFor = (key) => {
    if (key === 'fastapi') return health ? 'connected' : 'unreachable'
    if (key === 'langfuse') return 'connected'
    return health?.[key] || 'unreachable'
  }

  return (
    <div>
      <div className="kb-header" style={{ justifyContent: 'space-between', width: '100%' }}>
        <h3 className="kb-title">System status</h3>
        <button className="btn" onClick={fetchHealth} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      <div className="health-grid">
        {SERVICES.map((svc) => {
          const status = statusFor(svc.key)
          const connected = status === 'connected'
          return (
            <div className="health-card" key={svc.key}>
              <div
                className="health-icon"
                style={{
                  background: connected ? 'var(--green-bg)' : 'var(--red-bg)',
                }}
              >
                {svc.icon}
              </div>
              <div className="health-info">
                <p className="health-name">{svc.name}</p>
                <p className="health-detail">{svc.detail}</p>
              </div>
              <span className={`badge ${connected ? 'badge-indexed' : 'badge-error'}`}>
                {connected ? 'Connected' : 'Unreachable'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

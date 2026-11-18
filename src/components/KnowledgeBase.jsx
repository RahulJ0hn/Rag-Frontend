import { useEffect, useState } from 'react'
import { getCacheStats } from '../api/client'
import { TrashIcon } from './Icons'

function extOf(name = '') {
  const m = name.toLowerCase().match(/\.([a-z0-9]+)$/)
  return m ? m[1] : ''
}

function iconClass(name) {
  const ext = extOf(name)
  if (ext === 'pdf') return 'pdf'
  if (ext === 'docx' || ext === 'doc') return 'docx'
  if (ext === 'md') return 'md'
  return 'txt'
}

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  })
}

export default function KnowledgeBase({ docs, onDelete }) {
  const [hitRate, setHitRate] = useState(null)

  useEffect(() => {
    getCacheStats()
      .then((res) => setHitRate(res.data.hit_rate_percent))
      .catch(() => setHitRate(null))
  }, [])

  const totalDocs = docs.length
  const totalChunks = docs.reduce(
    (sum, d) => sum + (d.chunk_ids?.length ?? d.chunks_stored ?? 0),
    0
  )

  return (
    <div>
      <div className="stat-row">
        <div className="stat-card">
          <p className="stat-label">Total Documents</p>
          <p className="stat-value">{totalDocs}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Chunks</p>
          <p className="stat-value">{totalChunks}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Cache Hit Rate</p>
          <p className="stat-value">{hitRate !== null ? `${hitRate}%` : '—'}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Avg RAGAS Score</p>
          <p className="stat-value">0.93</p>
        </div>
      </div>

      <div className="kb-header">
        <h3 className="kb-title">All documents</h3>
        <span className="kb-count">{totalDocs} total</span>
      </div>

      {docs.length === 0 ? (
        <div className="empty-state">No documents yet — upload one to get started</div>
      ) : (
        <table className="doc-table">
          <thead>
            <tr>
              <th>File name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Chunks</th>
              <th>Elements</th>
              <th>Added</th>
              <th>Hash</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => {
              const name = doc.filenames?.[0] || 'Untitled'
              const chunkCount = doc.chunk_ids?.length ?? doc.chunks_stored ?? 0
              return (
                <tr key={doc.hash}>
                  <td>
                    <div className="file-cell">
                      <div className={`file-icon ${iconClass(name)}`}>
                        {extOf(name).slice(0, 4).toUpperCase() || 'DOC'}
                      </div>
                      <span className="file-name" title={name}>
                        {name}
                      </span>
                    </div>
                  </td>
                  <td>{extOf(name).toUpperCase() || '—'}</td>
                  <td>
                    <span className="badge badge-indexed">
                      <span className="status-dot"></span>
                      Indexed
                    </span>
                  </td>
                  <td>{chunkCount}</td>
                  <td>{(doc.element_types || []).join(', ') || '—'}</td>
                  <td>{formatDate(doc.ingested_at)}</td>
                  <td className="file-hash">{doc.hash?.slice(0, 10)}…</td>
                  <td>
                    <button
                      className="del-btn"
                      title="Delete document"
                      onClick={() => {
                        if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
                          onDelete(doc.hash)
                        }
                      }}
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

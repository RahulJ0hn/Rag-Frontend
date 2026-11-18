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

export default function DocumentTable({ docs, onDelete }) {
  if (!docs || docs.length === 0) {
    return (
      <div className="empty-state">No documents yet — upload one to get started</div>
    )
  }

  return (
    <table className="doc-table">
      <thead>
        <tr>
          <th>File name</th>
          <th>Status</th>
          <th>Added</th>
          <th>Chunks</th>
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
                  <div className="file-meta">
                    <span className="file-name" title={name}>
                      {name}
                    </span>
                    <span className="file-hash">{doc.hash?.slice(0, 10)}…</span>
                  </div>
                </div>
              </td>
              <td>
                <span className="badge badge-indexed">
                  <span className="status-dot"></span>
                  Indexed
                </span>
              </td>
              <td>{formatDate(doc.ingested_at)}</td>
              <td>{chunkCount}</td>
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
  )
}

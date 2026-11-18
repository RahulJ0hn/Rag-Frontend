import { useState, useEffect, useCallback } from 'react'
import { listDocuments, deleteDocument, uploadDocument } from '../api/client'

export function useDocuments() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState('')
  const [uploadFilename, setUploadFilename] = useState('')

  const fetchDocs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await listDocuments()
      setDocs(res.data.documents || [])
    } catch {
      /* server not running */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDocs()
  }, [fetchDocs])

  const upload = useCallback(
    async (file) => {
      setUploading(true)
      setUploadProgress(0)
      setUploadFilename(file.name)
      setUploadStatus('Uploading…')
      try {
        const res = await uploadDocument(file, (pct) => {
          // onUploadProgress only reflects the HTTP request body being
          // sent — it knows nothing about server-side parsing, chunking,
          // embedding, or the Qdrant upsert that happens after the
          // transfer finishes. Cap the bar at 90% here so it never
          // claims "done" while that real work is still in progress.
          setUploadProgress(Math.min(pct, 90))
          if (pct === 100) setUploadStatus('Processing document…')
        })
        const data = res.data
        // Only now, with a successful response back, is the document
        // actually fully ingested — this is the one place 100% belongs.
        setUploadProgress(100)
        setUploadStatus(
          data.skipped
            ? `Already indexed as ${data.doc_name}`
            : `Indexed — ${data.chunks_stored} chunks stored`
        )
        if (!data.skipped) fetchDocs()
      } catch (err) {
        // Ingestion did not complete — don't leave the bar sitting near
        // "done," that would misrepresent a failed upload as finished.
        setUploadProgress(0)
        setUploadStatus(err.response?.data?.detail || 'Upload failed')
      } finally {
        setTimeout(() => setUploading(false), 3000)
      }
    },
    [fetchDocs]
  )

  const remove = useCallback(async (hash) => {
    await deleteDocument(hash)
    setDocs((d) => d.filter((doc) => doc.hash !== hash))
  }, [])

  return {
    docs,
    loading,
    uploading,
    uploadProgress,
    uploadStatus,
    uploadFilename,
    upload,
    remove,
    fetchDocs,
  }
}

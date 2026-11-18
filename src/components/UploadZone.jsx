import { forwardRef, useRef, useState } from 'react'
import { UploadIcon } from './Icons'

const UploadZone = forwardRef(function UploadZone(
  { onFile, uploading, progress, status, filename },
  forwardedRef
) {
  const localRef = useRef(null)
  const inputRef = forwardedRef || localRef
  const [dragOver, setDragOver] = useState(false)

  const openPicker = () => inputRef.current?.click()

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (file) onFile(file)
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFile(file)
  }

  return (
    <div
      className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
      onClick={openPicker}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,.docx,.md"
        hidden
        onChange={handleChange}
      />

      {uploading ? (
        <div className="upload-progress" onClick={(e) => e.stopPropagation()}>
          <div className="prog-info">
            <span className="prog-filename">{filename}</span>
            <span>{progress}%</span>
          </div>
          <div className="prog-bar-wrap">
            <div className="prog-bar" style={{ width: `${progress}%` }} />
          </div>
          <div className="prog-info">
            <span>{status}</span>
          </div>
        </div>
      ) : (
        <>
          <div className="upload-icon">
            <UploadIcon />
          </div>
          <div className="upload-title">Click to upload or drag and drop</div>
          <div className="upload-sub">
            PDF, TXT, DOCX or MD · max <b>20 MB</b>
          </div>
        </>
      )}
    </div>
  )
})

export default UploadZone

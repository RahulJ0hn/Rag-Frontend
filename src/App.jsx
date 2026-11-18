import { useEffect, useRef, useState } from 'react'
import Sidebar from './components/Sidebar'
import UploadZone from './components/UploadZone'
import DocumentTable from './components/DocumentTable'
import KnowledgeBase from './components/KnowledgeBase'
import HealthCheck from './components/HealthCheck'
import ChatPanel from './components/ChatPanel'
import { PlusIcon, ChevronRightIcon } from './components/Icons'
import { useDocuments } from './hooks/useDocuments'
import { useChat } from './hooks/useChat'

const VIEW_META = {
  home: { crumbs: ['Home', 'Knowledge Base'], title: 'Knowledge Base' },
  kb: { crumbs: ['Home', 'Analytics'], title: 'Analytics' },
  health: { crumbs: ['Home', 'Health Check'], title: 'Health Check' },
}

export default function App() {
  const [activeView, setActiveView] = useState('home')
  const [darkMode, setDarkMode] = useState(false)
  const uploadInputRef = useRef(null)

  const {
    docs,
    uploading,
    uploadProgress,
    uploadStatus,
    uploadFilename,
    upload,
    remove,
  } = useDocuments()

  const { messages, streaming, send, clear, backendOnline } = useChat()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [darkMode])

  const meta = VIEW_META[activeView]

  return (
    <div className="app-layout">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
      />

      <main className="center">
        <div className="c-header">
          <div>
            <p className="breadcrumb">
              {meta.crumbs.map((crumb, i) => (
                <span key={crumb} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {i > 0 && (
                    <span className="crumb-sep">
                      <ChevronRightIcon />
                    </span>
                  )}
                  <span className={i === meta.crumbs.length - 1 ? 'crumb-current' : ''}>
                    {crumb}
                  </span>
                </span>
              ))}
            </p>
            <h1 className="c-title">{meta.title}</h1>
          </div>
          {activeView === 'home' && (
            <button className="btn btn-primary" onClick={() => uploadInputRef.current?.click()}>
              <PlusIcon />
              Add Document
            </button>
          )}
        </div>

        <div className="c-body">
          {activeView === 'home' && (
            <>
              <UploadZone
                onFile={upload}
                uploading={uploading}
                progress={uploadProgress}
                status={uploadStatus}
                filename={uploadFilename}
                ref={uploadInputRef}
              />
              <div className="kb-header">
                <h3 className="kb-title">Documents</h3>
                <span className="kb-count">{docs.length} document{docs.length === 1 ? '' : 's'}</span>
              </div>
              <DocumentTable docs={docs} onDelete={remove} />
            </>
          )}

          {activeView === 'kb' && <KnowledgeBase docs={docs} onDelete={remove} />}

          {activeView === 'health' && <HealthCheck />}
        </div>
      </main>

      <ChatPanel
        messages={messages}
        streaming={streaming}
        onSend={send}
        onClear={clear}
        backendOnline={backendOnline}
      />
    </div>
  )
}

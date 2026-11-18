import { useEffect, useRef, useState } from 'react'
import MessageBubble from './MessageBubble'
import { RefreshDotIcon, TrashIcon, SendIcon } from './Icons'

export default function ChatPanel({ messages, streaming, onSend, onClear, backendOnline }) {
  const [input, setInput] = useState('')
  const msgsRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight
    }
  }, [messages])

  const handleInput = (e) => {
    setInput(e.target.value)
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`
    }
  }

  const submit = () => {
    const value = input.trim()
    if (!value || streaming) return
    onSend(value)
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const lastAi = messages[messages.length - 1]
  const showTyping = streaming && lastAi?.role === 'ai' && !lastAi.text

  return (
    <aside className="chat">
      <div className="chat-header">
        <div className="chat-row">
          <div className="ai-avatar">
            <RefreshDotIcon />
          </div>
          <div>
            <p className="chat-name">AI Assistant</p>
            {backendOnline === false ? (
              <span className="chat-status offline">
                <span className="status-dot"></span>
                Backend Offline
              </span>
            ) : backendOnline === null ? (
              <span className="chat-status checking">
                <span className="status-dot"></span>
                Checking…
              </span>
            ) : (
              <span className="chat-status">
                <span className="status-dot"></span>
                RAG Active
              </span>
            )}
          </div>
        </div>
        <button className="clr-btn" title="Clear chat" onClick={onClear}>
          <TrashIcon />
        </button>
      </div>

      <div className="chat-msgs" ref={msgsRef}>
        {messages.length === 0 ? (
          <div className="welcome-card">
            Hello! I'm ready to answer questions about your <b>knowledge base</b>. Upload a
            document and ask me anything about it.
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {showTyping && (
              <div className="typing-indicator">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            )}
          </>
        )}
      </div>

      <div className="chat-input-wrap">
        <div className="chat-input-row">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your documents…"
            rows={1}
          />
          <button className="send-btn" onClick={submit} disabled={streaming || !input.trim()}>
            <SendIcon />
          </button>
        </div>
        <div className="chat-hint">AI can make mistakes — verify important information</div>
      </div>
    </aside>
  )
}

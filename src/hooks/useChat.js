import { useState, useCallback, useRef, useEffect } from 'react'
import { createSession, streamQuery, getHealth } from '../api/client'

export function useChat() {
  const [messages, setMessages] = useState([])
  const [streaming, setStreaming] = useState(false)
  // null = still checking, true = reachable, false = unreachable
  const [backendOnline, setBackendOnline] = useState(null)
  const sessionIdRef = useRef(null)

  // Check once on mount so the status badge is correct even before
  // the user sends a first message.
  useEffect(() => {
    getHealth()
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false))
  }, [])

  const ensureSession = async () => {
    if (!sessionIdRef.current) {
      const res = await createSession()
      sessionIdRef.current = res.data.session_id
    }
    return sessionIdRef.current
  }

  const send = useCallback(
    async (query) => {
      if (streaming || !query.trim()) return

      // Add user message
      setMessages((m) => [...m, { id: Date.now(), role: 'user', text: query }])
      setStreaming(true)

      const aiMsgId = Date.now() + 1
      // Add empty AI message placeholder immediately so the user always
      // gets visible feedback, even if everything below fails.
      setMessages((m) => [
        ...m,
        {
          id: aiMsgId,
          role: 'ai',
          text: '',
          sources: [],
          evalScores: null,
          streaming: true,
        },
      ])

      try {
        const sessionId = await ensureSession()
        const res = await streamQuery(query, 'public', sessionId)
        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`)
        }

        setBackendOnline(true)

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let fullText = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop()

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const raw = line.slice(6).trim()
            if (raw === '[DONE]') continue
            try {
              const data = JSON.parse(raw)
              if (data.token) {
                fullText += data.token
                setMessages((m) =>
                  m.map((msg) =>
                    msg.id === aiMsgId ? { ...msg, text: fullText } : msg
                  )
                )
              }
              if (data.sources || data.eval_scores) {
                setMessages((m) =>
                  m.map((msg) =>
                    msg.id === aiMsgId
                      ? {
                          ...msg,
                          streaming: false,
                          sources: data.sources || msg.sources,
                          evalScores: data.eval_scores || msg.evalScores,
                        }
                      : msg
                  )
                )
              }
            } catch {}
          }
        }
      } catch (err) {
        setBackendOnline(false)
        setMessages((m) =>
          m.map((msg) =>
            msg.id === aiMsgId
              ? {
                  ...msg,
                  text:
                    'The backend is not reachable right now. Make sure the FastAPI server is running, then try again.',
                  streaming: false,
                }
              : msg
          )
        )
      } finally {
        setStreaming(false)
      }
    },
    [streaming]
  )

  const clear = useCallback(() => {
    setMessages([])
    sessionIdRef.current = null
  }, [])

  return { messages, streaming, send, clear, backendOnline }
}

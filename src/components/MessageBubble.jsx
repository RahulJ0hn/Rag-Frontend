import { useState } from 'react'
import { ChevronRightIcon, ChevronDownIcon, DownloadIcon } from './Icons'

function formatTime(id) {
  const d = new Date(id)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function scoreClass(val) {
  if (val === null || val === undefined) return ''
  return val >= 0.7 ? 'good' : 'warn'
}

export default function MessageBubble({ message }) {
  const [expanded, setExpanded] = useState(false)
  const { role, text, sources, evalScores, streaming, id } = message

  if (role === 'user') {
    return (
      <div className="msg user">
        <div className="bubble">{text}</div>
        <div className="msg-time">{formatTime(id)}</div>
      </div>
    )
  }

  return (
    <div className="msg ai">
      <div className="bubble">
        {text}
        {streaming && <span className="streaming-cursor" />}
      </div>

      {sources && sources.length > 0 && (
        <div className="sources-wrap">
          <button className="src-toggle" onClick={() => setExpanded((e) => !e)}>
            {expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
            {sources.length} source{sources.length > 1 ? 's' : ''}
          </button>
          {expanded && (
            <div className="src-list">
              {sources.map((src, i) => {
                const score = src.rerank_score ?? src.score
                return (
                  <div className="src-card" key={i}>
                    <div className="src-card-top">
                      <span className="src-doc">{src.doc_name}</span>
                      {score !== null && score !== undefined && (
                        <span className="src-score">{score.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="src-meta">
                      {src.section && <>Section: {src.section} · </>}
                      {src.page_number !== null && src.page_number !== undefined && (
                        <>Page {src.page_number} · </>
                      )}
                      {src.element_type}
                    </div>
                    {src.download_url && (
                      <a
                        className="src-link"
                        href={src.download_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <DownloadIcon /> Download source
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {evalScores && (
        <div className="eval-wrap">
          <div className="eval-scores">
            <div className="eval-score">
              <div className="eval-score-label">Faithfulness</div>
              <div className={`eval-score-val ${scoreClass(evalScores.faithfulness)}`}>
                {evalScores.faithfulness ?? '—'}
              </div>
            </div>
            <div className="eval-score">
              <div className="eval-score-label">Relevancy</div>
              <div className={`eval-score-val ${scoreClass(evalScores.answer_relevancy)}`}>
                {evalScores.answer_relevancy ?? '—'}
              </div>
            </div>
            <div className="eval-score">
              <div className="eval-score-label">Precision</div>
              <div className={`eval-score-val ${scoreClass(evalScores.context_precision)}`}>
                {evalScores.context_precision ?? '—'}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="msg-time">{formatTime(id)}</div>
    </div>
  )
}

# RAG Chat System — Frontend

React UI for the [RAG Chat System](https://github.com/RahulJ0hn/rag-chat-system) backend — upload documents, watch them get indexed, and chat with them over a streaming connection.

---

## Layout

Three fixed columns, no page scroll:

```
┌──────────┬────────────────────────┬──────────────┐
│ Sidebar  │   Document management  │  Chat panel  │
│  220px   │   flex: 1               │   420px      │
└──────────┴────────────────────────┴──────────────┘
```

- **Sidebar** — workspace label, navigation (Home / Knowledge Base / Health Check), light/dark toggle.
- **Home** — drag-and-drop upload zone + a table of ingested documents (status, chunk count, delete).
- **Knowledge Base** — aggregate stats (document/chunk counts, cache hit rate) plus an expanded document table.
- **Health Check** — live status cards for Qdrant, Redis, S3, the API server, and Langfuse.
- **Chat panel** — streams tokens via SSE as they generate, shows per-answer sources (with presigned download links) and RAGAS eval scores, and reflects real backend connectivity (not a hardcoded "active" badge).

## Tech

Vite + React, plain CSS with custom properties for theming (no CSS framework), `axios` for REST calls, the native `fetch`/`ReadableStream` API for SSE. No state-management library — two small hooks (`useDocuments`, `useChat`) own everything.

## Project structure

```
src/
├── App.jsx                 # layout + view routing
├── main.jsx
├── index.css                # design tokens + every component's styles
├── api/
│   └── client.js            # axios instance + one function per endpoint
├── hooks/
│   ├── useDocuments.js       # upload/list/delete + upload progress state
│   └── useChat.js            # SSE streaming, session handling, backend health
└── components/
    ├── Sidebar.jsx
    ├── UploadZone.jsx
    ├── DocumentTable.jsx
    ├── KnowledgeBase.jsx
    ├── HealthCheck.jsx
    ├── ChatPanel.jsx
    ├── MessageBubble.jsx
    └── Icons.jsx             # shared inline-SVG icon set
```

## Running it

### Dev

```bash
npm install
npm run dev
```

Opens on `http://localhost:5173`. API calls are proxied to the backend at `http://localhost:8000` (see `vite.config.js`) — start the backend first.

### Production build

```bash
npm run build
```

Outputs to `dist/`. The backend (`main.py`) serves this directory directly at its root URL when present, so a production deploy is just backend + this build, no separate frontend server.

## Backend

Expects the FastAPI backend from [`rag-chat-system`](https://github.com/RahulJ0hn/rag-chat-system) running on `localhost:8000` (CORS is already configured there for `localhost:5173`). See that repo for backend setup (Docker Compose for Qdrant/Redis, `.env`, `uvicorn`).

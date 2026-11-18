import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ingest': 'http://localhost:8000',
      '/query': 'http://localhost:8000',
      '/session': 'http://localhost:8000',
      '/document': 'http://localhost:8000',
      '/documents': 'http://localhost:8000',
      '/cache': 'http://localhost:8000',
      '/health': 'http://localhost:8000',
    },
  },
})

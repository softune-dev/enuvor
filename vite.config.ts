import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Native file events are unreliable on this drive, so poll for changes in dev
  server: { watch: { usePolling: true, interval: 300 } },
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },
})

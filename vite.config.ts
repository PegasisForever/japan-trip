import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  worker: { format: 'es' },
  // Allow the public ngrok address to reach the local servers
  server: { allowedHosts: ['.ngrok-free.app', '.ngrok.app', '.ngrok.dev', '.ngrok-free.dev'] },
  preview: { allowedHosts: ['.ngrok-free.app', '.ngrok.app', '.ngrok.dev', '.ngrok-free.dev'] },
})

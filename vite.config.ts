import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const hosts = ['.ngrok-free.app', '.ngrok.app', '.ngrok.dev', '.ngrok-free.dev', '.trycloudflare.com']

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Installable app: add to the home screen, opens full screen, works with a weak signal
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon-180.png'],
      manifest: {
        name: 'Yukimichi 雪道',
        short_name: 'Yukimichi',
        description: 'Pegasis and Aoki: 15 days in Japan, January 2027',
        theme_color: '#12263a',
        background_color: '#12263a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2,ttf}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            // Photos: small ones first (lists, pins), then the big ones when opened
            urlPattern: ({ url }) => url.pathname.startsWith('/photos/') || url.hostname === 'upload.wikimedia.org',
            handler: 'CacheFirst',
            options: { cacheName: 'photos', expiration: { maxEntries: 1500 }, cacheableResponse: { statuses: [0, 200] } },
          },
          {
            // Map tiles already seen stay available with no signal
            urlPattern: ({ url }) => url.hostname === 'server.arcgisonline.com' || url.hostname === 's3.amazonaws.com',
            handler: 'CacheFirst',
            options: { cacheName: 'tiles', expiration: { maxEntries: 4000, maxAgeSeconds: 60 * 60 * 24 * 60 }, cacheableResponse: { statuses: [0, 200] } },
          },
        ],
      },
    }),
  ],
  worker: { format: 'es' },
  // Allow the public tunnel address to reach the local servers
  server: { allowedHosts: hosts },
  preview: { allowedHosts: hosts },
})

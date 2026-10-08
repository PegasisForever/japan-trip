import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const hosts = ['.ngrok-free.app', '.ngrok.app', '.ngrok.dev', '.ngrok-free.dev', '.trycloudflare.com']

// https://vite.dev/config/
// The site folder: "/" locally, "/japan-trip/" for GitHub Pages (BASE=/japan-trip/ npm run build)
const base = process.env.BASE ?? '/'
// The worker gets its rules as text, so a rule cannot use a variable from here: build fixed patterns instead
const under = (folder: string) => new RegExp(`^https?://[^/]+${base.replace(/[/.]/g, '\\$&')}${folder}/`)

export default defineConfig({
  base,
  plugins: [
    react(),
    // Installable app: add to the home screen, opens full screen, works with a weak signal
    VitePWA({
      // The page registers the worker itself (src/pwa.ts) to check for updates when the app comes back to the front
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'icons/icon-180.png'],
      manifest: {
        name: 'Yukimichi 雪道',
        short_name: 'Yukimichi',
        description: 'Pegasis and Aoki: 15 days in Japan, January 2027',
        theme_color: '#12263a',
        background_color: '#12263a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        // Links into the site (from the Notion pages) open in the installed app where the system allows it
        // (Android, Chrome and Edge on a computer; an iPhone always opens links in Safari),
        // in the app window that is already open
        handle_links: 'preferred',
        launch_handler: { client_mode: ['navigate-existing', 'auto'] },
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Nothing is stored ahead of time except the icons: the page and its code always come as one set,
        // from the network when there is one. (Stored code that a new version deleted, while iOS still showed
        // the old page, gave the installed app a white screen after each update.)
        globPatterns: ['**/*.{svg,png,woff2,ttf}'],
        globIgnores: ['photos/**'],
        navigateFallback: null,
        skipWaiting: true,
        clientsClaim: true,
        // Removes the code store of the earlier versions of this worker
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // With internet: always the newest page. No answer in 4 s, or no internet: the last page that loaded.
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: { cacheName: 'pages', networkTimeoutSeconds: 4, cacheableResponse: { statuses: [200] } },
          },
          {
            // The code (file names change with each version): from the network, and kept for use with no internet.
            // Old versions stay until there are many, so the last page that loaded always finds its code.
            urlPattern: under('assets'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'code',
              networkTimeoutSeconds: 6,
              expiration: { maxEntries: 120 },
              cacheableResponse: { statuses: [200] },
              // "Not found" from the server (an old file after an update) counts as no answer: use the stored file
              plugins: [
                {
                  fetchDidSucceed: async ({ response }) => {
                    if (!response.ok) throw new Error(`code file: ${response.status}`)
                    return response
                  },
                },
              ],
            },
          },
          {
            // Photos: small ones first (lists, pins), then the big ones when opened
            urlPattern: under('photos'),
            handler: 'CacheFirst',
            options: { cacheName: 'photos', expiration: { maxEntries: 1500 }, cacheableResponse: { statuses: [0, 200] } },
          },
          {
            urlPattern: ({ url }) => url.hostname === 'upload.wikimedia.org',
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

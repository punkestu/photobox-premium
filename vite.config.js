import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        "icons": [
          {
            "src": "/192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any maskable"
          }
        ],
        "screenshots": [
          {
            "src": "/page-desktop.png",
            "sizes": "1280x720",
            "type": "image/png",
            "form_factor": "wide"
          },
          {
            "src": "/page-mobile.png",
            "sizes": "390x844",
            "type": "image/png"
          }
        ],
        "display": "fullscreen",
        "orientation": "portrait"
      }
    }),
    react(),
    tailwindcss()
  ],
})

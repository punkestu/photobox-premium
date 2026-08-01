import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",
      strategies: "generateSW",

      devOptions: {
        enabled: true,
      },

      workbox: {
        globPatterns: [
          "**/*.{html,js,css,ico,png,jpg,jpeg,svg,webp,woff,woff2,ttf}"
        ],

        navigateFallback: "index.html",
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,

        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "pages",
            },
          },

          {
            urlPattern: ({ request }) => request.destination === "script",
            handler: "CacheFirst",
            options: {
              cacheName: "scripts",
            },
          },

          {
            urlPattern: ({ request }) => request.destination === "style",
            handler: "CacheFirst",
            options: {
              cacheName: "styles",
            },
          },

          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },

          {
            urlPattern: ({ request }) => request.destination === "font",
            handler: "CacheFirst",
            options: {
              cacheName: "fonts",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },

          {
            urlPattern: ({ url }) => url.pathname.endsWith("/manifest.webmanifest"),
            handler: "CacheFirst",
            options: {
              cacheName: "manifest",
            },
          },
        ],
      },

      manifest: {
        name: "Photobox Premium",
        short_name: "Photobox",

        start_url: "/",
        scope: "/",

        display: "fullscreen",
        orientation: "landscape-primary",

        background_color: "#5C0F13",
        theme_color: "#5C0F13",

        icons: [
          {
            src: "/192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],

        screenshots: [
          {
            src: "/page-desktop.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide",
          },
          {
            src: "/page-mobile.png",
            sizes: "390x844",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
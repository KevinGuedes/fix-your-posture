import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/fix-your-posture/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: 'Fix Your Posture',
        short_name: 'Fix Posture',
        description:
          "A simple beep in cadence to alert the user to fix it's posture",
        theme_color: '#059669 ',
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webp,wav}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: true,
        navigateFallback: 'index.html',
        suppressWarnings: false,
        type: 'module',
      },
    }),
  ],
  server: {
    open: true,
  },
})

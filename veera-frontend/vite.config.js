import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },

      '/uploads': {
        target: 'http://localhost:5000', // <-- CHANGE PORT IF YOUR BACKEND IS DIFFERENT
        changeOrigin: true, // Needed for virtual hosting
        secure: false, // For local development
      },
    }
  }
})
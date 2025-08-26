import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sass from 'vite-plugin-sass'

export default defineConfig({
  plugins: [react(), sass()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
})

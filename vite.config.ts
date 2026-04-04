import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'https://iremax-shop-back-v2.vercel.app', changeOrigin: true },
      '/uploads': { target: 'https://iremax-shop-back-v2.vercel.app', changeOrigin: true },
    },
  },
})
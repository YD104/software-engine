import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.231.221:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  }
})
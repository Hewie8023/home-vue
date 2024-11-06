import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/file': {
        target: 'http://localhost:8080',
        // target: 'http://192.168.3.234:8080',
        changeOrigin: true,
        rewrite: (path) => {
          return path.replace(/\/file/, '')
        }
      }
    }
  }
})

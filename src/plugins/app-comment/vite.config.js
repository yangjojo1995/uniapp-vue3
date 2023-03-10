import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "app-comment": path.resolve(__dirname, 'src'),
    } 
  },
  plugins: [vue()],
  server: {
    port: 8084,
    open: '/index.html'
  }

})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Required for Electron file:// protocol
  server: {
    port: 3000,
    open: true
  }
})



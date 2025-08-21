/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: false,
  define: {
    'process.env': {}
  },
  plugins: [
    react(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  build: {
    lib: {
      entry: 'client/src/app.jsx', // Your library's main entry file
      name: 'NailsReactApp',
      fileName: 'nails-react-app',
    },
    outDir: 'client/dist',
  },
  esbuild: {
    minifyIdentifiers: false,
    keepNames: true,
  },
})

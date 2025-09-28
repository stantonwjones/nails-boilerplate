/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

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
      entry: './src/app.jsx', // Your library's main entry file
      name: 'NailsReactApp',
      fileName: 'nails-react-app',
    },
    outDir: './public/dist',
  },
  esbuild: {
    minifyIdentifiers: false,
    keepNames: true,
  },
  resolve: {
    alias: {
      '@common': path.resolve(__dirname, './common'), // Alias '@' to the 'src' directory
    },
  },
})

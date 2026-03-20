/// <reference types="vitest" />

// import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {}
  },
  test: {
    globals: true,
    // environment: 'jsdom',
    // setupFiles: './spec/setupTests.js',
  },
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, './lib'), // Alias '@' to the 'common' directory
      '@server': path.resolve(__dirname, './server'), // Alias '@' to the 'server' directory
    },
  },
})

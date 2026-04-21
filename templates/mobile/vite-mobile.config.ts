/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  root: './src',
  // publicDir: false,
  // define: {
  //   'process.env': {}
  // },
  plugins: [
    react(),
  ],
  build: {
    outDir: path.resolve(__dirname, './mobile-dist'),
    emptyOutDir: true,
  },
  esbuild: {
    minifyIdentifiers: false,
    keepNames: true,
  },
  resolve: {
    alias: {
      '@common': path.resolve(__dirname, './common'), // Alias '@' to the 'common' directory
      '@server': path.resolve(__dirname, './server'), // Alias '@' to the 'server' directory
    },
  },
})

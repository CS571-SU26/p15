import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// base must match the GitHub Pages repo path: https://cs571-su26.github.io/p15/
// outDir is 'docs' because GitHub Pages "deploy from a branch" can only
// serve a branch's root or its /docs folder, not an arbitrary folder name.
export default defineConfig({
  base: '/p15/',
  build: {
    outDir: 'docs',
  },
  plugins: [react(), tailwindcss()],
})

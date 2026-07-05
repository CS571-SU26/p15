import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// base must match the GitHub Pages repo path: https://cs571-su26.github.io/p0/
export default defineConfig({
  base: '/p0/',
  plugins: [react(), tailwindcss()],
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// base must match the GitHub Pages repo path: https://joshkemp4.github.io/CS571Project/
export default defineConfig({
  base: '/CS571Project/',
  plugins: [react(), tailwindcss()],
})

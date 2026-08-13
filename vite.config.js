import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server:{
    port: 5173
  },
  assetsInclude: ['**/*.JPG', '**/*.jpg', '**/*.jpeg', '**/*.JPEG', '**/*.pdf', '**/*.PDF'],
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/prueba/construccion/',
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    port: 8000,
    strictPort: true,
    host: true
  },
  preview: {
    port: 3000  // Cambia por el puerto deseado, ej. 3000 o 8080
  }
})

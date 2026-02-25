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
    port: 3000
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Agrupar librerías grandes por separado
            if (id.includes('lucide-react')) return 'vendor-ui';
            if (id.includes('@supabase')) return 'vendor-supabase';
            if (id.includes('@hello-pangea')) return 'vendor-kanban';
            return 'vendor'; // El resto de node_modules
          }
        }
      }
    }
  }
})

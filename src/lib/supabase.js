import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Faltan las variables de entorno de Supabase. Revisa tu archivo .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'construpro'
  },
  auth: {
    // Esto soluciona el error "NavigatorLockAcquireTimeoutError" en Edge
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'construpro-auth',
    // Desactivamos Navigator Lock para mejorar compatibilidad
    storage: window.localStorage
  }
})

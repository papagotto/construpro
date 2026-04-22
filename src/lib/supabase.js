import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Faltan las variables de entorno de Supabase. Revisa tu archivo .env')
}

// CLIENTE PRINCIPAL: Es el que usas tú para ver proyectos, tareas, etc.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'construpro'
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Cambiamos el nombre de la llave para forzar al navegador a crear un candado nuevo (LockManager)
    // Esto soluciona el NavigatorLockAcquireTimeoutError
    storageKey: 'construpro-auth-v4-fix',
    storage: window.localStorage
  }
})

// CLIENTE DE ADMINISTRACIÓN
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

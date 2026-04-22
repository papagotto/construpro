import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

/**
 * CLIENTE DE ADMINISTRACIÓN SEGURO (Bypass RLS)
 * Este archivo protege la lógica de gestión de identidades (borrar usuarios de auth, invitaciones).
 * NO debe ser modificado por cambios en la UI o el flujo de login estándar.
 */
export const getAdminClient = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Configuración de Service Role no encontrada para operaciones administrativas');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

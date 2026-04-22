import { supabase } from '../lib/supabase';

/**
 * Servicio definitivo para la eliminación de un usuario.
 * Delega la eliminación física de AUTH y la lógica de negocio al RPC del servidor.
 */
export const deleteUserCompletely = async (userId) => {
    try {
        console.log('--- Solicitando eliminación total al servidor ---', userId);
        
        const { data, error } = await supabase.rpc('eliminar_usuario_jerarquico', {
            p_usuario_a_eliminar_id: userId
        });

        if (error) throw error;
        if (data && !data.success) throw new Error(data.error);

        return { success: true, message: data.message };
    } catch (error) {
        console.error('Error en deleteUserCompletely:', error);
        return { success: false, error: error.message };
    }
};

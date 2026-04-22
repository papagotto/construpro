import { supabase } from '../../lib/supabase';

/**
 * Servicios básicos de autenticación con Supabase
 */
export const authServices = {
    login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    },

    logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    resetPassword: async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/#/reset-password`,
        });
        if (error) throw error;
    },

    updatePassword: async (newPassword) => {
        return await supabase.auth.updateUser({ password: newPassword });
    },

    updateProfileData: async (userId, updates) => {
        const { error } = await supabase
            .from('usuarios')
            .update(updates)
            .eq('id', userId);
        if (error) throw error;
    }
};

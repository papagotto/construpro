import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Inicialización rápida
        const initialize = async () => {
            try {
                // Verificación inmediata de sesión
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) throw error;

                if (session) {
                    setUser(session.user);
                    // Cargamos perfil sin esperar (no bloqueante para la UI)
                    fetchProfile(session.user.id);
                }
            } catch (err) {
                console.error('Error inicializando sesión:', err);
            } finally {
                // Liberamos la UI lo antes posible
                setLoading(false);
            }
        };

        initialize();

        // Escuchar cambios (Login/Logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth Event:', event);
            if (session) {
                setUser(session.user);
                fetchProfile(session.user.id);
                setLoading(false); // Liberamos la UI inmediatamente
            } else {
                setUser(null);
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId) => {
        try {
            console.log('Buscando perfil para:', userId);
            const { data, error } = await supabase
                .from('usuarios')
                .select('*, roles(nombre, nivel_acceso)')
                .eq('id', userId)
                .single();

            if (error) {
                console.warn('Perfil no encontrado:', error.message);
                return;
            }
            console.log('Perfil cargado:', data);
            setProfile(data);
        } catch (error) {
            console.error('Error en fetchProfile:', error);
        }
    };

    const login = async (email, password) => {
        // El login de Supabase ya dispara el onAuthStateChange
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    const resetPassword = async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/#/reset-password`,
        });
        if (error) throw error;
    };

    const updatePassword = async (newPassword) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
    };

    const updateProfile = async (updates) => {
        try {
            if (!user) throw new Error('No hay sesión activa');
            
            const { error } = await supabase
                .from('usuarios')
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;

            // Refrescar el perfil localmente
            await fetchProfile(user.id);
            return { success: true };
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, login, logout, resetPassword, updatePassword, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

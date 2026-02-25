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
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    setUser(session.user);
                    // Cargamos perfil sin esperar (no bloqueante)
                    fetchProfile(session.user.id);
                }
            } catch (err) {
                console.error('Error inicializando sesión:', err);
            } finally {
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

    return (
        <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

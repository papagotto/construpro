import React, { createContext, useContext, useState } from 'react';
import { authServices } from '../components/auth/authServices';
import { useProfileLoader } from '../components/auth/useProfileLoader';
import { useAuthObserver } from '../components/auth/useAuthObserver';

const AuthContext = createContext({});

/**
 * AUTH PROVIDER REFACTORIZADO
 * Orquestador principal que utiliza módulos especializados.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Cargador de perfil (maneja fetching y bloqueos)
    const { fetchProfile, lastFetchedId } = useProfileLoader(setProfile);

    // 2. Observador de cambios de estado (maneja sesión y flujos de invitación)
    useAuthObserver(setUser, setProfile, setLoading, fetchProfile, lastFetchedId);

    /**
     * Acciones expuestas al sistema
     */
    const login = async (email, password) => {
        setLoading(true);
        try {
            return await authServices.login(email, password);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await authServices.logout();
        setUser(null);
        setProfile(null);
    };

    const updateProfile = async (updates) => {
        if (!user) throw new Error('No hay sesión activa');
        await authServices.updateProfileData(user.id, updates);
        await fetchProfile(user.id);
        return { success: true };
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            profile, 
            loading, 
            login, 
            logout, 
            resetPassword: authServices.resetPassword, 
            updatePassword: authServices.updatePassword, 
            updateProfile 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

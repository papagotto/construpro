import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest animate-pulse">Verificando Seguridad...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        // EXCEPCIÓN: Si hay un token de acceso en la URL (invitación/recuperación), permitimos el paso
        // para que AuthContext maneje la redirección a la pantalla de contraseña.
        const hasAccessToken = window.location.href.includes('access_token') || 
                               window.location.hash.includes('access_token');
        
        if (hasAccessToken) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest animate-pulse">Procesando Invitación...</p>
                    </div>
                </div>
            );
        }

        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;

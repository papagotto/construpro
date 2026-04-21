import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AuthBranding from '../../components/shared/AuthBranding';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const { resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await resetPassword(email);
            setIsSubmitted(true);
        } catch (err) {
            const errorMessage = err.message || 'No pudimos procesar tu solicitud. Verifica que el correo sea correcto.';
            setError(errorMessage);
            console.error('Error en ForgotPassword:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <AuthBranding subtitle="Recuperación de Acceso" />

                <ForgotPasswordForm 
                    email={email}
                    setEmail={setEmail}
                    isSubmitted={isSubmitted}
                    isLoading={isLoading}
                    error={error}
                    handleSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

export default ForgotPassword;

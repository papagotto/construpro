import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthBranding from '../../components/shared/AuthBranding';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';
import { LucideLoader2 } from 'lucide-react';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const { user, updatePassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!user) {
            setError('Validando sesión de seguridad... Por favor espera un momento y vuelve a intentarlo.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setIsLoading(true);

        try {
            await updatePassword(password);
            setIsSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            console.error('Error al actualizar contraseña:', err);
            setError(err.message || 'No pudimos actualizar tu contraseña. El enlace podría haber expirado.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <AuthBranding subtitle="Nueva Contraseña" />

                {!user ? (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center justify-center space-y-4">
                        <LucideLoader2 className="animate-spin text-primary" size={40} />
                        <p className="text-sm font-black text-slate-500 uppercase tracking-widest text-center">
                            Validando Token de Seguridad...
                        </p>
                        <p className="text-[10px] text-slate-400 text-center max-w-xs uppercase">
                            Estamos estableciendo una conexión segura. Por favor, no cierres esta ventana.
                        </p>
                    </div>
                ) : (
                    <ResetPasswordForm 
                        password={password}
                        setPassword={setPassword}
                        confirmPassword={confirmPassword}
                        setConfirmPassword={setConfirmPassword}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        isSuccess={isSuccess}
                        isLoading={isLoading}
                        error={error}
                        handleSubmit={handleSubmit}
                    />
                )}
            </div>
        </div>
    );
};

export default ResetPassword;

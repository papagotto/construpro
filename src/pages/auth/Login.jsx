import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthBranding from '../../components/shared/AuthBranding';
import LoginForm from '../../components/auth/LoginForm';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirigir al origen después del login o al dashboard por defecto
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);

        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError('Credenciales inválidas. Por favor, revisa tu correo y contraseña.');
            console.error(err);
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <AuthBranding subtitle="Centro de Mando Operativo" />
                
                <LoginForm 
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    error={error}
                    isLoggingIn={isLoggingIn}
                    handleSubmit={handleSubmit}
                />

                <p className="text-center mt-8 text-xs text-slate-400 font-medium">
                    &copy; 2026 ConstruPro. Todos los derechos reservados.<br/>
                    Tecnología de gestión para la ingeniería civil.
                </p>
            </div>
        </div>
    );
};

export default Login;

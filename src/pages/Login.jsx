import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LucideHardHat, LucideMail, LucideLock, LucideAlertCircle, LucideLoader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
                {/* Logo & Branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg shadow-primary/20 mb-4">
                        <LucideHardHat size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">ConstruPro</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Centro de Mando Operativo</p>
                </div>

                {/* Login Card */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Iniciar Sesión</h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300">
                            <LucideAlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
                            <p className="text-xs font-semibold text-red-700 dark:text-red-400 leading-relaxed">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                            <div className="relative">
                                <LucideMail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    required
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="nombre@empresa.com"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
                            <div className="relative">
                                <LucideLock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    required
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20" />
                                <span className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors">Recordarme</span>
                            </label>
                            <button type="button" className="text-xs font-bold text-primary hover:underline">¿Olvidaste tu contraseña?</button>
                        </div>

                        <button 
                            disabled={isLoggingIn}
                            type="submit" 
                            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {isLoggingIn ? (
                                <>
                                    <LucideLoader2 size={18} className="animate-spin" />
                                    Accediendo...
                                </>
                            ) : 'Entrar al Panel'}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-xs text-slate-400 font-medium">
                    &copy; 2026 ConstruPro. Todos los derechos reservados.<br/>
                    Tecnología de gestión para la ingeniería civil.
                </p>
            </div>
        </div>
    );
};

export default Login;

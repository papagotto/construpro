import React from 'react';
import { Link } from 'react-router-dom';
import { LucideMail, LucideLock, LucideAlertCircle, LucideLoader2, LucideEye, LucideEyeOff } from 'lucide-react';

const LoginForm = ({ 
    email, 
    setEmail, 
    password, 
    setPassword, 
    showPassword, 
    setShowPassword, 
    error, 
    isLoggingIn, 
    handleSubmit 
}) => {
    return (
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
                            type={showPassword ? "text" : "password"} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                            title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {showPassword ? <LucideEyeOff size={18} /> : <LucideEye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20" />
                        <span className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors">Recordarme</span>
                    </label>
                    <Link to="/forgot-password" size="sm" className="text-xs font-bold text-primary hover:underline">¿Olvidaste tu contraseña?</Link>
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
    );
};

export default LoginForm;

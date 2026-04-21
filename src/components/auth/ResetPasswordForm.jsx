import React from 'react';
import { Link } from 'react-router-dom';
import { LucideLock, LucideEye, LucideEyeOff, LucideCheckCircle, LucideAlertCircle, LucideLoader2 } from 'lucide-react';

const ResetPasswordForm = ({
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    isSuccess,
    isLoading,
    error,
    handleSubmit
}) => {
    return (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            {!isSuccess ? (
                <>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Crea tu nueva clave</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                        Ingresa una nueva contraseña segura para tu cuenta.
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start gap-3">
                            <LucideAlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
                            <p className="text-xs font-semibold text-red-700 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nueva Contraseña</label>
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
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                >
                                    {showPassword ? <LucideEyeOff size={18} /> : <LucideEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirmar Contraseña</label>
                            <div className="relative">
                                <LucideLock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    required
                                    type={showPassword ? "text" : "password"} 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                                />
                            </div>
                        </div>

                        <button 
                            disabled={isLoading}
                            type="submit" 
                            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <LucideLoader2 size={18} className="animate-spin" />
                                    Actualizando...
                                </>
                            ) : 'Restablecer Contraseña'}
                        </button>
                    </form>
                </>
            ) : (
                <div className="text-center py-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                        <LucideCheckCircle size={24} className="text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">¡Clave Actualizada!</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                        Tu contraseña ha sido cambiada con éxito. Serás redirigido al inicio de sesión en unos segundos...
                    </p>
                    <Link 
                        to="/login"
                        className="inline-flex items-center justify-center w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20"
                    >
                        Ir al Login ahora
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ResetPasswordForm;

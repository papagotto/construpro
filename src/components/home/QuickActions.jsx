import React from 'react';
import { Link } from 'react-router-dom';
import { LucideAlertCircle, LucideCheckCircle2, LucideHardHat } from 'lucide-react';

const QuickActions = () => {
    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h2 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-accent rounded-full"></span>
                    Alertas de Control
                </h2>
                <div className="space-y-4">
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/30 flex gap-3">
                        <LucideAlertCircle className="text-orange-500 shrink-0" size={18} />
                        <div>
                            <p className="text-xs font-bold text-orange-800 dark:text-orange-400">Verificación de Caja</p>
                            <p className="text-[10px] text-orange-700/70 dark:text-orange-400/60 mt-0.5">Existen 3 transacciones pendientes de conciliar.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h2 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                    Acciones Rápidas
                </h2>
                <div className="grid grid-cols-2 gap-3">
                    <Link to="/tareas" className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20">
                        <LucideCheckCircle2 size={20} className="text-primary mb-2" />
                        <p className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300">Mis Tareas</p>
                    </Link>
                    <Link to="/recursos-materiales" className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20">
                        <LucideHardHat size={20} className="text-primary mb-2" />
                        <p className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300">Almacén</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default QuickActions;

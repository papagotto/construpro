import React from 'react';
import { DraftingCompass as LucideArchitecture, LucideClock, LucideUsers } from 'lucide-react';

const ApuStats = ({ recetas }) => {
    const promedioRendimiento = (recetas.reduce((acc, r) => acc + (Number(r.rendimiento_mano_obra) || 0), 0) / (recetas.length || 1)).toFixed(1);
    const rubrosCriticos = recetas.filter(r => (r.personal_minimo || 0) > 2).length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Rubros</p>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{recetas.length}</span>
                    <LucideArchitecture size={24} className="text-primary/20" />
                </div>
            </div>
            <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rendimiento Promedio</p>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-emerald-600">
                        {promedioRendimiento} h/u
                    </span>
                    <LucideClock size={24} className="text-emerald-500/20" />
                </div>
            </div>
            <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mano de Obra Crítica</p>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-amber-600">
                        {rubrosCriticos} rubros
                    </span>
                    <LucideUsers size={24} className="text-amber-500/20" />
                </div>
            </div>
        </div>
    );
};

export default ApuStats;

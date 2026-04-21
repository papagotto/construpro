import React from 'react';
import { LucideSearch } from 'lucide-react';

const ResourceSelector = ({ catalogoRecursos, materialesVinculados, onAdd }) => {
    return (
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">+ Añadir Insumo al Análisis</label>
            <div className="relative">
                <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select 
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                    onChange={(e) => {
                        if (e.target.value) onAdd(e.target.value);
                        e.target.value = '';
                    }}
                >
                    <option value="">Buscar material por nombre o categoría...</option>
                    {catalogoRecursos.filter(r => !materialesVinculados.some(m => m.recurso_id === r.id)).map(r => (
                        <option key={r.id} value={r.id}>{r.nombre_interno} ({r.unidad_base || r.unit_base})</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default ResourceSelector;

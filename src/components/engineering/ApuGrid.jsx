import React from 'react';
import { LucideClock, LucideUsers, LucidePackage, LucideTrash2 } from 'lucide-react';

const ApuGrid = ({ recetas, loading, onEdit, onDelete }) => {
    if (loading) {
        return <div className="col-span-full py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Cargando biblioteca técnica...</div>;
    }

    if (recetas.length === 0) {
        return <div className="col-span-full py-20 text-center text-slate-500 italic">No se encontraron rubros definidos.</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recetas.map((r) => (
                <div key={r.id} className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{r.nombre}</h3>
                            <p className="text-xs text-slate-400 mt-1 uppercase font-black">
                                Unidad: {r.unidades_medida?.simbolo || r.unidad_medida}
                            </p>
                        </div>
                        <button 
                            onClick={() => onDelete(r.id)}
                            className="p-2 text-slate-300 hover:text-red-500 rounded-lg"
                        >
                            <LucideTrash2 size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Rendimiento</p>
                            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                                <LucideClock size={14} className="text-primary" />
                                <span className="text-sm">{r.rendimiento_mano_obra} h/{r.unidades_medida?.simbolo || r.unidad_medida}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Min. Personal</p>
                            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                                <LucideUsers size={14} className="text-amber-500" />
                                <span className="text-sm">{r.personal_minimo} pers.</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Insumos</p>
                            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                                <LucidePackage size={14} className="text-emerald-500" />
                                <span className="text-sm">{r.receta_recursos?.[0]?.count || 0} ítems</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 flex gap-2">
                        <button 
                            onClick={() => onEdit(r.id)}
                            className="flex-1 py-2 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors border border-primary/10"
                        >
                            Editar Fórmulas
                        </button>
                        <button className="px-3 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 rounded-lg">
                            Duplicar
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ApuGrid;

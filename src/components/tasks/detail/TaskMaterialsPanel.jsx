import React from 'react';
import { LucidePackage, LucideBox } from 'lucide-react';

const TaskMaterialsPanel = ({ 
    recetaId, 
    materialesRequeridos, 
    cantidadMedida, 
    unidadMedida 
}) => {
    if (!recetaId) return null;

    return (
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <LucidePackage className="text-emerald-500" size={20} />
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Cómputo de Materiales</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {materialesRequeridos.length === 0 ? (
                    <p className="text-xs text-slate-400 italic col-span-full">No hay materiales vinculados a este rubro.</p>
                ) : (
                    materialesRequeridos.map(m => {
                        const cantidadTotal = (Number(cantidadMedida) || 0) * Number(m.cantidad_por_unidad) * (Number(m.coeficiente_desperdicio) || 1);
                        return (
                            <div key={m.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 rounded-lg">
                                        <LucideBox size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{m.recursos?.nombre_interno}</p>
                                        <p className="text-[10px] text-slate-400 font-black uppercase">Consumo: {m.cantidad_por_unidad} / {unidadMedida}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-900 dark:text-white">{Math.ceil(cantidadTotal * 100) / 100}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{m.recursos?.unit_base}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default TaskMaterialsPanel;

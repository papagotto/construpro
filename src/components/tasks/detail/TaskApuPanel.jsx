import React from 'react';
import { LucideDraftingCompass, LucideClock, LucideAlertTriangle, LucideCheckCircle2 } from 'lucide-react';

const TaskApuPanel = ({ 
    task, 
    editData, 
    isEditing, 
    recetas, 
    onEditDataChange,
    timeEstimates,
    assignmentsCount
}) => {
    const currentTask = isEditing ? editData : task;
    
    return (
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <LucideDraftingCompass className="text-primary" size={20} />
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Análisis de Rubro</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Rubro Maestro (APU)</label>
                    {isEditing ? (
                        <select 
                            className="select-custom !ring-1"
                            value={editData.receta_id || ''}
                            onChange={(e) => {
                                const selectedReceta = recetas.find(r => r.id === e.target.value);
                                onEditDataChange({
                                    ...editData, 
                                    receta_id: e.target.value,
                                    recetas_apu: selectedReceta
                                });
                            }}
                        >
                            <option value="">Seleccionar Rubro...</option>
                            {recetas.map(r => (
                                <option key={r.id} value={r.id}>{r.nombre} ({r.unidad_medida})</option>
                            ))}
                        </select>
                    ) : (
                        <p className="text-sm font-bold text-slate-700 dark:text-white bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                            {task.recetas_apu?.nombre || 'Sin rubro asignado'}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">
                        Cantidad a Ejecutar ({currentTask.recetas_apu?.unidad_medida || 'u'})
                    </label>
                    {isEditing ? (
                        <input 
                            type="number"
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-white outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary/20"
                            value={editData.cantidad_medida || ''}
                            placeholder="0.00"
                            onChange={(e) => onEditDataChange({...editData, cantidad_medida: e.target.value})}
                        />
                    ) : (
                        <p className="text-sm font-bold text-slate-700 dark:text-white bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                            {task.cantidad_medida || '0.00'}
                        </p>
                    )}
                </div>
            </div>

            {timeEstimates && (
                <div className="mt-8 p-6 rounded-2xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <LucideClock size={80} />
                    </div>
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Plazo Estimado</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-primary">{timeEstimates.diasEstimados}</span>
                                <span className="text-lg font-bold text-slate-300">Días Hábiles</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Basado en {timeEstimates.totalHorasHombre} horas-hombre totales.</p>
                        </div>
                        <div className="flex flex-col justify-center">
                            {!timeEstimates.cumpleMinimo && (
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                                    <LucideAlertTriangle size={20} />
                                    <p className="text-xs font-bold">Personal insuficiente: Este rubro requiere mín. {currentTask.recetas_apu?.personal_minimo} personas.</p>
                                </div>
                            )}
                            {timeEstimates.cumpleMinimo && assignmentsCount > 0 && (
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                    <LucideCheckCircle2 size={20} />
                                    <p className="text-xs font-bold">Dotación de equipo óptima.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskApuPanel;

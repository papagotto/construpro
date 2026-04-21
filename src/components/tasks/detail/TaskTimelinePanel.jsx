import React from 'react';
import { LucideCalendar, LucideCheckCircle2 } from 'lucide-react';

const TaskTimelinePanel = ({ 
    task, 
    editData, 
    isEditing, 
    onEditDataChange 
}) => {
    return (
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">Fechas Clave</h3>
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg">
                        <LucideCalendar size={18} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Inicio Estimado</p>
                        {isEditing ? (
                            <input 
                                type="date"
                                className="w-full text-sm font-bold bg-slate-50 dark:bg-slate-800 p-2 rounded-lg outline-none ring-1 ring-primary/10 focus:ring-primary text-slate-700 dark:text-white"
                                value={editData.fecha_inicio_estimada || ''}
                                onChange={(e) => onEditDataChange({...editData, fecha_inicio_estimada: e.target.value })}
                            />
                        ) : (
                            <p className="text-sm font-bold text-slate-700 dark:text-white">{task.fecha_inicio_estimada || 'Pendiente'}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-lg">
                        <LucideCheckCircle2 size={18} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Cierre Estimado</p>
                        {isEditing ? (
                            <input 
                                type="date"
                                className="w-full text-sm font-bold bg-slate-50 dark:bg-slate-800 p-2 rounded-lg outline-none ring-1 ring-primary/10 focus:ring-primary text-slate-700 dark:text-white"
                                value={editData.fecha_fin_estimada || ''}
                                onChange={(e) => onEditDataChange({...editData, fecha_fin_estimada: e.target.value })}
                            />
                        ) : (
                            <p className="text-sm font-bold text-slate-700 dark:text-white">{task.fecha_fin_estimada || 'Pendiente'}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskTimelinePanel;

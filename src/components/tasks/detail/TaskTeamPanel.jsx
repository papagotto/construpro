import React from 'react';
import { LucideUsers, LucideTrash2 } from 'lucide-react';

const TaskTeamPanel = ({ 
    assignments, 
    usuarios, 
    onAddAssignment, 
    onRemoveAssignment 
}) => {
    return (
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <LucideUsers className="text-primary" size={18} />
                    <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Mano de Obra</h3>
                </div>
                <span className="text-xs font-black text-slate-400">{assignments.length} ASIGNADOS</span>
            </div>

            <div className="space-y-3">
                {assignments.map(assign => (
                    <div key={assign.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black">
                                {assign.usuarios?.nombre?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{assign.usuarios?.nombre || 'Usuario'}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">8h / día</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => onRemoveAssignment(assign.id)}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <LucideTrash2 size={16} />
                        </button>
                    </div>
                ))}

                <div className="pt-4">
                    <select 
                        className="select-custom shadow-none border-2 border-dashed !ring-0"
                        onChange={(e) => {
                            if (e.target.value) onAddAssignment(e.target.value);
                            e.target.value = '';
                        }}
                    >
                        <option value="">+ Asignar Integrante</option>
                        {usuarios.filter(u => !assignments.some(a => a.usuario_id === u.id)).map(u => (
                            <option key={u.id} value={u.id}>{u.nombre || u.identificador_usuario}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default TaskTeamPanel;

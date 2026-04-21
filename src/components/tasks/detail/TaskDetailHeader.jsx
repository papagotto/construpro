import React from 'react';
import { LucideChevronLeft, LucideX, LucideSave, LucideLoader2, LucideEdit3 } from 'lucide-react';

const TaskDetailHeader = ({ 
    titulo, 
    isEditing, 
    isSaving, 
    onBack, 
    onCancel, 
    onSave, 
    onEdit, 
    onTitleChange 
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <button 
                    onClick={onBack}
                    className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors mb-2"
                >
                    <LucideChevronLeft size={14} /> Gestión de Tareas
                </button>
                <div className="flex items-center gap-3">
                    {isEditing ? (
                        <input 
                            className="text-3xl font-black text-slate-900 dark:text-white leading-none bg-white dark:bg-slate-800 border-2 border-primary/20 rounded-xl px-2 py-1 w-full outline-none focus:border-primary"
                            value={titulo}
                            onChange={(e) => onTitleChange(e.target.value)}
                            autoFocus
                        />
                    ) : (
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-none">{titulo}</h1>
                    )}
                </div>
            </div>
            <div className="flex gap-3">
                {isEditing ? (
                    <>
                        <button 
                            onClick={onCancel}
                            className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2"
                        >
                            <LucideX size={16} /> Cancelar
                        </button>
                        <button 
                            onClick={onSave}
                            disabled={isSaving}
                            className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? <LucideLoader2 size={16} className="animate-spin" /> : <LucideSave size={16} />}
                            Guardar Cambios
                        </button>
                    </>
                ) : (
                    <button 
                        onClick={onEdit}
                        className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2"
                    >
                        <LucideEdit3 size={16} /> Editar Actividad
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskDetailHeader;

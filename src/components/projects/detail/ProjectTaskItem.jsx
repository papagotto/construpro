import React from 'react';
import { Link } from 'react-router-dom';
import { Draggable } from '@hello-pangea/dnd';
import { LucideTrash2, LucideChevronRight } from 'lucide-react';

const ProjectTaskItem = ({ task, index, activeTaskId, onTaskClick, onDelete }) => {
    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided) => (
                <div 
                    ref={provided.innerRef} 
                    {...provided.draggableProps} 
                    {...provided.dragHandleProps} 
                    className={`flex items-center justify-between p-4 md:p-3 bg-white dark:bg-slate-900 border transition-all group/task cursor-pointer ${activeTaskId === task.id ? 'border-primary ring-1 ring-primary/30 bg-primary/[0.02]' : 'border-slate-50 dark:border-slate-800 md:border-0 md:border-b md:border-slate-100 dark:md:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onTaskClick(task.id);
                    }}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${task.estado === 'finalizada' ? 'bg-emerald-500' : 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]'}`}></div>
                        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                            <span className={`text-xs font-black uppercase tracking-tight ${activeTaskId === task.id ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>{task.titulo}</span>
                            {task.costo_presupuestado > 0 && (
                                <span className="hidden md:block text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase">
                                    ${Number(task.costo_presupuestado).toLocaleString()}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} 
                            className="opacity-0 group-hover/task:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"
                        >
                            <LucideTrash2 size={14} />
                        </button>
                        <Link 
                            to={`/tareas/${task.id}`} 
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 bg-slate-50 dark:bg-slate-800 md:bg-transparent text-slate-400 rounded-xl hover:text-primary hover:bg-primary/5 transition-all"
                        >
                            <LucideChevronRight size={16} />
                        </Link>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default ProjectTaskItem;

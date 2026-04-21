import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

const TaskKanbanCard = ({ task, index, onTaskClick }) => {
    return (
        <Draggable draggableId={task.id.toString()} index={index}>
            {(provided, snapshot) => (
                <div 
                    ref={provided.innerRef} 
                    {...provided.draggableProps} 
                    {...provided.dragHandleProps} 
                    className={`bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group ${snapshot.isDragging ? 'shadow-xl border-primary ring-2 ring-primary/10 rotate-2' : 'border-slate-200 dark:border-slate-700'}`} 
                    onClick={() => onTaskClick(task.id)}
                >
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{task.projectCode}</span>
                        <span className={`${task.priorityColor} text-[9px] px-2 py-0.5 rounded font-bold uppercase`}>{task.priority}</span>
                    </div>
                    <h4 className="text-sm font-bold mb-2 group-hover:text-primary transition-colors text-slate-900 dark:text-white">{task.title}</h4>
                    <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-between">
                        <div className={`flex items-center gap-1 ${task.dateColor}`}>
                            <span className="material-icons text-xs">schedule</span>
                            <span className="text-[11px] font-semibold">{task.date}</span>
                        </div>
                        <img src={task.avatar} alt="User" className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" />
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default TaskKanbanCard;

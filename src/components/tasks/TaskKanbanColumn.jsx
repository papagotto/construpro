import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskKanbanCard from './TaskKanbanCard';

const TaskKanbanColumn = ({ 
    column, 
    tasks, 
    expandedSections, 
    toggleSection, 
    onTaskClick,
    isMobile
}) => {
    if (isMobile) {
        return (
            <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className={`p-4 flex items-center justify-between cursor-pointer border-l-4 ${column.color}`} onClick={() => toggleSection(column.id)}>
                    <div className="flex items-center gap-3">
                        <span className={`material-icons transition-transform duration-200 text-slate-400 ${expandedSections[column.id] ? 'rotate-180' : ''}`}>expand_more</span>
                        <h3 className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide text-xs">{column.title}</h3>
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-bold">{column.count}</span>
                    </div>
                </div>
                {expandedSections[column.id] && (
                    <Droppable droppableId={column.id}>
                        {(provided, snapshot) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className={`p-2 pt-0 space-y-2 border-t border-slate-100 dark:border-slate-800/50 min-h-[50px] transition-colors ${snapshot.isDraggingOver ? 'bg-slate-50 dark:bg-slate-800/20' : ''}`}>
                                {tasks.map((task, index) => (
                                    <TaskKanbanCard key={task.id} task={task} index={index} onTaskClick={onTaskClick} />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                )}
            </div>
        );
    }

    return (
        <div className="w-80 flex-shrink-0 flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/30 dark:bg-slate-900/20">
            <div className={`p-4 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 border-t-4 ${column.color}`}>
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wider">{column.title}</h3>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold">{column.count}</span>
                </div>
            </div>
            <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className={`flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50/20 dark:bg-blue-900/10' : ''}`}>
                        {tasks.map((task, index) => (
                            <TaskKanbanCard key={task.id} task={task} index={index} onTaskClick={onTaskClick} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default TaskKanbanColumn;

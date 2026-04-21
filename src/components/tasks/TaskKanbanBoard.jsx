import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import TaskKanbanColumn from './TaskKanbanColumn';

const TaskKanbanBoard = ({ 
    columns, 
    tasks, 
    expandedSections, 
    toggleSection, 
    onDragEnd, 
    onTaskClick,
    isMobile 
}) => {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className={`flex-1 ${isMobile ? 'space-y-3 px-4 pb-10 overflow-y-auto' : 'flex gap-6 overflow-x-auto pb-6'} custom-scrollbar`}>
                {columns.map((column) => (
                    <TaskKanbanColumn 
                        key={column.id}
                        column={column}
                        tasks={tasks[column.id]}
                        expandedSections={expandedSections}
                        toggleSection={toggleSection}
                        onTaskClick={onTaskClick}
                        isMobile={isMobile}
                    />
                ))}
            </div>
        </DragDropContext>
    );
};

export default TaskKanbanBoard;

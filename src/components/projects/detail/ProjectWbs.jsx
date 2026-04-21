import React from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { LucideLayers, LucidePlus, LucideX } from 'lucide-react';
import ProjectStage from './ProjectStage';

const ProjectWbs = ({ 
    project, 
    expandedStageId, 
    activeStageId, 
    activeRubroId, 
    activeTaskId, 
    showNewStageInput, 
    newStageName, 
    setNewStageName, 
    showNewRubroForm, 
    newRubroName, 
    setNewRubroName, 
    showTaskForm, 
    newTask, 
    setNewTask, 
    apus,
    onDragEnd, 
    onAddStage, 
    onShowNewStageInput, 
    onHideNewStageInput,
    onStageClick, 
    onDeleteStage, 
    onShowNewRubroForm, 
    onHideNewRubroForm, 
    onAddRubro,
    onRubroClick,
    onDeleteRubro,
    onShowTaskForm,
    onHideTaskForm,
    onAddTask,
    onTaskClick,
    onDeleteTask
}) => {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/30">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                            <LucideLayers size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">WBS del Proyecto</h2>
                            <p className="text-xs text-slate-500 font-medium">Arrastra para reordenar la obra.</p>
                        </div>
                    </div>
                    <button onClick={onShowNewStageInput} className="px-4 py-2 bg-slate-900 dark:bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
                        <LucidePlus size={14} /> Añadir Etapa
                    </button>
                </div>

                <Droppable droppableId="stages" type="stage">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="p-8 space-y-8">
                            {showNewStageInput && (
                                <div className="p-6 bg-primary/5 rounded-3xl border-2 border-dashed border-primary/20 flex gap-4 animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
                                    <input autoFocus value={newStageName} onChange={(e) => setNewStageName(e.target.value)} placeholder="Nombre de la nueva fase..." className="flex-1 bg-white dark:bg-slate-800 border-none rounded-2xl px-6 text-sm font-bold shadow-sm focus:ring-2 ring-primary/20 outline-none dark:text-white" />
                                    <button onClick={onAddStage} className="bg-primary text-white px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest">Crear Fase</button>
                                    <button onClick={onHideNewStageInput} className="text-slate-400 p-3 hover:text-slate-600 transition-colors"><LucideX size={24} /></button>
                                </div>
                            )}

                            {project.stages.map((stage, index) => (
                                <ProjectStage 
                                    key={stage.id}
                                    stage={stage}
                                    index={index}
                                    expandedStageId={expandedStageId}
                                    activeStageId={activeStageId}
                                    activeRubroId={activeRubroId}
                                    activeTaskId={activeTaskId}
                                    showNewRubroForm={showNewRubroForm}
                                    newRubroName={newRubroName}
                                    setNewRubroName={setNewRubroName}
                                    showTaskForm={showTaskForm}
                                    newTask={newTask}
                                    setNewTask={setNewTask}
                                    apus={apus}
                                    onStageClick={onStageClick}
                                    onDeleteStage={onDeleteStage}
                                    onShowNewRubroForm={onShowNewRubroForm}
                                    onHideNewRubroForm={onHideNewRubroForm}
                                    onAddRubro={onAddRubro}
                                    onRubroClick={onRubroClick}
                                    onDeleteRubro={onDeleteRubro}
                                    onShowTaskForm={onShowTaskForm}
                                    onHideTaskForm={onHideTaskForm}
                                    onAddTask={onAddTask}
                                    onTaskClick={onTaskClick}
                                    onDeleteTask={onDeleteTask}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
};

export default ProjectWbs;

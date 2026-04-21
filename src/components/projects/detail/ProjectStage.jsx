import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { LucideGripVertical, LucideFolderKanban, LucideTrash2, LucideChevronRight } from 'lucide-react';
import ProjectRubro from './ProjectRubro';

const ProjectStage = ({ 
    stage, 
    index, 
    expandedStageId, 
    activeStageId, 
    activeRubroId, 
    activeTaskId, 
    showNewRubroForm, 
    newRubroName, 
    setNewRubroName, 
    showTaskForm, 
    newTask, 
    setNewTask, 
    apus,
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
        <Draggable draggableId={stage.id} index={index}>
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps} className={`group ${snapshot.isDragging ? 'z-50' : ''}`}>
                    <div 
                        className={`p-6 rounded-[24px] cursor-pointer transition-all flex items-center justify-between ${activeStageId === stage.id ? 'bg-slate-900 text-white shadow-2xl scale-[1.02]' : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white'}`} 
                        onClick={() => onStageClick(stage.id)}
                    >
                        <div className="flex items-center gap-4">
                            <div {...provided.dragHandleProps} className="p-2 hover:bg-white/10 rounded-lg cursor-grab active:cursor-grabbing">
                                <LucideGripVertical size={18} className="text-slate-400" />
                            </div>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${activeStageId === stage.id ? 'bg-white/10' : 'bg-white dark:bg-slate-900 shadow-sm text-primary'}`}>
                                <LucideFolderKanban size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black tracking-tight">{stage.nombre}</h3>
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${activeStageId === stage.id ? 'text-white/40' : 'text-slate-400'}`}>{stage.rubros.length} Rubros activos</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={(e) => onDeleteStage(e, stage.id)} className={`p-2 rounded-xl transition-all ${activeStageId === stage.id ? 'hover:bg-red-500 text-white/40 hover:text-white' : 'hover:bg-red-50 text-slate-200 hover:text-red-500'}`}>
                                <LucideTrash2 size={18} />
                            </button>
                            <LucideChevronRight size={24} className={`transition-transform duration-300 ${expandedStageId === stage.id ? 'rotate-90 opacity-100' : 'opacity-20'}`} />
                        </div>
                    </div>

                    {expandedStageId === stage.id && (
                        <div className="mt-4 ml-6 pl-8 border-l-2 border-slate-100 dark:border-slate-800 space-y-6 animate-in slide-in-from-left-4 duration-500">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Agrupadores de Obra</span>
                                <button onClick={(e) => { e.stopPropagation(); onShowNewRubroForm(stage.id); }} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">+ Nuevo Rubro</button>
                            </div>

                            {showNewRubroForm === stage.id && (
                                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex gap-3 mb-6" onClick={(e) => e.stopPropagation()}>
                                    <input autoFocus value={newRubroName} onChange={(e) => setNewRubroName(e.target.value)} placeholder="Ej: Mampostería de Elevación" className="flex-1 text-sm font-bold outline-none bg-transparent dark:text-white" />
                                    <button onClick={() => onAddRubro(stage.id)} className="text-primary font-black text-[10px] uppercase">Guardar</button>
                                    <button onClick={onHideNewRubroForm} className="text-slate-300"><LucideX size={16} /></button>
                                </div>
                            )}

                            <Droppable droppableId={stage.id} type="rubro">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                        {stage.rubros.map((rubro, idx) => (
                                            <ProjectRubro 
                                                key={rubro.id}
                                                rubro={rubro}
                                                index={idx}
                                                activeRubroId={activeRubroId}
                                                activeTaskId={activeTaskId}
                                                showTaskForm={showTaskForm}
                                                newTask={newTask}
                                                setNewTask={setNewTask}
                                                apus={apus}
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
                    )}
                </div>
            )}
        </Draggable>
    );
};

export default ProjectStage;

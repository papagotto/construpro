import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { LucideGripVertical, LucideTrello, LucideTrash2, LucidePlus, LucideX, LucideSave } from 'lucide-react';
import ProjectTaskItem from './ProjectTaskItem';

const ProjectRubro = ({ 
    rubro, 
    index, 
    activeRubroId, 
    activeTaskId, 
    showTaskForm, 
    newTask, 
    setNewTask, 
    apus,
    onRubroClick, 
    onDeleteRubro, 
    onShowTaskForm, 
    onHideTaskForm, 
    onAddTask,
    onTaskClick,
    onDeleteTask
}) => {
    return (
        <Draggable draggableId={rubro.id} index={index}>
            {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} className="group/rubro">
                    <div 
                        className={`bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 p-6 shadow-sm transition-all cursor-pointer hover:border-primary/30 ${activeRubroId === rubro.id ? 'ring-2 ring-primary bg-primary/[0.02] border-primary/20' : ''}`} 
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            onRubroClick(rubro.id);
                        }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div {...provided.dragHandleProps} className="p-1 cursor-grab active:cursor-grabbing hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                                    <LucideGripVertical size={14} className="text-slate-300" />
                                </div>
                                <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-lg">
                                    <LucideTrello size={16} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-800 dark:text-white tracking-tight uppercase text-sm">{rubro.nombre}</h4>
                                    {activeRubroId === rubro.id && <span className="text-[8px] font-black text-primary uppercase tracking-widest">Seleccionado para Cómputo</span>}
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); onDeleteRubro(e, rubro.id); }} className="opacity-0 group-hover/rubro:opacity-100 p-1.5 text-slate-300 hover:text-red-500 transition-all">
                                    <LucideTrash2 size={14} />
                                </button>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-slate-400 uppercase">Presupuesto</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">${(rubro.tasks?.reduce((s, t) => s + Number(t.costo_presupuestado || 0), 0) || 0).toLocaleString()}</p>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); onShowTaskForm(rubro.id); }} className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors">
                                    <LucidePlus size={16} />
                                </button>
                            </div>
                        </div>

                        {showTaskForm === rubro.id && (
                            <div className="mb-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-emerald-200 dark:border-emerald-900/30 animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
                                <div className="flex justify-between items-center mb-4">
                                    <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Nueva Tarea en {rubro.nombre}</h5>
                                    <button onClick={onHideTaskForm} className="text-slate-400 hover:text-slate-600"><LucideX size={20} /></button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="col-span-full lg:col-span-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block ml-1">Título de Actividad</label>
                                        <input autoFocus value={newTask.titulo} onChange={(e) => setNewTask({...newTask, titulo: e.target.value})} placeholder="Ej: Elevación de muros" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm focus:ring-2 ring-emerald-500/20 outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block ml-1">Tipo de Tarea</label>
                                        <select value={newTask.tipo_tarea} onChange={(e) => setNewTask({...newTask, tipo_tarea: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm focus:ring-2 ring-emerald-500/20 outline-none">
                                            <option value="albañileria">🧱 Albañilería</option>
                                            <option value="instalaciones">🔌 Instalaciones</option>
                                        </select>
                                    </div>

                                    {newTask.tipo_tarea === 'albañileria' && (
                                        <>
                                            <div>
                                                <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block ml-1">Análisis (APU)</label>
                                                <select value={newTask.receta_id} onChange={(e) => setNewTask({...newTask, receta_id: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm focus:ring-2 ring-emerald-500/20 outline-none">
                                                    <option value="">Seleccionar Maestro...</option>
                                                    {apus.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block ml-1">Cantidad</label>
                                                <input type="number" value={newTask.cantidad_medida} onChange={(e) => setNewTask({...newTask, cantidad_medida: e.target.value})} placeholder="0.00" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm focus:ring-2 ring-emerald-500/20 outline-none" />
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block ml-1">Presupuesto ($)</label>
                                        <input type="number" value={newTask.costo_presupuestado} onChange={(e) => setNewTask({...newTask, costo_presupuestado: e.target.value})} placeholder="0.00" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm focus:ring-2 ring-emerald-500/20 outline-none" />
                                    </div>

                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block ml-1">Método de Medición</label>
                                        <select 
                                            value={newTask.metodo_medicion} 
                                            onChange={(e) => setNewTask({...newTask, metodo_medicion: e.target.value})} 
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm focus:ring-2 ring-emerald-500/20 outline-none"
                                        >
                                            <option value="cuantitativo">Estándar (Cantidades)</option>
                                            <option value="distribucion">Distribución (Lineal/ml)</option>
                                            <option value="puntos">Por Puntos (Bocas)</option>
                                            <option value="hitos_ponderados">Hitos Técnicos (%)</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block ml-1">Inicio</label>
                                            <input type="date" value={newTask.fecha_inicio_estimada} onChange={(e) => setNewTask({...newTask, fecha_inicio_estimada: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold" />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block ml-1">Fin Est.</label>
                                            <input type="date" value={newTask.fecha_fin_estimada} onChange={(e) => setNewTask({...newTask, fecha_fin_estimada: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end gap-3">
                                    <button onClick={(e) => { e.stopPropagation(); onAddTask(rubro.id); }} className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center gap-2">
                                        <LucideSave size={14} /> Confirmar Tarea
                                    </button>
                                </div>
                            </div>
                        )}

                        <Droppable droppableId={rubro.id} type="task">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-2 md:gap-0" onClick={(e) => e.stopPropagation()}>
                                    {rubro.tasks.map((task, tIdx) => (
                                        <ProjectTaskItem 
                                            key={task.id} 
                                            task={task} 
                                            index={tIdx} 
                                            activeTaskId={activeTaskId} 
                                            onTaskClick={onTaskClick}
                                            onDelete={onDeleteTask}
                                        />
                                    ))}
                                    {provided.placeholder}
                                    {rubro.tasks.length === 0 && (
                                        <div className="py-8 text-center border border-dashed border-slate-100 dark:border-slate-800 rounded-3xl md:rounded-none md:border-0 md:border-b">
                                            <p className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">No hay tareas planificadas aún</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default ProjectRubro;

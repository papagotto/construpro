import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../lib/supabase';

// Hook personalizado para detectar vista móvil
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
};

const Tasks = () => {
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState({
        pendiente: [],
        enProceso: [],
        enRevision: [],
        finalizada: []
    });
    
    const [expandedSections, setExpandedSections] = useState({
        pendiente: true,
        enProceso: true,
        enRevision: true,
        finalizada: false
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('tareas')
                .select(`
                    *,
                    etapas (
                        proyectos (
                            nombre
                        )
                    )
                `)
                .eq('is_deleted', false);

            if (error) throw error;

            const grouped = {
                pendiente: [],
                enProceso: [],
                enRevision: [],
                finalizada: []
            };

            data.forEach(task => {
                const mappedTask = {
                    id: task.id,
                    title: task.titulo || 'Sin título',
                    projectCode: task.etapas?.proyectos?.nombre || 'General',
                    status: task.estado === 'en_proceso' ? 'enProceso' : 
                            task.estado === 'en_revision' ? 'enRevision' : task.estado,
                    priority: task.prioridad ? task.prioridad.charAt(0).toUpperCase() + task.prioridad.slice(1) : 'Media',
                    priorityColor: task.prioridad === 'urgente' ? 'bg-red-100 text-red-600' :
                                  task.prioridad === 'alta' ? 'bg-amber-100 text-amber-600' :
                                  'bg-slate-100 text-slate-600',
                    date: task.fecha_fin_estimada ? new Date(task.fecha_fin_estimada).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : 'Sin fecha',
                    dateColor: 'text-slate-500',
                    avatar: 'https://ui-avatars.com/api/?name=' + (task.titulo || 'T') + '&background=random'
                };

                const statusKey = mappedTask.status === 'enProceso' ? 'enProceso' : 
                                 mappedTask.status === 'enRevision' ? 'enRevision' : mappedTask.status;
                
                if (grouped[statusKey]) {
                    grouped[statusKey].push(mappedTask);
                } else {
                    grouped.pendiente.push(mappedTask);
                }
            });

            setTasks(grouped);
        } catch (error) {
            console.error('Error cargando tareas:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        const dbStatus = newStatus === 'enProceso' ? 'en_proceso' : 
                        newStatus === 'enRevision' ? 'en_revision' : newStatus;
        
        const { error } = await supabase
            .from('tareas')
            .update({ estado: dbStatus })
            .eq('id', taskId);

        if (error) {
            console.error('Error actualizando estado:', error.message);
            fetchTasks(); // Revertir cambios en UI si falla
        }
    };

    const toggleSection = (id) => {
        setExpandedSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination || 
            (source.droppableId === destination.droppableId && source.index === destination.index)) {
            return;
        }

        const sourceCol = source.droppableId;
        const destCol = destination.droppableId;

        const newTasks = { ...tasks };
        const sourceList = [...newTasks[sourceCol]];
        const [movedTask] = sourceList.splice(source.index, 1);

        if (sourceCol === destCol) {
            sourceList.splice(destination.index, 0, movedTask);
            newTasks[sourceCol] = sourceList;
        } else {
            const destList = [...newTasks[destCol]];
            const updatedTask = { ...movedTask, status: destCol };
            destList.splice(destination.index, 0, updatedTask);
            newTasks[sourceCol] = sourceList;
            newTasks[destCol] = destList;
            
            updateTaskStatus(movedTask.id, destCol);
        }

        setTasks(newTasks);
    };

    const columns = [
        { id: 'pendiente', title: 'Pendiente', count: tasks.pendiente.length, color: 'border-slate-300', bgColor: 'bg-slate-50/50' },
        { id: 'enProceso', title: 'En Proceso', count: tasks.enProceso.length, color: 'border-blue-400', bgColor: 'bg-blue-50/30' },
        { id: 'enRevision', title: 'En Revisión', count: tasks.enRevision.length, color: 'border-amber-400', bgColor: 'bg-amber-50/30' },
        { id: 'finalizada', title: 'Finalizada', count: tasks.finalizada.length, color: 'border-emerald-400', bgColor: 'bg-emerald-50/30' }
    ];

    if (loading) return <div className="flex-1 flex items-center justify-center">Cargando tablero...</div>;

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 lg:px-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gestor de Tareas</h1>
                    <p className="text-slate-500 text-sm">Control de avance y asignación de actividades.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-all shadow-sm">
                        <span className="material-icons text-sm mr-2">add</span>
                        Nueva Tarea
                    </button>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                {isMobile && (
                    <div className="flex-1 space-y-3 px-4 pb-10 overflow-y-auto custom-scrollbar">
                        {columns.map((column) => (
                            <div key={column.id} className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
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
                                                {tasks[column.id].map((task, index) => (
                                                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`bg-white dark:bg-slate-800/50 p-3 rounded-lg border flex flex-col gap-2 transition-shadow ${snapshot.isDragging ? 'shadow-lg border-primary/50' : 'border-slate-100 dark:border-slate-700/50'}`} onClick={() => navigate(`/tareas/${task.id}`)}>
                                                                <div className="flex justify-between items-start">
                                                                    <span className="text-[9px] font-bold text-slate-400 uppercase">{task.projectCode}</span>
                                                                    <span className={`${task.priorityColor} text-[8px] px-1.5 py-0.5 rounded font-bold uppercase`}>{task.priority}</span>
                                                                </div>
                                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{task.title}</h4>
                                                                <div className="flex items-center justify-between mt-1">
                                                                    <div className="flex items-center gap-1 text-[10px] text-slate-500"><span className="material-icons text-xs">event</span>{task.date}</div>
                                                                    <img src={task.avatar} className="w-5 h-5 rounded-full" alt="" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {!isMobile && (
                    <div className="flex flex-1 gap-6 overflow-x-auto pb-6 custom-scrollbar min-h-0">
                        {columns.map((column) => (
                            <div key={column.id} className="w-80 flex-shrink-0 flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/30 dark:bg-slate-900/20">
                                <div className={`p-4 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 border-t-4 ${column.color}`}>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wider">{column.title}</h3>
                                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold">{column.count}</span>
                                    </div>
                                </div>
                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef} className={`flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50/20 dark:bg-blue-900/10' : ''}`}>
                                            {tasks[column.id].map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group ${snapshot.isDragging ? 'shadow-xl border-primary ring-2 ring-primary/10 rotate-2' : 'border-slate-200 dark:border-slate-700'}`} onClick={() => navigate(`/tareas/${task.id}`)}>
                                                            <div className="flex justify-between items-start mb-3">
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{task.projectCode}</span>
                                                                <span className={`${task.priorityColor} text-[9px] px-2 py-0.5 rounded font-bold uppercase`}>{task.priority}</span>
                                                            </div>
                                                            <h4 className="text-sm font-bold mb-2 group-hover:text-primary transition-colors text-slate-900 dark:text-white">{task.title}</h4>
                                                            <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-between">
                                                                <div className={`flex items-center gap-1 ${task.dateColor}`}><span className="material-icons text-xs">schedule</span><span className="text-[11px] font-semibold">{task.date}</span></div>
                                                                <img src={task.avatar} alt="User" className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                )}
            </DragDropContext>
        </div>
    );
};

export default Tasks;

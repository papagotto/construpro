import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import TaskKanbanBoard from '../../components/tasks/TaskKanbanBoard';

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
    const [tasks, setTasks] = useState({ pendiente: [], enProceso: [], enRevision: [], finalizada: [] });
    const [expandedSections, setExpandedSections] = useState({ pendiente: true, enProceso: true, enRevision: true, finalizada: false });

    useEffect(() => { fetchTasks(); }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('tareas').select(`*, etapas (proyectos (nombre))`).eq('is_deleted', false);
            if (error) throw error;
            const grouped = { pendiente: [], enProceso: [], enRevision: [], finalizada: [] };
            data.forEach(task => {
                const mappedTask = {
                    id: task.id, title: task.titulo || 'Sin título', projectCode: task.etapas?.proyectos?.nombre || 'General',
                    status: task.estado === 'en_proceso' ? 'enProceso' : task.estado === 'en_revision' ? 'enRevision' : task.estado,
                    priority: task.prioridad ? task.prioridad.charAt(0).toUpperCase() + task.prioridad.slice(1) : 'Media',
                    priorityColor: task.prioridad === 'urgente' ? 'bg-red-100 text-red-600' : task.prioridad === 'alta' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600',
                    date: task.fecha_fin_estimada ? new Date(task.fecha_fin_estimada).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : 'Sin fecha',
                    dateColor: 'text-slate-500', avatar: 'https://ui-avatars.com/api/?name=' + (task.titulo || 'T') + '&background=random'
                };
                const statusKey = mappedTask.status === 'enProceso' ? 'enProceso' : mappedTask.status === 'enRevision' ? 'enRevision' : mappedTask.status;
                if (grouped[statusKey]) grouped[statusKey].push(mappedTask); else grouped.pendiente.push(mappedTask);
            });
            setTasks(grouped);
        } catch (error) { console.error('Error cargando tareas:', error.message); } finally { setLoading(false); }
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        const dbStatus = newStatus === 'enProceso' ? 'en_proceso' : newStatus === 'enRevision' ? 'en_revision' : newStatus;
        const { error } = await supabase.from('tareas').update({ estado: dbStatus }).eq('id', taskId);
        if (error) { console.error('Error actualizando estado:', error.message); fetchTasks(); }
    };

    const toggleSection = (id) => { setExpandedSections(prev => ({ ...prev, [id]: !prev[id] })); };

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;
        const sourceCol = source.droppableId, destCol = destination.droppableId;
        const newTasks = { ...tasks }, sourceList = [...newTasks[sourceCol]], [movedTask] = sourceList.splice(source.index, 1);
        if (sourceCol === destCol) { sourceList.splice(destination.index, 0, movedTask); newTasks[sourceCol] = sourceList; } 
        else { const destList = [...newTasks[destCol]]; const updatedTask = { ...movedTask, status: destCol }; destList.splice(destination.index, 0, updatedTask); newTasks[sourceCol] = sourceList; newTasks[destCol] = destList; updateTaskStatus(movedTask.id, destCol); }
        setTasks(newTasks);
    };

    const columns = [
        { id: 'pendiente', title: 'Pendiente', count: tasks.pendiente.length, color: 'border-slate-300' },
        { id: 'enProceso', title: 'En Proceso', count: tasks.enProceso.length, color: 'border-blue-400' },
        { id: 'enRevision', title: 'En Revisión', count: tasks.enRevision.length, color: 'border-amber-400' },
        { id: 'finalizada', title: 'Finalizada', count: tasks.finalizada.length, color: 'border-emerald-400' }
    ];

    if (loading) return <div className="flex-1 flex items-center justify-center font-black text-slate-400 uppercase tracking-widest text-xs">Cargando tablero...</div>;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 lg:px-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Gestor de Tareas</h1>
                    <p className="text-slate-500 text-sm">Control de avance y asignación de actividades.</p>
                </div>
                <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center transition-all shadow-lg shadow-primary/20">
                    <span className="material-icons text-sm mr-2">add</span> Nueva Tarea
                </button>
            </div>

            <TaskKanbanBoard 
                columns={columns}
                tasks={tasks}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                onDragEnd={onDragEnd}
                onTaskClick={(id) => navigate(`/tareas/${id}`)}
                isMobile={isMobile}
            />
        </div>
    );
};

export default Tasks;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
    LucideClipboardList, LucideUser, LucidePackage, LucideClock, 
    LucideCheckCircle2, LucideSend, LucideImage, LucideAlertTriangle
} from 'lucide-react';

const TaskDetail = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setLoadingSaving] = useState(false);

    useEffect(() => {
        fetchTaskData();
    }, [id]);

    const fetchTaskData = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('tareas')
                .select(`
                    *,
                    etapas (
                        nombre,
                        proyectos (
                            nombre
                        )
                    )
                `)
                .eq('id', id)
                .single();

            if (error) throw error;

            setTask({
                ...data,
                projectName: data.etapas?.proyectos?.nombre || 'General',
                stageName: data.etapas?.nombre || 'S/D',
                priorityColor: data.prioridad === 'urgente' ? 'bg-red-100 text-red-600' :
                              data.prioridad === 'alta' ? 'bg-amber-100 text-amber-600' :
                              'bg-slate-100 text-slate-600'
            });
        } catch (error) {
            console.error('Error cargando detalle de tarea:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTask = async (updates) => {
        try {
            setLoadingSaving(true);
            const { error } = await supabase
                .from('tareas')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            fetchTaskData();
        } catch (error) {
            console.error('Error actualizando tarea:', error.message);
        } finally {
            setLoadingSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center uppercase tracking-widest text-xs font-bold text-slate-500">Cargando detalles de actividad...</div>;
    if (!task) return <div className="p-8 text-center text-slate-500">Tarea no encontrada.</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <nav className="flex mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <Link to="/tareas" className="hover:text-primary transition-colors">Tareas</Link>
                        <span className="mx-2">/</span>
                        <span className="text-slate-400">{task.projectName}</span>
                        <span className="mx-2">/</span>
                        <span className="text-primary truncate max-w-[200px]">{task.titulo}</span>
                    </nav>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{task.titulo}</h1>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${task.priorityColor}`}>
                            {task.prioridad || 'Media'}
                        </span>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
                            {task.estado?.replace('_', ' ') || 'Pendiente'}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                        Adjuntar Evidencia
                    </button>
                    {task.estado !== 'finalizada' && (
                        <button 
                            onClick={() => handleUpdateTask({ estado: 'finalizada', avance_fisico_pct: 100 })}
                            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm transition-all"
                        >
                            Completar Tarea
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* General Info */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Información de la Tarea</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Descripción</label>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                    {task.descripcion || 'Sin descripción detallada.'}
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Presupuesto Asignado</label>
                                    <p className="text-lg font-black text-emerald-600">${Number(task.costo_presupuestado || 0).toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Avance Físico</label>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                            <div className="bg-primary h-full rounded-full" style={{ width: `${task.avance_fisico_pct}%` }}></div>
                                        </div>
                                        <span className="text-xs font-bold text-slate-600">{task.avance_fisico_pct}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bitácora / Comments placeholder */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">Bitácora de Obra</h3>
                        <p className="text-sm text-slate-400 italic text-center py-4">Sistema de bitácora en tiempo real próximamente.</p>
                        <div className="mt-4 flex gap-3">
                            <input disabled type="text" placeholder="Función en desarrollo..." className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-4 py-2 text-sm opacity-50" />
                            <button disabled className="p-2 bg-slate-300 text-white rounded-lg"><LucideSend size={18} /></button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Timeline */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Cronograma</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                                <LucideClock className="text-blue-500" size={20} />
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-black">Inicio Estimado</p>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                        {task.fecha_inicio_estimada ? new Date(task.fecha_inicio_estimada).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : 'No definida'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                                <LucideCheckCircle2 className="text-emerald-500" size={20} />
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-black">Finalización Límite</p>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                        {task.fecha_fin_estimada ? new Date(task.fecha_fin_estimada).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : 'No definida'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personnel Assigned Placeholder */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Personal Asignado</h3>
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                            <LucideUser className="text-slate-300" size={20} />
                            <p className="text-xs text-slate-400">Sin personal asignado directamente.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;

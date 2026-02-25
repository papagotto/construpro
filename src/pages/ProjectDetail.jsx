import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import MaterialCalculator from '../components/MaterialCalculator';
import { 
    LucideLayers, LucidePlus, LucideCalculator, LucideCheckCircle2, 
    LucideClock, LucideAlertTriangle, LucideChevronRight, LucidePackage,
    LucideClipboardList, LucideUser
} from 'lucide-react';

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeStageId, setActiveStageId] = useState(null);
    const [showCalculator, setShowCalculator] = useState(false);
    const [showNewStageInput, setShowNewStageInput] = useState(false);
    const [newStageName, setNewStageName] = useState('');
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    useEffect(() => {
        fetchProjectData();
    }, [id]);

    const fetchProjectData = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('proyectos')
                .select(`
                    *,
                    etapas (
                        *,
                        tareas (*)
                    )
                `)
                .eq('id', id)
                .single();

            if (error) throw error;

            // Calcular métricas del proyecto basadas en sus tareas
            let totalProgress = 0;
            let totalSpentProgress = 0;
            let totalTasks = 0;
            let pendingTasksCount = 0;

            data.etapas?.forEach(etapa => {
                etapa.tareas?.forEach(tarea => {
                    totalProgress += Number(tarea.avance_fisico_pct || 0);
                    totalSpentProgress += Number(tarea.avance_financiero_materiales_pct || 0);
                    totalTasks++;
                    if (tarea.estado !== 'finalizada') {
                        pendingTasksCount++;
                    }
                });
            });

            const avgProgress = totalTasks > 0 ? Math.round(totalProgress / totalTasks) : 0;
            const avgSpentProgress = totalTasks > 0 ? (totalSpentProgress / totalTasks) : 0;
            const realSpent = (Number(data.presupuesto || 0) * avgSpentProgress) / 100;

            // Mapear al formato esperado por la UI
            const mappedProject = {
                id: data.id,
                name: data.nombre,
                client: data.cliente,
                budget: Number(data.presupuesto || 0),
                spent: realSpent,
                progress: avgProgress,
                startDate: new Date(data.fecha_inicio).toLocaleDateString('es-ES'),
                endDate: data.fecha_fin ? new Date(data.fecha_fin).toLocaleDateString('es-ES') : 'Pendiente',
                daysLeft: data.fecha_fin ? Math.ceil((new Date(data.fecha_fin) - new Date()) / (1000 * 60 * 60 * 24)) : 0,
                status: data.estado,
                stage: data.estado === 'en_curso' ? 'Activo' : 
                       data.estado === 'en_riesgo' ? 'En Riesgo' :
                       data.estado === 'pendiente' ? 'Pendiente' : 'Finalizado',
                stageColor: data.estado === 'en_curso' ? 'bg-blue-100 text-blue-700' : 
                           data.estado === 'en_riesgo' ? 'bg-amber-100 text-amber-700' :
                           data.estado === 'finalizado' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700',
                stages: data.etapas?.map(s => ({
                    id: s.id,
                    name: s.nombre,
                    status: s.is_deleted ? 'Eliminado' : 'Activo',
                    materialComputations: [],
                    tasks: s.tareas?.map(t => ({
                        id: t.id,
                        title: t.titulo,
                        status: t.estado,
                        assigned: []
                    })) || []
                })) || [],
                pendingTasks: pendingTasksCount
            };

            setProject(mappedProject);
        } catch (error) {
            console.error('Error cargando detalle de proyecto:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStage = async () => {
        if (!newStageName.trim()) return;
        try {
            const { data, error } = await supabase
                .from('etapas')
                .insert([{ proyecto_id: id, nombre: newStageName, orden: (project.stages?.length || 0) + 1 }])
                .select()
                .single();

            if (error) throw error;
            
            fetchProjectData(); // Recargar datos
            setNewStageName('');
            setShowNewStageInput(false);
        } catch (error) {
            console.error('Error creando etapa:', error.message);
        }
    };

    const handleAddTask = async () => {
        if (!newTaskTitle.trim() || !activeStageId) return;
        try {
            const { error } = await supabase
                .from('tareas')
                .insert([{ 
                    etapa_id: activeStageId, 
                    titulo: newTaskTitle, 
                    estado: 'pendiente',
                    cantidad_medida: 0
                }]);

            if (error) throw error;
            
            fetchProjectData();
            setNewTaskTitle('');
            setShowTaskForm(false);
        } catch (error) {
            console.error('Error creando tarea:', error.message);
        }
    };

    const handleSaveComputation = (computation) => {
        // Implementar guardado en DB de cómputos en la siguiente iteración
        setShowCalculator(false);
    };

    if (loading) return <div className="p-8 text-center uppercase tracking-widest text-xs font-bold text-slate-500">Cargando detalles de obra...</div>;
    if (!project) return <div className="p-8">Proyecto no encontrado</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <nav className="flex mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <Link to="/proyectos" className="hover:text-primary transition-colors">Proyectos</Link>
                        <span className="mx-2">/</span>
                        <span className="text-primary">{project.name}</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{project.name}</h1>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${project.stageColor}`}>
                            {project.stage}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        Generar Reporte
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="relative w-12 h-12 flex-shrink-0">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path className="text-slate-100 dark:text-slate-800" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            <path className="text-primary" strokeDasharray={`${project.progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{project.progress}%</span>
                    </div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase">Avance</p><p className="text-lg font-black text-slate-900 dark:text-white">General</p></div>
                </div>

                <div className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600"><LucideClock size={24} /></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase">Tiempo</p><p className="text-lg font-black text-slate-900 dark:text-white">{project.daysLeft > 0 ? `${project.daysLeft} días` : 'Finalizado'}</p></div>
                </div>

                <div className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-bold text-slate-400 uppercase">Presupuesto</p>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">${(project.spent/1000).toFixed(0)}k / ${(project.budget/1000).toFixed(0)}k</p>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${project.budget > 0 ? (project.spent/project.budget)*100 : 0}%` }}></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600"><LucideCheckCircle2 size={24} /></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase">Tareas</p><p className="text-lg font-black text-slate-900 dark:text-white">{project.pendingTasks} activas</p></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                            <div className="flex items-center gap-2"><LucideLayers className="text-primary" size={20} /><h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Etapas y Planificación Técnica</h3></div>
                            <button onClick={() => setShowNewStageInput(true)} className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors"><LucidePlus size={16} /> Nueva Etapa</button>
                        </div>

                        <div className="p-6 space-y-4">
                            {showNewStageInput && (
                                <div className="flex gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-primary/30 animate-in slide-in-from-top-2">
                                    <input autoFocus value={newStageName} onChange={(e) => setNewStageName(e.target.value)} placeholder="Ej: Planta Alta - Mampostería" className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-3 py-1 text-sm outline-none focus:border-primary" />
                                    <button onClick={handleAddStage} className="bg-primary text-white px-3 py-1 rounded text-sm font-bold">Guardar</button>
                                    <button onClick={() => setShowNewStageInput(false)} className="text-slate-500 px-2 py-1 text-sm">Cancelar</button>
                                </div>
                            )}

                            {project.stages?.length > 0 ? (
                                <div className="space-y-4">
                                    {project.stages.map((stage) => (
                                        <div key={stage.id} className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/40">
                                            <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => setActiveStageId(activeStageId === stage.id ? null : stage.id)}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-blue-100 text-blue-600"><LucideClock size={16} /></div>
                                                    <div><h4 className="text-sm font-bold text-slate-900 dark:text-white">{stage.name}</h4><p className="text-[10px] text-slate-500 uppercase font-bold">{stage.status}</p></div>
                                                </div>
                                                <LucideChevronRight size={20} className={`text-slate-400 transition-transform ${activeStageId === stage.id ? 'rotate-90' : ''}`} />
                                            </div>

                                            {activeStageId === stage.id && (
                                                <div className="p-4 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20 space-y-6 animate-in fade-in slide-in-from-top-1">
                                                    <div>
                                                        <div className="flex justify-between items-center mb-3">
                                                            <h5 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><LucideClipboardList size={14} /> Tareas de Ejecución</h5>
                                                            <button onClick={() => setShowTaskForm(true)} className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full font-bold hover:bg-emerald-200 transition-colors"><LucidePlus size={12} /> Nueva Tarea</button>
                                                        </div>
                                                        {showTaskForm && (
                                                            <div className="mb-3 flex gap-2 animate-in slide-in-from-top-2">
                                                                <input autoFocus value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Título de la tarea..." className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-3 py-1 text-xs outline-none focus:border-emerald-500" />
                                                                <button onClick={handleAddTask} className="bg-emerald-500 text-white px-3 py-1 rounded text-xs font-bold">Añadir</button>
                                                            </div>
                                                        )}
                                                        <div className="space-y-2">
                                                            {stage.tasks.length > 0 ? (
                                                                stage.tasks.map((t) => (
                                                                    <div key={t.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg group">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className={`w-2 h-2 rounded-full ${t.status === 'finalizada' ? 'bg-emerald-500' : 'bg-orange-400'}`}></div>
                                                                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{t.title}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-3"><LucideUser size={14} className="text-slate-300" /></div>
                                                                    </div>
                                                                ))
                                                            ) : (<div className="text-center py-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg"><p className="text-[10px] text-slate-400">Sin tareas asignadas.</p></div>)}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (<div className="text-center py-10"><LucideLayers size={40} className="mx-auto text-slate-200 mb-3" /><p className="text-sm text-slate-500">Define las etapas del proyecto para comenzar la planificación.</p></div>)}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Equipo del Proyecto</h3>
                        <p className="text-xs text-slate-400 italic">Conexión con personal en desarrollo...</p>
                    </div>
                </div>
            </div>

            {showCalculator && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-lg"><MaterialCalculator onSave={handleSaveComputation} onCancel={() => setShowCalculator(false)} /></div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetail;

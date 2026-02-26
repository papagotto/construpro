import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getMediaUrl, uploadMedia } from '../lib/storage';
import MaterialCalculator from '../components/MaterialCalculator';
import { 
    LucideLayers, LucidePlus, LucideCalculator, LucideCheckCircle2, 
    LucideClock, LucideAlertTriangle, LucideChevronRight, LucidePackage,
    LucideClipboardList, LucideUser, LucideCamera, LucideLoader2,
    LucideEdit3, LucideSave, LucideX, LucideChevronLeft
} from 'lucide-react';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [editData, setEditData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [activeStageId, setActiveStageId] = useState(null);
    const [showCalculator, setShowCalculator] = useState(false);
    const [showNewStageInput, setShowNewStageInput] = useState(false);
    const [newStageName, setNewStageName] = useState('');
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskBudget, setNewTaskBudget] = useState('');
    const [newTaskEndDate, setNewTaskEndDate] = useState('');
    const fileInputRef = useRef(null);

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
                ...data,
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
                stages: data.etapas?.map(s => {
                    const stageTasks = s.tareas?.filter(t => !t.is_deleted) || [];
                    const stageBudget = stageTasks.reduce((sum, t) => sum + Number(t.costo_presupuestado || 0), 0);
                    const stageEndDate = stageTasks.length > 0 
                        ? new Date(Math.max(...stageTasks.map(t => t.fecha_fin_estimada ? new Date(t.fecha_fin_estimada) : 0)))
                        : null;

                    return {
                        id: s.id,
                        name: s.nombre,
                        status: s.is_deleted ? 'Eliminado' : 'Activo',
                        budget: stageBudget,
                        endDate: stageEndDate && stageEndDate.getTime() > 0 ? stageEndDate.toLocaleDateString('es-ES') : 'Pendiente',
                        tasks: stageTasks.map(t => ({
                            id: t.id,
                            title: t.titulo,
                            status: t.estado,
                            budget: Number(t.costo_presupuestado || 0),
                            endDate: t.fecha_fin_estimada ? new Date(t.fecha_fin_estimada).toLocaleDateString('es-ES') : 'S/D',
                            assigned: []
                        }))
                    };
                }) || [],
                pendingTasks: pendingTasksCount
            };

            setProject(mappedProject);
            setEditData(data); // Guardamos la data original para el form de edición
        } catch (error) {
            console.error('Error cargando detalle de proyecto:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const { error } = await supabase
                .from('proyectos')
                .update({
                    nombre: editData.nombre,
                    cliente: editData.cliente,
                    presupuesto: Number(editData.presupuesto),
                    fecha_inicio: editData.fecha_inicio,
                    fecha_fin: editData.fecha_fin,
                    estado: editData.estado
                })
                .eq('id', id);

            if (error) throw error;

            fetchProjectData();
            setIsEditing(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditData(project);
        setIsEditing(false);
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const filePath = await uploadMedia(file, 'projects', id);

            // Actualizar en DB
            const { error } = await supabase
                .from('proyectos')
                .update({ portada_path: filePath })
                .eq('id', id);

            if (error) throw error;

            fetchProjectData();
        } catch (error) {
            alert('Error al subir la imagen: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddStage = async () => {
        if (!newStageName.trim()) return;
        try {
            const { error } = await supabase
                .from('etapas')
                .insert([{ proyecto_id: id, nombre: newStageName, orden: (project.stages?.length || 0) + 1 }]);

            if (error) throw error;
            
            fetchProjectData();
            setNewStageName('');
            setShowNewStageInput(false);
        } catch (error) {
            console.error('Error creando etapa:', error.message);
            alert('Error al crear la etapa: ' + error.message);
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
                    costo_presupuestado: newTaskBudget ? parseFloat(newTaskBudget) : 0,
                    fecha_fin_estimada: newTaskEndDate || null,
                    cantidad_medida: 0
                }]);

            if (error) throw error;
            
            fetchProjectData();
            setNewTaskTitle('');
            setNewTaskBudget('');
            setNewTaskEndDate('');
            setShowTaskForm(false);
        } catch (error) {
            console.error('Error creando tarea:', error.message);
            alert('Error al crear la tarea: ' + error.message);
        }
    };

    const handleSaveComputation = (computation) => {
        setShowCalculator(false);
    };

    if (loading) return <div className="p-8 text-center uppercase tracking-widest text-xs font-bold text-slate-500">Cargando detalles de obra...</div>;
    if (!project) return <div className="p-8">Proyecto no encontrado</div>;

    const projectImage = getMediaUrl(project.portada_path) || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop';

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Mensaje de Éxito Flotante */}
            {showSuccess && (
                <div className="fixed top-20 right-8 z-[100] animate-in slide-in-from-right duration-300">
                    <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
                        <LucideCheckCircle2 size={20} />
                        <span className="font-bold text-sm">¡Proyecto actualizado con éxito!</span>
                    </div>
                </div>
            )}

            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <nav className="flex mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <Link to="/proyectos" className="hover:text-primary transition-colors">Proyectos</Link>
                        <span className="mx-2">/</span>
                        <span className="text-primary">{project.name}</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        {isEditing ? (
                            <input 
                                className="text-3xl font-bold text-slate-900 dark:text-white leading-none bg-white dark:bg-slate-800 border-2 border-primary/20 rounded-xl px-2 py-1 w-full outline-none focus:border-primary"
                                value={editData.nombre}
                                onChange={(e) => setEditData({...editData, nombre: e.target.value})}
                            />
                        ) : (
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{project.name}</h1>
                        )}
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${project.stageColor}`}>
                            {project.stage}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={handleCancel}
                                className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2"
                            >
                                <LucideX size={16} /> Cancelar
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? <LucideLoader2 size={16} className="animate-spin" /> : <LucideSave size={16} />}
                                Guardar Proyecto
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2"
                            >
                                <LucideEdit3 size={16} /> Editar Proyecto
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                Generar Reporte
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Banner de Proyecto */}
            <div className="h-48 md:h-64 rounded-2xl overflow-hidden relative group shadow-lg">
                <img src={projectImage} alt={project.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/30 transition-all flex items-center gap-2"
                >
                    {isUploading ? <LucideLoader2 className="animate-spin" size={14} /> : <LucideCamera size={14} />}
                    {isUploading ? 'Subiendo...' : 'Cambiar Portada'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Información General</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Cliente / Propietario</label>
                                    {isEditing ? (
                                        <input 
                                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-bold border-none outline-none ring-2 ring-primary/10 focus:ring-primary"
                                            value={editData.cliente || ''}
                                            onChange={(e) => setEditData({...editData, cliente: e.target.value})}
                                        />
                                    ) : (
                                        <p className="text-sm font-bold text-slate-700 dark:text-white uppercase">{project.client || 'S/D'}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Presupuesto Total ($)</label>
                                    {isEditing ? (
                                        <input 
                                            type="number"
                                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-bold border-none outline-none ring-2 ring-primary/10 focus:ring-primary"
                                            value={editData.presupuesto}
                                            onChange={(e) => setEditData({...editData, presupuesto: e.target.value})}
                                        />
                                    ) : (
                                        <p className="text-xl font-black text-emerald-600">${Number(project.budget || 0).toLocaleString()}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Fecha Inicio</label>
                                        {isEditing ? (
                                            <input 
                                                type="date"
                                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold border-none outline-none ring-2 ring-primary/10 focus:ring-primary"
                                                value={editData.fecha_inicio ? editData.fecha_inicio.split('T')[0] : ''}
                                                onChange={(e) => setEditData({...editData, fecha_inicio: e.target.value})}
                                            />
                                        ) : (
                                            <p className="text-sm font-bold text-slate-700 dark:text-white">{project.startDate}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Entrega Estimada</label>
                                        {isEditing ? (
                                            <input 
                                                type="date"
                                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold border-none outline-none ring-2 ring-primary/10 focus:ring-primary"
                                                value={editData.fecha_fin ? editData.fecha_fin.split('T')[0] : ''}
                                                onChange={(e) => setEditData({...editData, fecha_fin: e.target.value})}
                                            />
                                        ) : (
                                            <p className="text-sm font-bold text-slate-700 dark:text-white">{project.endDate}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Estado de Obra</label>
                                    {isEditing ? (
                                        <select 
                                            className="select-custom !p-2 !ring-1"
                                            value={editData.estado}
                                            onChange={(e) => setEditData({...editData, estado: e.target.value})}
                                        >
                                            <option value="pendiente">Pendiente</option>
                                            <option value="en_curso">En Curso</option>
                                            <option value="en_riesgo">En Riesgo</option>
                                            <option value="finalizado">Finalizado</option>
                                        </select>
                                    ) : (
                                        <p className="text-sm font-bold text-slate-700 dark:text-white uppercase">{project.status}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

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
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{stage.name}</h4>
                                                        <div className="flex items-center gap-3 mt-0.5">
                                                            <p className="text-[10px] text-slate-500 uppercase font-bold">{stage.status}</p>
                                                            <span className="text-[10px] text-slate-300">|</span>
                                                            <p className="text-[10px] text-emerald-600 font-bold">${stage.budget.toLocaleString()}</p>
                                                            <span className="text-[10px] text-slate-300">|</span>
                                                            <p className="text-[10px] text-blue-600 font-bold">Fin: {stage.endDate}</p>
                                                        </div>
                                                    </div>
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
                                                            <div className="mb-4 space-y-3 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-2 shadow-sm">
                                                                <input autoFocus value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Título de la tarea..." className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                                                                <div className="flex gap-3">
                                                                    <div className="flex-1">
                                                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Presupuesto ($)</label>
                                                                        <input type="number" value={newTaskBudget} onChange={(e) => setNewTaskBudget(e.target.value)} placeholder="0.00" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Fecha Fin</label>
                                                                        <input type="date" value={newTaskEndDate} onChange={(e) => setNewTaskEndDate(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-end gap-2">
                                                                    <button onClick={() => setShowTaskForm(false)} className="px-3 py-1 text-sm text-slate-500">Cancelar</button>
                                                                    <button onClick={handleAddTask} className="bg-emerald-500 text-white px-4 py-1 rounded text-sm font-bold shadow-sm hover:bg-emerald-600 transition-colors">Añadir Tarea</button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="space-y-2">
                                                            {stage.tasks.length > 0 ? (
                                                                stage.tasks.map((t) => (
                                                                    <div key={t.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg group">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className={`w-2 h-2 rounded-full ${t.status === 'finalizada' ? 'bg-emerald-500' : 'bg-orange-400'}`}></div>
                                                                            <div>
                                                                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{t.title}</span>
                                                                                <div className="flex gap-2 mt-1">
                                                                                    <span className="text-[9px] text-slate-400 font-bold">${t.budget.toLocaleString()}</span>
                                                                                    <span className="text-[9px] text-slate-300">•</span>
                                                                                    <span className="text-[9px] text-slate-400 font-bold">{t.endDate}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-3">
                                                                            <Link to={`/tareas/${t.id}`} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors">
                                                                                <LucideChevronRight size={14} className="text-slate-300" />
                                                                            </Link>
                                                                        </div>
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

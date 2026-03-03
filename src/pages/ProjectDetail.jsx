import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getMediaUrl, uploadMedia } from '../lib/storage';
import MaterialCalculator from '../components/MaterialCalculator';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
    LucideLayers, LucidePlus, LucideCalculator, LucideCheckCircle2, 
    LucideClock, LucideAlertTriangle, LucideChevronRight, LucidePackage,
    LucideClipboardList, LucideUser, LucideCamera, LucideLoader2,
    LucideEdit3, LucideSave, LucideX, LucideChevronLeft, LucideFolderKanban,
    LucideTrello, LucideTrash2, LucideCalendar, LucideGripVertical
} from 'lucide-react';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [apus, setApus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [activeStageId, setActiveStageId] = useState(null);
    const [showCalculator, setShowCalculator] = useState(false);
    
    const [showNewStageInput, setShowNewStageInput] = useState(false);
    const [newStageName, setNewStageName] = useState('');
    
    const [showNewRubroForm, setShowNewRubroForm] = useState(null);
    const [newRubroName, setNewRubroName] = useState('');
    
    const [showTaskForm, setShowTaskForm] = useState(null);
    const [newTask, setNewTask] = useState({
        titulo: '', 
        receta_id: '', 
        cantidad_medida: '', 
        costo_presupuestado: '',
        fecha_inicio_estimada: '', 
        fecha_fin_estimada: '',
        metodo_medicion: 'cuantitativo' // Valor por defecto
    });
    
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchProjectData();
        fetchApus();
    }, [id]);

    const fetchApus = async () => {
        const { data } = await supabase.from('recetas_apu').select('id, nombre').eq('is_deleted', false).order('nombre');
        setApus(data || []);
    };

    const fetchProjectData = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('proyectos')
                .select(`
                    *,
                    etapas (
                        *,
                        rubros (
                            *,
                            tareas (*)
                        )
                    )
                `)
                .eq('id', id)
                .single();

            if (error) throw error;

            let totalProgress = 0;
            let totalTasks = 0;
            let totalSpentProgress = 0;
            let pendingTasksCount = 0;

            data.etapas?.forEach(etapa => {
                etapa.rubros?.forEach(rubro => {
                    rubro.tareas?.forEach(tarea => {
                        if (!tarea.is_deleted) {
                            totalProgress += Number(tarea.avance_fisico_pct || 0);
                            totalSpentProgress += Number(tarea.avance_financiero_materiales_pct || 0);
                            totalTasks++;
                            if (tarea.estado !== 'finalizada') pendingTasksCount++;
                        }
                    });
                });
            });

            const avgProgress = totalTasks > 0 ? Math.round(totalProgress / totalTasks) : 0;
            const avgSpentProgress = totalTasks > 0 ? (totalSpentProgress / totalTasks) : 0;
            const realSpent = (Number(data.presupuesto || 0) * avgSpentProgress) / 100;

            const mappedProject = {
                ...data,
                budget: Number(data.presupuesto || 0),
                spent: realSpent,
                progress: avgProgress,
                startDate: new Date(data.fecha_inicio).toLocaleDateString('es-ES'),
                endDate: data.fecha_fin ? new Date(data.fecha_fin).toLocaleDateString('es-ES') : 'Pendiente',
                status: data.estado,
                stage: data.estado === 'en_curso' ? 'Activo' : 
                       data.estado === 'en_riesgo' ? 'En Riesgo' :
                       data.estado === 'pendiente' ? 'Pendiente' : 'Finalizado',
                stageColor: data.estado === 'en_curso' ? 'bg-blue-100 text-blue-700' : 
                           data.estado === 'en_riesgo' ? 'bg-amber-100 text-amber-700' :
                           data.estado === 'finalizado' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700',
                stages: (data.etapas || [])
                    .sort((a, b) => (a.orden || 0) - (b.orden || 0))
                    .map(s => ({
                        ...s,
                        rubros: (s.rubros || [])
                            .sort((a, b) => (a.orden || 0) - (b.orden || 0))
                            .map(r => ({
                                ...r,
                                tasks: (r.tareas || [])
                                    .filter(t => !t.is_deleted)
                                    .sort((a, b) => (a.orden || 0) - (b.orden || 0))
                            }))
                    })),
                pendingTasks: pendingTasksCount
            };

            setProject(mappedProject);
        } catch (error) {
            console.error('Error cargando detalle de proyecto:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId, type } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        // Clonar stages para actualizar UI optimísticamente
        const newStages = Array.from(project.stages);

        if (type === 'stage') {
            const [reorderedStage] = newStages.splice(source.index, 1);
            newStages.splice(destination.index, 0, reorderedStage);
            
            setProject({ ...project, stages: newStages });

            // Persistir orden de etapas
            const updates = newStages.map((s, idx) => ({ id: s.id, orden: idx }));
            await Promise.all(updates.map(u => 
                supabase.from('etapas').update({ orden: u.orden }).eq('id', u.id)
            ));
        }

        if (type === 'rubro') {
            const sourceStageIdx = newStages.findIndex(s => s.id === source.droppableId);
            const destStageIdx = newStages.findIndex(s => s.id === destination.droppableId);
            
            const sourceRubros = Array.from(newStages[sourceStageIdx].rubros);
            const [movedRubro] = sourceRubros.splice(source.index, 1);

            if (sourceStageIdx === destStageIdx) {
                sourceRubros.splice(destination.index, 0, movedRubro);
                newStages[sourceStageIdx].rubros = sourceRubros;
            } else {
                const destRubros = Array.from(newStages[destStageIdx].rubros);
                destRubros.splice(destination.index, 0, { ...movedRubro, etapa_id: destination.droppableId });
                newStages[sourceStageIdx].rubros = sourceRubros;
                newStages[destStageIdx].rubros = destRubros;
                
                // Actualizar DB para cambio de etapa
                await supabase.from('rubros').update({ etapa_id: destination.droppableId }).eq('id', movedRubro.id);
            }

            setProject({ ...project, stages: newStages });

            // Actualizar órdenes en DB
            const updates = newStages[destStageIdx].rubros.map((r, idx) => ({ id: r.id, orden: idx }));
            await Promise.all(updates.map(u => 
                supabase.from('rubros').update({ orden: u.orden }).eq('id', u.id)
            ));
        }

        if (type === 'task') {
            const sourceRubroId = source.droppableId;
            const destRubroId = destination.droppableId;

            // Encontrar los rubros origen y destino en el estado actual
            let sourceRubro = null;
            let destRubro = null;
            
            newStages.forEach(s => {
                s.rubros.forEach(r => {
                    if (r.id === sourceRubroId) sourceRubro = r;
                    if (r.id === destRubroId) destRubro = r;
                });
            });

            if (!sourceRubro || !destRubro) return;

            const sourceTasks = Array.from(sourceRubro.tasks);
            const [movedTask] = sourceTasks.splice(source.index, 1);

            if (sourceRubroId === destRubroId) {
                // Reordenar dentro del mismo rubro
                sourceTasks.splice(destination.index, 0, movedTask);
                sourceRubro.tasks = sourceTasks;
                
                setProject({ ...project, stages: newStages });

                // Actualizar órdenes en DB
                const updates = sourceRubro.tasks.map((t, idx) => ({ id: t.id, orden: idx }));
                await Promise.all(updates.map(u => 
                    supabase.from('tareas').update({ orden: u.orden }).eq('id', u.id)
                ));
            } else {
                // Mover a un rubro diferente
                const destTasks = Array.from(destRubro.tasks);
                const updatedTask = { ...movedTask, rubro_id: destRubroId };
                destTasks.splice(destination.index, 0, updatedTask);
                
                sourceRubro.tasks = sourceTasks;
                destRubro.tasks = destTasks;

                setProject({ ...project, stages: newStages });

                // Actualizar DB: Cambio de rubro y nuevos órdenes
                await supabase.from('tareas').update({ rubro_id: destRubroId }).eq('id', movedTask.id);
                
                const sourceUpdates = sourceRubro.tasks.map((t, idx) => ({ id: t.id, orden: idx }));
                const destUpdates = destRubro.tasks.map((t, idx) => ({ id: t.id, orden: idx }));
                
                await Promise.all([
                    ...sourceUpdates.map(u => supabase.from('tareas').update({ orden: u.orden }).eq('id', u.id)),
                    ...destUpdates.map(u => supabase.from('tareas').update({ orden: u.orden }).eq('id', u.id))
                ]);
            }
        }
    };

    const handleAddStage = async () => {
        if (!newStageName.trim()) return;
        try {
            const { error } = await supabase
                .from('etapas')
                .insert([{ proyecto_id: id, nombre: newStageName, orden: (project.stages?.length || 0) }]);
            if (error) throw error;
            fetchProjectData();
            setNewStageName('');
            setShowNewStageInput(false);
        } catch (error) {
            alert('Error al crear etapa: ' + error.message);
        }
    };

    const handleAddRubro = async (etapaId) => {
        if (!newRubroName.trim()) return;
        try {
            const { error } = await supabase
                .from('rubros')
                .insert([{ etapa_id: etapaId, nombre: newRubroName, orden: 0 }]);
            if (error) throw error;
            fetchProjectData();
            setNewRubroName('');
            setShowNewRubroForm(null);
        } catch (error) {
            alert('Error al crear rubro: ' + error.message);
        }
    };

    const handleAddTask = async (rubroId) => {
        if (!newTask.titulo.trim()) return;
        try {
            const etapaId = project.stages.find(s => s.rubros.some(r => r.id === rubroId))?.id;
            const { error } = await supabase
                .from('tareas')
                .insert([{ 
                    rubro_id: rubroId,
                    etapa_id: etapaId,
                    titulo: newTask.titulo, 
                    receta_id: newTask.receta_id || null,
                    cantidad_medida: newTask.cantidad_medida ? parseFloat(newTask.cantidad_medida) : 0,
                    costo_presupuestado: newTask.costo_presupuestado ? parseFloat(newTask.costo_presupuestado) : 0,
                    fecha_inicio_estimada: newTask.fecha_inicio_estimada || null,
                    fecha_fin_estimada: newTask.fecha_fin_estimada || null,
                    metodo_medicion: newTask.metodo_medicion || 'cuantitativo',
                    estado: 'pendiente',
                    orden: 0
                }]);
            if (error) throw error;
            fetchProjectData();
            setNewTask({ titulo: '', receta_id: '', cantidad_medida: '', costo_presupuestado: '', fecha_inicio_estimada: '', fecha_fin_estimada: '' });
            setShowTaskForm(null);
        } catch (error) {
            alert('Error al crear tarea: ' + error.message);
        }
    };

    const handleDeleteStage = async (e, stageId) => {
        e.stopPropagation();
        if (!window.confirm('¿Estás seguro de eliminar esta etapa? Se borrarán todos sus rubros y tareas asociadas.')) return;
        try {
            const { error } = await supabase.from('etapas').delete().eq('id', stageId);
            if (error) throw error;
            fetchProjectData();
        } catch (error) {
            alert('Error al eliminar etapa: ' + error.message);
        }
    };

    const handleDeleteRubro = async (e, rubroId) => {
        e.stopPropagation();
        if (!window.confirm('¿Eliminar este rubro y todas sus tareas?')) return;
        try {
            const { error } = await supabase.from('rubros').delete().eq('id', rubroId);
            if (error) throw error;
            fetchProjectData();
        } catch (error) {
            alert('Error al eliminar rubro: ' + error.message);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('¿Eliminar esta tarea?')) return;
        try {
            const { error } = await supabase.from('tareas').delete().eq('id', taskId);
            if (error) throw error;
            fetchProjectData();
        } catch (error) {
            alert('Error al eliminar tarea: ' + error.message);
        }
    };

    if (loading && !project) return <div className="p-8 text-center uppercase tracking-widest text-xs font-bold text-slate-500">Cargando centro de mando...</div>;
    if (!project) return <div className="p-8">Proyecto no encontrado</div>;

    const projectImage = getMediaUrl(project.portada_path) || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop';

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <nav className="flex mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <Link to="/proyectos" className="hover:text-primary transition-colors">Obras</Link>
                        <span className="mx-2 opacity-30">/</span>
                        <span className="text-primary">{project.nombre}</span>
                    </nav>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{project.nombre}</h1>
                        <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm ${project.stageColor}`}>
                            {project.stage}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white border border-slate-200 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
                        <LucideEdit3 size={14} /> Gestión
                    </button>
                </div>
            </div>

            {/* Banner & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 h-64 rounded-3xl overflow-hidden relative shadow-2xl group">
                    <img src={projectImage} alt={project.nombre} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                        <div>
                            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Presupuesto Adjudicado</p>
                            <p className="text-3xl font-black text-white">${project.budget.toLocaleString()}</p>
                        </div>
                        <button onClick={() => fileInputRef.current?.click()} className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-2xl hover:bg-white/20 transition-all">
                            <LucideCamera size={20} />
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Avance Global</p>
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100" strokeWidth="3" />
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-primary transition-all duration-1000" strokeWidth="3" strokeDasharray={`${project.progress}, 100`} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black text-slate-900">{project.progress}%</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-emerald-600 p-6 rounded-3xl shadow-lg shadow-emerald-500/20 text-white">
                        <LucideCheckCircle2 className="mb-4 opacity-50" size={24} />
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Inversión Real</p>
                        <p className="text-2xl font-black">${project.spent.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* WBS con Drag and Drop */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 shadow-xl overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                                <LucideLayers size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">WBS del Proyecto</h2>
                                <p className="text-xs text-slate-500 font-medium">Arrastra etapas, rubros o tareas para reordenar la obra.</p>
                            </div>
                        </div>
                        <button onClick={() => setShowNewStageInput(true)} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
                            <LucidePlus size={14} /> Añadir Etapa
                        </button>
                    </div>

                    <Droppable droppableId="stages" type="stage">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="p-8 space-y-8">
                                {showNewStageInput && (
                                    <div className="p-6 bg-primary/5 rounded-3xl border-2 border-dashed border-primary/20 flex gap-4 animate-in zoom-in-95">
                                        <input autoFocus value={newStageName} onChange={(e) => setNewStageName(e.target.value)} placeholder="Nombre de la nueva fase..." className="flex-1 bg-white border-none rounded-2xl px-6 text-sm font-bold shadow-sm focus:ring-2 ring-primary/20 outline-none" />
                                        <button onClick={handleAddStage} className="bg-primary text-white px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest">Crear Fase</button>
                                        <button onClick={() => setShowNewStageInput(false)} className="text-slate-400 p-3 hover:text-slate-600 transition-colors"><LucideX size={24} /></button>
                                    </div>
                                )}

                                {project.stages.map((stage, index) => (
                                    <Draggable key={stage.id} draggableId={stage.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} className={`group ${snapshot.isDragging ? 'z-50' : ''}`}>
                                                <div 
                                                    className={`p-6 rounded-[24px] transition-all flex items-center justify-between ${activeStageId === stage.id ? 'bg-slate-900 text-white shadow-2xl' : 'bg-slate-50 hover:bg-slate-100 text-slate-900'}`} 
                                                    onClick={() => setActiveStageId(activeStageId === stage.id ? null : stage.id)}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div {...provided.dragHandleProps} className="p-2 hover:bg-white/10 rounded-lg cursor-grab active:cursor-grabbing">
                                                            <LucideGripVertical size={18} className="text-slate-400" />
                                                        </div>
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${activeStageId === stage.id ? 'bg-white/10' : 'bg-white shadow-sm text-primary'}`}>
                                                            <LucideFolderKanban size={20} />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-black tracking-tight">{stage.nombre}</h3>
                                                            <p className={`text-[10px] font-bold uppercase tracking-widest ${activeStageId === stage.id ? 'text-white/40' : 'text-slate-400'}`}>{stage.rubros.length} Rubros activos</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <button onClick={(e) => handleDeleteStage(e, stage.id)} className={`p-2 rounded-xl transition-all ${activeStageId === stage.id ? 'hover:bg-red-500 text-white/40 hover:text-white' : 'hover:bg-red-50 text-slate-200 hover:text-red-500'}`}>
                                                            <LucideTrash2 size={18} />
                                                        </button>
                                                        <LucideChevronRight size={24} className={`transition-transform duration-300 ${activeStageId === stage.id ? 'rotate-90 opacity-100' : 'opacity-20'}`} />
                                                    </div>
                                                </div>

                                                {activeStageId === stage.id && (
                                                    <div className="mt-4 ml-6 pl-8 border-l-2 border-slate-100 space-y-6 animate-in slide-in-from-left-4 duration-500">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Agrupadores de Obra</span>
                                                            <button onClick={(e) => { e.stopPropagation(); setShowNewRubroForm(stage.id); }} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">+ Nuevo Rubro</button>
                                                        </div>

                                                        {showNewRubroForm === stage.id && (
                                                            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex gap-3 mb-6">
                                                                <input autoFocus value={newRubroName} onChange={(e) => setNewRubroName(e.target.value)} placeholder="Ej: Mampostería de Elevación" className="flex-1 text-sm font-bold outline-none" />
                                                                <button onClick={() => handleAddRubro(stage.id)} className="text-primary font-black text-[10px] uppercase">Guardar</button>
                                                                <button onClick={() => setShowNewRubroForm(null)} className="text-slate-300"><LucideX size={16} /></button>
                                                            </div>
                                                        )}

                                                        <Droppable droppableId={stage.id} type="rubro">
                                                            {(provided) => (
                                                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                                                    {stage.rubros.map((rubro, idx) => (
                                                                        <Draggable key={rubro.id} draggableId={rubro.id} index={idx}>
                                                                            {(provided) => (
                                                                                <div ref={provided.innerRef} {...provided.draggableProps} className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm group/rubro">
                                                                                    <div className="flex items-center justify-between mb-6">
                                                                                        <div className="flex items-center gap-3">
                                                                                            <div {...provided.dragHandleProps} className="p-1 cursor-grab active:cursor-grabbing">
                                                                                                <LucideGripVertical size={14} className="text-slate-300" />
                                                                                            </div>
                                                                                            <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                                                                                                <LucideTrello size={16} />
                                                                                            </div>
                                                                                            <h4 className="font-black text-slate-800 tracking-tight uppercase text-sm">{rubro.nombre}</h4>
                                                                                            <button onClick={(e) => handleDeleteRubro(e, rubro.id)} className="opacity-0 group-hover/rubro:opacity-100 p-1.5 text-slate-300 hover:text-red-500 transition-all">
                                                                                                <LucideTrash2 size={14} />
                                                                                            </button>
                                                                                        </div>
                                                                                        <div className="flex items-center gap-6">
                                                                                            <div className="text-right">
                                                                                                <p className="text-[9px] font-black text-slate-400 uppercase">Presupuesto</p>
                                                                                                <p className="text-sm font-black text-slate-900">${(rubro.tareas?.reduce((s, t) => s + Number(t.costo_presupuestado || 0), 0) || 0).toLocaleString()}</p>
                                                                                            </div>
                                                                                            <button onClick={(e) => { e.stopPropagation(); setShowTaskForm(rubro.id); }} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors">
                                                                                                <LucidePlus size={16} />
                                                                                            </button>
                                                                                            </div>
                                                                                            </div>

                                                                                            {/* Formulario de Nueva Tarea (Corregido) */}
                                                                                            {showTaskForm === rubro.id && (
                                                                                            <div className="mb-6 p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-emerald-200 animate-in zoom-in-95">
                                                                                            <div className="flex justify-between items-center mb-4">
                                                                                                <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Nueva Tarea en {rubro.nombre}</h5>
                                                                                                <button onClick={() => setShowTaskForm(null)} className="text-slate-400 hover:text-slate-600"><LucideX size={20} /></button>
                                                                                            </div>

                                                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                                                <div className="col-span-full lg:col-span-2">
                                                                                                    <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block ml-1">Título de Actividad</label>
                                                                                                    <input autoFocus value={newTask.titulo} onChange={(e) => setNewTask({...newTask, titulo: e.target.value})} placeholder="Ej: Elevación de muros" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm focus:ring-2 ring-emerald-500/20 outline-none" />
                                                                                                </div>
                                                                                                <div>
                                                                                                    <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block ml-1">Análisis (APU)</label>
                                                                                                    <select value={newTask.receta_id} onChange={(e) => setNewTask({...newTask, receta_id: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm focus:ring-2 ring-emerald-500/20 outline-none">
                                                                                                        <option value="">Seleccionar Maestro...</option>
                                                                                                        {apus.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                                                                                                    </select>
                                                                                                </div>
                                                                                                <div>
                                                                                                    <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block ml-1">Cantidad</label>
                                                                                                    <input type="number" value={newTask.cantidad_medida} onChange={(e) => setNewTask({...newTask, cantidad_medida: e.target.value})} placeholder="0.00" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm focus:ring-2 ring-emerald-500/20 outline-none" />
                                                                                                </div>
                                                                                                <div>
                                                                                                    <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block ml-1">Presupuesto ($)</label>
                                                                                                    <input type="number" value={newTask.costo_presupuestado} onChange={(e) => setNewTask({...newTask, costo_presupuestado: e.target.value})} placeholder="0.00" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm focus:ring-2 ring-emerald-500/20 outline-none" />
                                                                                                </div>
                                                                                                <div>
                                                                                                    <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block ml-1">Método de Medición</label>
                                                                                                    <select 
                                                                                                        value={newTask.metodo_medicion} 
                                                                                                        onChange={(e) => setNewTask({...newTask, metodo_medicion: e.target.value})} 
                                                                                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm focus:ring-2 ring-emerald-500/20 outline-none"
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
                                                                                                        <input type="date" value={newTask.fecha_inicio_estimada} onChange={(e) => setNewTask({...newTask, fecha_inicio_estimada: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" />
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block ml-1">Fin Est.</label>
                                                                                                        <input type="date" value={newTask.fecha_fin_estimada} onChange={(e) => setNewTask({...newTask, fecha_fin_estimada: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="mt-6 flex justify-end gap-3">
                                                                                                <button onClick={() => handleAddTask(rubro.id)} className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center gap-2">
                                                                                                    <LucideSave size={14} /> Confirmar Tarea
                                                                                                </button>
                                                                                            </div>
                                                                                            </div>
                                                                                            )}
                                                                                            {/* Tareas del Rubro con DnD */}
                                                                                            <Droppable droppableId={rubro.id} type="task">
                                                                                                {(provided) => (
                                                                                                    <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-2 md:gap-0">
                                                                                                        {rubro.tasks.map((task, tIdx) => (
                                                                                                            <Draggable key={task.id} draggableId={task.id} index={tIdx}>
                                                                                                                {(provided) => (
                                                                                                                    <div 
                                                                                                                        ref={provided.innerRef} 
                                                                                                                        {...provided.draggableProps} 
                                                                                                                        {...provided.dragHandleProps} 
                                                                                                                        className="flex items-center justify-between p-4 md:p-3 bg-white border border-slate-50 rounded-2xl md:rounded-none md:border-0 md:border-b md:border-slate-100 hover:bg-slate-50 transition-all group/task"
                                                                                                                    >
                                                                                                                        <div className="flex items-center gap-4">
                                                                                                                            <div className={`w-2 h-2 rounded-full shrink-0 ${task.estado === 'finalizada' ? 'bg-emerald-500' : 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]'}`}></div>
                                                                                                                            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                                                                                                                <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{task.titulo}</span>
                                                                                                                                {task.costo_presupuestado > 0 && (
                                                                                                                                    <span className="hidden md:block text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">
                                                                                                                                        ${Number(task.costo_presupuestado).toLocaleString()}
                                                                                                                                    </span>
                                                                                                                                )}
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="flex items-center gap-2">
                                                                                                                            <button 
                                                                                                                                onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }} 
                                                                                                                                className="opacity-0 group-hover/task:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"
                                                                                                                            >
                                                                                                                                <LucideTrash2 size={14} />
                                                                                                                            </button>
                                                                                                                            <Link 
                                                                                                                                to={`/tareas/${task.id}`} 
                                                                                                                                className="p-2 bg-slate-50 md:bg-transparent text-slate-400 rounded-xl hover:text-primary hover:bg-primary/5 transition-all"
                                                                                                                            >
                                                                                                                                <LucideChevronRight size={16} />
                                                                                                                            </Link>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                )}
                                                                                                            </Draggable>
                                                                                                        ))}
                                                                                                        {provided.placeholder}
                                                                                                        {rubro.tasks.length === 0 && (
                                                                                                            <div className="py-8 text-center border border-dashed border-slate-100 rounded-3xl md:rounded-none md:border-0 md:border-b">
                                                                                                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No hay tareas planificadas aún</p>
                                                                                                            </div>
                                                                                                        )}
                                                                                                    </div>
                                                                                                )}
                                                                                            </Droppable>

                                                                                </div>
                                                                            )}
                                                                        </Draggable>
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
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>

            {/* Float Calculator */}
            <button onClick={() => setShowCalculator(true)} className="fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 bg-slate-900 text-white rounded-[24px] shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all z-40">
                <LucideCalculator size={20} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Calculador de Materiales</span>
            </button>

            {showCalculator && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
                    <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <MaterialCalculator onSave={() => { fetchProjectData(); setShowCalculator(false); }} onCancel={() => setShowCalculator(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetail;

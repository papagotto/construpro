import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getMediaUrl, uploadMedia } from '../../lib/storage';
// import MaterialCalculator from '../../components/MaterialCalculator_DEPRECATED';
import ProjectDetailHeader from '../../components/projects/detail/ProjectDetailHeader';
import ProjectStatsBanner from '../../components/projects/detail/ProjectStatsBanner';
import ProjectWbs from '../../components/projects/detail/ProjectWbs';
import ProjectMaterialsSidebar from '../../components/projects/detail/ProjectMaterialsSidebar';
import ProjectActionCards from '../../components/projects/detail/ProjectActionCards';
import { LucideCalculator, LucideX } from 'lucide-react';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [apus, setApus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    // Estados de navegación y cómputo
    const [expandedStageId, setExpandedStageId] = useState(null);
    const [activeStageId, setActiveStageId] = useState(null);
    const [activeRubroId, setActiveRubroId] = useState(null);
    const [activeTaskId, setActiveTaskId] = useState(null);
    
    const [showCalculator, setShowCalculator] = useState(false);
    const [projectRecipes, setProjectRecipes] = useState({});
    
    const [showNewStageInput, setShowNewStageInput] = useState(false);
    const [newStageName, setNewStageName] = useState('');
    
    const [showNewRubroForm, setShowNewRubroForm] = useState(null);
    const [newRubroName, setNewRubroName] = useState('');
    
    const [showTaskForm, setShowTaskForm] = useState(null);
    const [newTask, setNewTask] = useState({
        titulo: '', tipo_tarea: 'albañileria', receta_id: '', cantidad_medida: '', 
        costo_presupuestado: '', fecha_inicio_estimada: '', fecha_fin_estimada: '', metodo_medicion: 'cuantitativo'
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
            const { data, error } = await supabase.from('proyectos').select(`*, etapas (*, rubros (*, tareas (*)))`).eq('id', id).single();
            if (error) throw error;

            let totalProgress = 0, totalTasks = 0, totalSpentProgress = 0, pendingTasksCount = 0;
            data.etapas?.forEach(etapa => etapa.rubros?.forEach(rubro => rubro.tareas?.forEach(tarea => {
                if (!tarea.is_deleted) {
                    totalProgress += Number(tarea.avance_fisico_pct || 0);
                    totalSpentProgress += Number(tarea.avance_financiero_materiales_pct || 0);
                    totalTasks++;
                    if (tarea.estado !== 'finalizada') pendingTasksCount++;
                }
            })));

            const avgProgress = totalTasks > 0 ? Math.round(totalProgress / totalTasks) : 0;
            const avgSpentProgress = totalTasks > 0 ? (totalSpentProgress / totalTasks) : 0;
            const realSpent = (Number(data.presupuesto || 0) * avgSpentProgress) / 100;

            const mappedProject = {
                ...data, budget: Number(data.presupuesto || 0), spent: realSpent, progress: avgProgress,
                startDate: new Date(data.fecha_inicio).toLocaleDateString('es-ES'),
                endDate: data.fecha_fin ? new Date(data.fecha_fin).toLocaleDateString('es-ES') : 'Pendiente',
                status: data.estado, stage: data.estado === 'en_curso' ? 'Activo' : data.estado === 'en_riesgo' ? 'En Riesgo' : data.estado === 'pendiente' ? 'Pendiente' : 'Finalizado',
                stageColor: data.estado === 'en_curso' ? 'bg-blue-100 text-blue-700' : data.estado === 'en_riesgo' ? 'bg-amber-100 text-amber-700' : data.estado === 'finalizado' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700',
                stages: (data.etapas || []).sort((a, b) => (a.orden || 0) - (b.orden || 0)).map(s => ({
                    ...s, rubros: (s.rubros || []).sort((a, b) => (a.orden || 0) - (b.orden || 0)).map(r => ({
                        ...r, tasks: (r.tareas || []).filter(t => !t.is_deleted).sort((a, b) => (a.orden || 0) - (b.orden || 0))
                    }))
                })),
                pendingTasks: pendingTasksCount
            };

            setProject(mappedProject);
            const recipeIds = new Set();
            data.etapas?.forEach(e => e.rubros?.forEach(r => r.tareas?.forEach(t => t.receta_id && recipeIds.add(t.receta_id))));
            if (recipeIds.size > 0) {
                const { data: recipesData } = await supabase.from('receta_recursos').select('*, recursos(*)').in('receta_id', Array.from(recipeIds));
                const recipesMap = {};
                recipesData?.forEach(item => {
                    if (!recipesMap[item.receta_id]) recipesMap[item.receta_id] = [];
                    recipesMap[item.receta_id].push(item);
                });
                setProjectRecipes(recipesMap);
            }
        } catch (error) {
            console.error('Error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId, type } = result;
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

        const newStages = Array.from(project.stages);
        if (type === 'stage') {
            const [reorderedStage] = newStages.splice(source.index, 1);
            newStages.splice(destination.index, 0, reorderedStage);
            setProject({ ...project, stages: newStages });
            await Promise.all(newStages.map((s, idx) => supabase.from('etapas').update({ orden: idx }).eq('id', s.id)));
        } else if (type === 'rubro') {
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
                await supabase.from('rubros').update({ etapa_id: destination.droppableId }).eq('id', movedRubro.id);
            }
            setProject({ ...project, stages: newStages });
            await Promise.all(newStages[destStageIdx].rubros.map((r, idx) => supabase.from('rubros').update({ orden: idx }).eq('id', r.id)));
        } else if (type === 'task') {
            const sourceRubroId = source.droppableId, destRubroId = destination.droppableId;
            let sourceRubro = null, destRubro = null;
            newStages.forEach(s => s.rubros.forEach(r => {
                if (r.id === sourceRubroId) sourceRubro = r;
                if (r.id === destRubroId) destRubro = r;
            }));
            if (!sourceRubro || !destRubro) return;
            const sourceTasks = Array.from(sourceRubro.tasks), [movedTask] = sourceTasks.splice(source.index, 1);
            if (sourceRubroId === destRubroId) {
                sourceTasks.splice(destination.index, 0, movedTask);
                sourceRubro.tasks = sourceTasks;
                setProject({ ...project, stages: newStages });
                await Promise.all(sourceRubro.tasks.map((t, idx) => supabase.from('tareas').update({ orden: idx }).eq('id', t.id)));
            } else {
                const destTasks = Array.from(destRubro.tasks);
                destTasks.splice(destination.index, 0, { ...movedTask, rubro_id: destRubroId });
                sourceRubro.tasks = sourceTasks; destRubro.tasks = destTasks;
                setProject({ ...project, stages: newStages });
                await supabase.from('tareas').update({ rubro_id: destRubroId }).eq('id', movedTask.id);
                await Promise.all([...sourceRubro.tasks.map((t, idx) => supabase.from('tareas').update({ orden: idx }).eq('id', t.id)), ...destRubro.tasks.map((t, idx) => supabase.from('tareas').update({ orden: idx }).eq('id', t.id))]);
            }
        }
    };

    const handleAddStage = async () => {
        if (!newStageName.trim()) return;
        try {
            const { error } = await supabase.from('etapas').insert([{ proyecto_id: id, nombre: newStageName, orden: project.stages?.length || 0 }]);
            if (error) throw error;
            fetchProjectData(); setNewStageName(''); setShowNewStageInput(false);
        } catch (error) { alert(error.message); }
    };

    const handleAddRubro = async (etapaId) => {
        if (!newRubroName.trim()) return;
        try {
            const { error } = await supabase.from('rubros').insert([{ etapa_id: etapaId, nombre: newRubroName, orden: 0 }]);
            if (error) throw error;
            fetchProjectData(); setNewRubroName(''); setShowNewRubroForm(null);
        } catch (error) { alert(error.message); }
    };

    const handleAddTask = async (rubroId) => {
        if (!newTask.titulo.trim()) return;
        try {
            const etapaId = project.stages.find(s => s.rubros.some(r => r.id === rubroId))?.id;
            const { error } = await supabase.from('tareas').insert([{ 
                rubro_id: rubroId, etapa_id: etapaId, titulo: newTask.titulo, tipo_tarea: newTask.tipo_tarea,
                receta_id: newTask.tipo_tarea === 'albañileria' ? (newTask.receta_id || null) : null,
                cantidad_medida: newTask.tipo_tarea === 'albañileria' ? (parseFloat(newTask.cantidad_medida) || 0) : 0,
                costo_presupuestado: parseFloat(newTask.costo_presupuestado) || 0,
                fecha_inicio_estimada: newTask.fecha_inicio_estimada || null, fecha_fin_estimada: newTask.fecha_fin_estimada || null,
                metodo_medicion: newTask.metodo_medicion || 'cuantitativo', estado: 'pendiente', orden: 0
            }]);
            if (error) throw error;
            fetchProjectData(); setNewTask({ titulo: '', tipo_tarea: 'albañileria', receta_id: '', cantidad_medida: '', costo_presupuestado: '', fecha_inicio_estimada: '', fecha_fin_estimada: '', metodo_medicion: 'cuantitativo' });
            setShowTaskForm(null);
        } catch (error) { alert(error.message); }
    };

    const calculateDynamicMaterials = (sId, rId, tId) => {
        if (!project || !projectRecipes) return [];
        const aggregated = {};
        const processTask = (task) => {
            if (!task.receta_id || !projectRecipes[task.receta_id]) return;
            const taskQuantity = Number(task.cantidad_medida || 0);
            projectRecipes[task.receta_id].forEach(m => {
                const rId = m.recurso_id, total = taskQuantity * Number(m.cantidad_por_unidad || 0);
                if (!aggregated[rId]) aggregated[rId] = { nombre: m.recursos?.nombre_interno, unidad: m.recursos?.unidad_base || 'u', cantidad: 0 };
                aggregated[rId].cantidad += total;
            });
        };

        if (tId) {
            let task = null; project.stages.forEach(s => s.rubros.forEach(r => { const found = r.tasks.find(tk => tk.id === tId); if (found) task = found; }));
            if (task) processTask(task);
        } else if (rId) {
            let rubro = null; project.stages.forEach(s => { const found = s.rubros.find(r => r.id === rId); if (found) rubro = found; });
            rubro?.tasks?.forEach(processTask);
        } else if (sId) {
            project.stages.find(s => s.id === sId)?.rubros?.forEach(r => r.tasks?.forEach(processTask));
        } else {
            project.stages.forEach(s => s.rubros?.forEach(r => r.tasks?.forEach(processTask)));
        }
        return Object.values(aggregated).filter(m => m.cantidad > 0);
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
            const filePath = await uploadMedia(file, 'projects', id);
            await supabase.from('proyectos').update({ portada_path: filePath }).eq('id', id);
            fetchProjectData();
        } catch (error) { alert(error.message); }
    };

    if (loading && !project) return <div className="p-8 text-center uppercase tracking-widest text-xs font-bold text-slate-500">Cargando centro de mando...</div>;
    if (!project) return <div className="p-8">Proyecto no encontrado</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            
            <ProjectDetailHeader project={project} onEdit={() => setIsEditing(true)} />
            
            <ProjectStatsBanner 
                project={project} 
                projectImage={getMediaUrl(project.portada_path) || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000'} 
                onCameraClick={() => fileInputRef.current?.click()} 
            />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] xl:grid-cols-[1fr_400px] gap-6 items-start">
                <ProjectWbs 
                    project={project}
                    expandedStageId={expandedStageId}
                    activeStageId={activeStageId}
                    activeRubroId={activeRubroId}
                    activeTaskId={activeTaskId}
                    showNewStageInput={showNewStageInput}
                    newStageName={newStageName}
                    setNewStageName={setNewStageName}
                    showNewRubroForm={showNewRubroForm}
                    newRubroName={newRubroName}
                    setNewRubroName={setNewRubroName}
                    showTaskForm={showTaskForm}
                    newTask={newTask}
                    setNewTask={setNewTask}
                    apus={apus}
                    onDragEnd={onDragEnd}
                    onAddStage={handleAddStage}
                    onShowNewStageInput={() => setShowNewStageInput(true)}
                    onHideNewStageInput={() => setShowNewStageInput(false)}
                    onStageClick={(sId) => { const isOpening = expandedStageId !== sId; setExpandedStageId(isOpening ? sId : null); setActiveStageId(isOpening ? sId : null); if (isOpening) { setActiveRubroId(null); setActiveTaskId(null); } }}
                    onDeleteStage={async (e, sId) => { e.stopPropagation(); if (window.confirm('¿Eliminar etapa?')) { await supabase.from('etapas').delete().eq('id', sId); fetchProjectData(); } }}
                    onShowNewRubroForm={(sId) => setShowNewRubroForm(sId)}
                    onHideNewRubroForm={() => setShowNewRubroForm(null)}
                    onAddRubro={handleAddRubro}
                    onRubroClick={(rId) => { const isOp = activeRubroId !== rId; setActiveRubroId(isOp ? rId : null); if (isOp) { setActiveTaskId(null); setActiveStageId(null); } }}
                    onDeleteRubro={async (e, rId) => { e.stopPropagation(); if (window.confirm('¿Eliminar rubro?')) { await supabase.from('rubros').delete().eq('id', rId); fetchProjectData(); } }}
                    onShowTaskForm={(rId) => setShowTaskForm(rId)}
                    onHideTaskForm={() => setShowTaskForm(null)}
                    onAddTask={handleAddTask}
                    onTaskClick={(tId) => { const isOp = activeTaskId !== tId; setActiveTaskId(isOp ? tId : null); if (isOp) { setActiveRubroId(null); setActiveStageId(null); } }}
                    onDeleteTask={async (tId) => { if (window.confirm('¿Eliminar tarea?')) { await supabase.from('tareas').delete().eq('id', tId); fetchProjectData(); } }}
                />

                <div className="sticky top-6 space-y-6">
                    <ProjectMaterialsSidebar 
                        activeTaskId={activeTaskId}
                        activeRubroId={activeRubroId}
                        activeStageId={activeStageId}
                        project={project}
                        materials={calculateDynamicMaterials(activeStageId, activeRubroId, activeTaskId)}
                        onClearSelection={() => { setActiveStageId(null); setActiveRubroId(null); setActiveTaskId(null); }}
                    />
                    <ProjectActionCards onShowCalculator={() => setShowCalculator(true)} />
                </div>
            </div>

            {/* 
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
            */}
        </div>
    );
};

export default ProjectDetail;

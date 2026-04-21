import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import TaskDetailHeader from '../../components/tasks/detail/TaskDetailHeader';
import TaskApuPanel from '../../components/tasks/detail/TaskApuPanel';
import TaskMaterialsPanel from '../../components/tasks/detail/TaskMaterialsPanel';
import TaskTeamPanel from '../../components/tasks/detail/TaskTeamPanel';
import TaskTimelinePanel from '../../components/tasks/detail/TaskTimelinePanel';
import { LucideCheckCircle2 } from 'lucide-react';

const TaskDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [editData, setEditData] = useState(null);
    const [recetas, setRecetas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [materialesRequeridos, setMaterialesRequeridos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => { fetchInitialData(true); }, [id]);

    const fetchInitialData = async (showGlobalLoading = false) => {
        try {
            if (showGlobalLoading) setLoading(true);
            const { data: taskData, error: taskError } = await supabase.from('tareas').select(`*, etapas (nombre, proyectos (nombre)), recetas_apu (*)`).eq('id', id).single();
            if (taskError) throw taskError;
            if (taskData.receta_id) {
                const { data: matsData } = await supabase.from('receta_recursos').select('*, recursos(*)').eq('receta_id', taskData.receta_id);
                setMaterialesRequeridos(matsData || []);
            } else setMaterialesRequeridos([]);
            const { data: recetasData } = await supabase.from('recetas_apu').select('*').eq('is_deleted', false);
            const { data: usersData } = await supabase.from('usuarios').select('*').eq('is_deleted', false);
            const { data: assignData } = await supabase.from('tarea_personal').select('*, usuarios(*)').eq('tarea_id', id);
            const taskObj = { ...taskData, projectName: taskData.etapas?.proyectos?.nombre || 'General', stageName: taskData.etapas?.nombre || 'S/D' };
            setTask(taskObj); setEditData(taskObj); setRecetas(recetasData || []); setUsuarios(usersData || []); setAssignments(assignData || []);
        } catch (error) { console.error('Error:', error.message); } finally { setLoading(false); }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const { error } = await supabase.from('tareas').update({
                titulo: editData.titulo, receta_id: editData.receta_id, cantidad_medida: Number(editData.cantidad_medida),
                fecha_inicio_estimada: editData.fecha_inicio_estimada, fecha_fin_estimada: editData.fecha_fin_estimada,
                prioridad: editData.prioridad, estado: editData.estado
            }).eq('id', id);
            if (error) throw error;
            setIsEditing(false); setShowSuccess(true); setTimeout(() => setShowSuccess(false), 3000); fetchInitialData(false);
        } catch (error) { alert('Error: ' + error.message); } finally { setIsSaving(false); }
    };

    const handleAddAssignment = async (usuarioId) => {
        try {
            const { error } = await supabase.from('tarea_personal').insert({ tarea_id: id, usuario_id: usuarioId, horas_asignadas_diarias: 8 });
            if (error) throw error;
            fetchInitialData(false);
        } catch (error) { console.error('Error:', error.message); }
    };

    const handleRemoveAssignment = async (assignId) => {
        try {
            const { error } = await supabase.from('tarea_personal').delete().eq('id', assignId);
            if (error) throw error;
            fetchInitialData(false);
        } catch (error) { console.error('Error:', error.message); }
    };

    const calculateTimeEstimates = () => {
        const curr = isEditing ? editData : task;
        if (!curr?.recetas_apu || !curr?.cantidad_medida) return null;
        const totalHH = Number(curr.cantidad_medida) * Number(curr.recetas_apu.rendimiento_mano_obra);
        const pers = assignments.length;
        const dias = pers > 0 ? Math.ceil(totalHH / (pers * 8)) : 'S/D';
        return { totalHorasHombre: totalHH, diasEstimados: dias, cumpleMinimo: pers >= (curr.recetas_apu.personal_minimo || 1) };
    };

    if (loading) return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest text-xs">Sincronizando oficina técnica...</div>;
    if (!task) return <div className="p-8 text-center text-slate-500">Actividad no encontrada.</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {showSuccess && (
                <div className="fixed top-20 right-8 z-[100] animate-in slide-in-from-right duration-300">
                    <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
                        <LucideCheckCircle2 size={20} /><span className="font-bold text-sm">¡Tarea actualizada!</span>
                    </div>
                </div>
            )}

            <TaskDetailHeader 
                titulo={isEditing ? editData.titulo : task.titulo}
                isEditing={isEditing} isSaving={isSaving}
                onBack={() => navigate('/tareas')} onCancel={() => { setEditData(task); setIsEditing(false); }}
                onSave={handleSave} onEdit={() => setIsEditing(true)}
                onTitleChange={(val) => setEditData({...editData, titulo: val})}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <TaskApuPanel 
                        task={task} editData={editData} isEditing={isEditing}
                        recetas={recetas} onEditDataChange={setEditData}
                        timeEstimates={calculateTimeEstimates()} assignmentsCount={assignments.length}
                    />
                    <TaskMaterialsPanel 
                        recetaId={task.receta_id} materialesRequeridos={materialesRequeridos}
                        cantidadMedida={isEditing ? editData.cantidad_medida : task.cantidad_medida}
                        unidadMedida={isEditing ? (editData.recetas_apu?.unidad_medida || 'u') : (task.recetas_apu?.unidad_medida || 'u')}
                    />
                </div>
                <div className="space-y-6">
                    <TaskTeamPanel 
                        assignments={assignments} usuarios={usuarios}
                        onAddAssignment={handleAddAssignment} onRemoveAssignment={handleRemoveAssignment}
                    />
                    <TaskTimelinePanel 
                        task={task} editData={editData} isEditing={isEditing} onEditDataChange={setEditData}
                    />
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;

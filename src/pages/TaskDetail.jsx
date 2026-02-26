import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getMediaUrl } from '../lib/storage';
import { 
    LucideClipboardList, LucideUser, LucidePackage, LucideClock, 
    LucideCheckCircle2, LucideSend, DraftingCompass as LucideArchitecture, LucideAlertTriangle,
    LucideUsers, LucideCalendar, LucidePlus, LucideTrash2, LucideBox,
    LucideEdit3, LucideSave, LucideX, LucideChevronLeft, LucideLoader2
} from 'lucide-react';

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

    useEffect(() => {
        fetchInitialData(true);
    }, [id]);

    const fetchInitialData = async (showGlobalLoading = false) => {
        try {
            if (showGlobalLoading) setLoading(true);
            
            // 1. Cargar Tarea con su Receta vinculada
            const { data: taskData, error: taskError } = await supabase
                .from('tareas')
                .select(`
                    *,
                    etapas (nombre, proyectos (nombre)),
                    recetas_apu (*)
                `)
                .eq('id', id)
                .single();

            if (taskError) throw taskError;

            // 2. Si tiene receta, cargar sus materiales vinculados
            if (taskData.receta_id) {
                const { data: matsData } = await supabase
                    .from('receta_recursos')
                    .select('*, recursos(*)')
                    .eq('receta_id', taskData.receta_id);
                setMaterialesRequeridos(matsData || []);
            } else {
                setMaterialesRequeridos([]);
            }

            // 3. Cargar Recetas Maestras
            const { data: recetasData } = await supabase.from('recetas_apu').select('*').eq('is_deleted', false);
            
            // 4. Cargar Usuarios
            const { data: usersData } = await supabase.from('usuarios').select('*').eq('is_deleted', false);

            // 5. Cargar Asignaciones
            const { data: assignData } = await supabase
                .from('tarea_personal')
                .select('*, usuarios(*)')
                .eq('tarea_id', id);

            const taskObj = {
                ...taskData,
                projectName: taskData.etapas?.proyectos?.nombre || 'General',
                stageName: taskData.etapas?.nombre || 'S/D'
            };

            setTask(taskObj);
            setEditData(taskObj);
            setRecetas(recetasData || []);
            setUsuarios(usersData || []);
            setAssignments(assignData || []);

        } catch (error) {
            console.error('Error cargando datos:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const { error } = await supabase.from('tareas').update({
                titulo: editData.titulo,
                receta_id: editData.receta_id,
                cantidad_medida: Number(editData.cantidad_medida),
                fecha_inicio_estimada: editData.fecha_inicio_estimada,
                fecha_fin_estimada: editData.fecha_fin_estimada,
                prioridad: editData.prioridad,
                estado: editData.estado
            }).eq('id', id);

            if (error) throw error;
            
            setIsEditing(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            fetchInitialData(false); // Refrescar silenciosamente
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditData(task);
        setIsEditing(false);
    };

    const handleAddAssignment = async (usuarioId) => {
        try {
            const { error } = await supabase.from('tarea_personal').insert({
                tarea_id: id,
                usuario_id: usuarioId,
                horas_asignadas_diarias: 8
            });
            if (error) throw error;
            fetchInitialData(false);
        } catch (error) {
            console.error('Error asignando:', error.message);
        }
    };

    const handleRemoveAssignment = async (assignId) => {
        try {
            const { error } = await supabase.from('tarea_personal').delete().eq('id', assignId);
            if (error) throw error;
            fetchInitialData(false);
        } catch (error) {
            console.error('Error removiendo:', error.message);
        }
    };

    // Cálculos dinámicos de tiempo
    const calculateTimeEstimates = () => {
        const currentTask = isEditing ? editData : task;
        if (!currentTask?.recetas_apu || !currentTask?.cantidad_medida) return null;
        
        const totalHorasHombre = Number(currentTask.cantidad_medida) * Number(currentTask.recetas_apu.rendimiento_mano_obra);
        const personasAsignadas = assignments.length;
        const horasDiaPorPersona = 8;
        
        const diasEstimados = personasAsignadas > 0 
            ? Math.ceil(totalHorasHombre / (personasAsignadas * horasDiaPorPersona))
            : 'S/D';

        return {
            totalHorasHombre,
            diasEstimados,
            cumpleMinimo: personasAsignadas >= (currentTask.recetas_apu.personal_minimo || 1)
        };
    };

    const timeEstimates = calculateTimeEstimates();

    if (loading) return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest text-xs">Sincronizando oficina técnica...</div>;
    if (!task) return <div className="p-8 text-center text-slate-500">Actividad no encontrada.</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Mensaje de Éxito Flotante */}
            {showSuccess && (
                <div className="fixed top-20 right-8 z-[100] animate-in slide-in-from-right duration-300">
                    <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
                        <LucideCheckCircle2 size={20} />
                        <span className="font-bold text-sm">¡Tarea actualizada correctamente!</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <button 
                        onClick={() => navigate('/tareas')}
                        className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors mb-2"
                    >
                        <LucideChevronLeft size={14} /> Gestión de Tareas
                    </button>
                    <div className="flex items-center gap-3">
                        {isEditing ? (
                            <input 
                                className="text-3xl font-black text-slate-900 dark:text-white leading-none bg-white dark:bg-slate-800 border-2 border-primary/20 rounded-xl px-2 py-1 w-full outline-none focus:border-primary"
                                value={editData.titulo}
                                onChange={(e) => setEditData({...editData, titulo: e.target.value})}
                            />
                        ) : (
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-none">{task.titulo}</h1>
                        )}
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
                                Guardar Cambios
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2"
                        >
                            <LucideEdit3 size={16} /> Editar Actividad
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Configuración Técnica (APU) */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <LucideArchitecture className="text-primary" size={20} />
                            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Análisis de Rubro</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Rubro Maestro (APU)</label>
                                {isEditing ? (
                                    <select 
                                        className="select-custom !ring-1"
                                        value={editData.receta_id || ''}
                                        onChange={(e) => {
                                            const selectedReceta = recetas.find(r => r.id === e.target.value);
                                            setEditData({
                                                ...editData, 
                                                receta_id: e.target.value,
                                                recetas_apu: selectedReceta // Actualizar para el estimador
                                            });
                                        }}
                                    >
                                        <option value="">Seleccionar Rubro...</option>
                                        {recetas.map(r => (
                                            <option key={r.id} value={r.id}>{r.nombre} ({r.unidad_medida})</option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="text-sm font-bold text-slate-700 dark:text-white bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                                        {task.recetas_apu?.nombre || 'Sin rubro asignado'}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">
                                    Cantidad a Ejecutar ({isEditing ? (editData.recetas_apu?.unidad_medida || 'u') : (task.recetas_apu?.unidad_medida || 'u')})
                                </label>
                                {isEditing ? (
                                    <input 
                                        type="number"
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-white outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary/20"
                                        value={editData.cantidad_medida || ''}
                                        placeholder="0.00"
                                        onChange={(e) => setEditData({...editData, cantidad_medida: e.target.value})}
                                    />
                                ) : (
                                    <p className="text-sm font-bold text-slate-700 dark:text-white bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                                        {task.cantidad_medida || '0.00'}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Estimador de Tiempo */}
                        {timeEstimates && (
                            <div className="mt-8 p-6 rounded-2xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <LucideClock size={80} />
                                </div>
                                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Plazo Estimado</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-black text-primary">{timeEstimates.diasEstimados}</span>
                                            <span className="text-lg font-bold text-slate-300">Días Hábiles</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-2">Basado en {timeEstimates.totalHorasHombre} horas-hombre totales.</p>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        {!timeEstimates.cumpleMinimo && (
                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                                                <LucideAlertTriangle size={20} />
                                                <p className="text-xs font-bold">Personal insuficiente: Este rubro requiere mín. {(isEditing ? editData : task).recetas_apu.personal_minimo} personas.</p>
                                            </div>
                                        )}
                                        {timeEstimates.cumpleMinimo && assignments.length > 0 && (
                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                                <LucideCheckCircle2 size={20} />
                                                <p className="text-xs font-bold">Dotación de equipo óptima.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cómputo de Materiales Requeridos */}
                    {task.receta_id && (
                        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <LucidePackage className="text-emerald-500" size={20} />
                                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Cómputo de Materiales</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {materialesRequeridos.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic col-span-full">No hay materiales vinculados a este rubro.</p>
                                ) : (
                                    materialesRequeridos.map(m => {
                                        const qty = isEditing ? Number(editData.cantidad_medida) : Number(task.cantidad_medida);
                                        const cantidadTotal = (qty || 0) * Number(m.cantidad_por_unidad) * (Number(m.coeficiente_desperdicio) || 1);
                                        return (
                                            <div key={m.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 rounded-lg">
                                                        <LucideBox size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{m.recursos?.nombre_interno}</p>
                                                        <p className="text-[10px] text-slate-400 font-black uppercase">Consumo: {m.cantidad_por_unidad} / {task.recetas_apu?.unidad_medida}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-slate-900 dark:text-white">{Math.ceil(cantidadTotal * 100) / 100}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{m.recursos?.unit_base}</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    {/* Asignación de Equipo */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <LucideUsers className="text-primary" size={18} />
                                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Mano de Obra</h3>
                            </div>
                            <span className="text-xs font-black text-slate-400">{assignments.length} ASIGNADOS</span>
                        </div>

                        <div className="space-y-3">
                            {assignments.map(assign => (
                                <div key={assign.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black">
                                            {assign.usuarios?.nombre?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{assign.usuarios?.nombre || 'Usuario'}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">8h / día</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleRemoveAssignment(assign.id)}
                                        className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <LucideTrash2 size={16} />
                                    </button>
                                </div>
                            ))}

                            <div className="pt-4">
                                <select 
                                    className="select-custom shadow-none border-2 border-dashed !ring-0"
                                    onChange={(e) => {
                                        if (e.target.value) handleAddAssignment(e.target.value);
                                        e.target.value = '';
                                    }}
                                >
                                    <option value="">+ Asignar Integrante</option>
                                    {usuarios.filter(u => !assignments.some(a => a.usuario_id === u.id)).map(u => (
                                        <option key={u.id} value={u.id}>{u.nombre || u.identificador_usuario}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Sidebar */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">Fechas Clave</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg">
                                    <LucideCalendar size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Inicio Estimado</p>
                                    {isEditing ? (
                                        <input 
                                            type="date"
                                            className="w-full text-sm font-bold bg-slate-50 dark:bg-slate-800 p-2 rounded-lg outline-none ring-1 ring-primary/10 focus:ring-primary text-slate-700 dark:text-white"
                                            value={editData.fecha_inicio_estimada || ''}
                                            onChange={(e) => setEditData({...editData, fecha_inicio_estimada: e.target.value })}
                                        />
                                    ) : (
                                        <p className="text-sm font-bold text-slate-700 dark:text-white">{task.fecha_inicio_estimada || 'Pendiente'}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-lg">
                                    <LucideCheckCircle2 size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Cierre Estimado</p>
                                    {isEditing ? (
                                        <input 
                                            type="date"
                                            className="w-full text-sm font-bold bg-slate-50 dark:bg-slate-800 p-2 rounded-lg outline-none ring-1 ring-primary/10 focus:ring-primary text-slate-700 dark:text-white"
                                            value={editData.fecha_fin_estimada || ''}
                                            onChange={(e) => setEditData({...editData, fecha_fin_estimada: e.target.value })}
                                        />
                                    ) : (
                                        <p className="text-sm font-bold text-slate-700 dark:text-white">{task.fecha_fin_estimada || 'Pendiente'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;

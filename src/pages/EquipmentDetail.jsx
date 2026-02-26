import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getMediaUrl, uploadMedia } from '../lib/storage';
import { 
    LucideSettings, LucideAlertCircle, LucideHistory, 
    LucideUserCheck, LucideInfo, LucideCalendar, LucideMapPin,
    LucideCamera, LucideLoader2, LucideEdit3, LucideSave, LucideX,
    LucideChevronLeft, LucideTrash2
} from 'lucide-react';

const EquipmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [editData, setEditData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchEquipmentDetail();
    }, [id]);

    const fetchEquipmentDetail = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('equipos_fisicos')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            setItem(data);
            setEditData(data);
        } catch (error) {
            console.error('Error cargando detalle de equipo:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const { error } = await supabase
                .from('equipos_fisicos')
                .update({
                    nombre: editData.nombre,
                    modelo: editData.modelo,
                    codigo: editData.codigo,
                    horas_acumuladas: Number(editData.horas_acumuladas),
                    horas_mantenimiento_limite: Number(editData.horas_mantenimiento_limite),
                    estado: editData.estado
                })
                .eq('id', id);

            if (error) throw error;

            setItem(editData);
            setIsEditing(false);
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditData(item);
        setIsEditing(false);
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const filePath = await uploadMedia(file, 'equipment', id);

            const { error } = await supabase
                .from('equipos_fisicos')
                .update({ imagen_path: filePath })
                .eq('id', id);

            if (error) throw error;

            setItem(prev => ({ ...prev, imagen_path: filePath }));
            setEditData(prev => ({ ...prev, imagen_path: filePath }));
        } catch (error) {
            alert('Error al subir la imagen: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) return <div className="p-8 text-center uppercase tracking-widest text-xs font-bold text-slate-500">Cargando ficha técnica...</div>;
    if (!item) return <div className="p-8">Equipamiento no encontrado</div>;

    const displayImage = getMediaUrl(item.imagen_path) || item.imagen || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=400';
    const usagePercent = Math.min(((item.horas_acumuladas || 0) / (item.horas_mantenimiento_limite || 2000)) * 100, 100);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />

            {/* Header Profesional */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <button 
                        onClick={() => navigate('/recursos-equipos')}
                        className="flex items-center gap-1 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors mb-2"
                    >
                        <LucideChevronLeft size={14} /> Volver al Catálogo
                    </button>
                    <div className="flex items-center gap-3">
                        {isEditing ? (
                            <input 
                                className="text-3xl font-black text-slate-900 dark:text-white leading-none bg-white dark:bg-slate-800 border-2 border-primary/20 rounded-xl px-2 py-1 w-full outline-none focus:border-primary"
                                value={editData.nombre}
                                onChange={(e) => setEditData({...editData, nombre: e.target.value})}
                            />
                        ) : (
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white truncate">{item.nombre}</h1>
                        )}
                        <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${
                            item.estado === 'uso' ? 'bg-blue-100 text-blue-700' :
                            item.estado === 'mantenimiento' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                            {item.estado || 'Disponible'}
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
                                Guardar Ficha
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2"
                        >
                            <LucideEdit3 size={16} /> Editar Equipamiento
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Panel Lateral: Imagen y Uso */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm relative group">
                        <img src={displayImage} alt={item.nombre} className="w-full h-64 object-cover" />
                        {isEditing && (
                            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-bold shadow-xl flex items-center gap-2 hover:scale-105 transition-all"
                                >
                                    {isUploading ? <LucideLoader2 className="animate-spin" size={14} /> : <LucideCamera size={14} />}
                                    {isUploading ? 'Subiendo...' : 'Cambiar Imagen'}
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Horas de Operación</h3>
                        <div className="mb-4 flex items-end gap-2">
                            {isEditing ? (
                                <input 
                                    type="number"
                                    className="text-4xl font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 w-full p-2 rounded-xl border-2 border-primary/10 outline-none focus:border-primary"
                                    value={editData.horas_acumuladas}
                                    onChange={(e) => setEditData({...editData, horas_acumuladas: e.target.value})}
                                />
                            ) : (
                                <span className="text-4xl font-black text-slate-900 dark:text-white">{(item.horas_acumuladas || 0).toLocaleString()}</span>
                            )}
                            <span className="text-slate-500 uppercase text-xs font-black mb-2">hrs</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 mb-2">
                            <div className={`h-2.5 rounded-full ${usagePercent > 80 ? 'bg-red-500' : 'bg-sky-500'}`} style={{ width: `${usagePercent}%` }}></div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Uso: {usagePercent.toFixed(1)}% del ciclo de vida</p>
                    </div>
                </div>

                {/* Panel Central: Datos Técnicos */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Especificaciones de Maquinaria</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Modelo / Serie</label>
                                    {isEditing ? (
                                        <input 
                                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-bold border-none outline-none ring-2 ring-primary/10 focus:ring-primary"
                                            value={editData.modelo || ''}
                                            onChange={(e) => setEditData({...editData, modelo: e.target.value})}
                                        />
                                    ) : (
                                        <p className="text-sm font-bold text-slate-700 dark:text-white uppercase">{item.modelo || 'S/D'}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Identificador (ID)</label>
                                    {isEditing ? (
                                        <input 
                                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-bold border-none outline-none ring-2 ring-primary/10 focus:ring-primary"
                                            value={editData.codigo || ''}
                                            onChange={(e) => setEditData({...editData, codigo: e.target.value})}
                                        />
                                    ) : (
                                        <p className="text-sm font-mono font-bold text-slate-500 uppercase">{item.codigo || 'EQ-N/A'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Límite para Mantenimiento</label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <input 
                                                type="number"
                                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-bold border-none outline-none ring-2 ring-primary/10 focus:ring-primary"
                                                value={editData.horas_mantenimiento_limite}
                                                onChange={(e) => setEditData({...editData, horas_mantenimiento_limite: e.target.value})}
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">HRS</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <LucideHistory size={16} className="text-amber-500" />
                                            <p className="text-sm font-bold text-slate-700 dark:text-white">{item.horas_mantenimiento_limite || 2000} hrs</p>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Estado Operativo</label>
                                    {isEditing ? (
                                        <select 
                                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-bold border-none outline-none ring-2 ring-primary/10 focus:ring-primary"
                                            value={editData.estado}
                                            onChange={(e) => setEditData({...editData, estado: e.target.value})}
                                        >
                                            <option value="disponible">Disponible</option>
                                            <option value="uso">En Uso</option>
                                            <option value="mantenimiento">En Mantenimiento</option>
                                        </select>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <LucideUserCheck size={16} className="text-primary" />
                                            <p className="text-sm font-bold text-slate-700 dark:text-white uppercase">{item.estado}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mantenimiento y Ubicación */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ubicación Actual</h3>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <LucideMapPin size={20} className="text-red-500" />
                                <span className="text-sm font-bold">Depósito Central - Sector A</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Último Service</h3>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <LucideCalendar size={20} className="text-emerald-500" />
                                <span className="text-sm font-bold">{item.fecha_mantenimiento ? new Date(item.fecha_mantenimiento).toLocaleDateString() : 'Pendiente'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentDetail;

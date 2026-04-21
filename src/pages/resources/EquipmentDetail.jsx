import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getMediaUrl, uploadMedia } from '../../lib/storage';
import EquipmentTechPanel from '../../components/resources/detail/EquipmentTechPanel';
import { 
    LucideEdit3, LucideSave, LucideX, LucideCamera, LucideCrosshair, LucideClock, LucideAlertTriangle, LucideCheckCircle2, LucideSettings, LucideHistory
} from 'lucide-react';

const EquipmentDetail = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [editData, setEditData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const imageContainerRef = useRef(null);

    useEffect(() => {
        fetchEquipmentDetail();
    }, [id]);

    const fetchEquipmentDetail = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('equipos_fisicos').select('*').eq('id', id).single();
            if (error) throw error;
            const equipmentObj = { ...data, progress: 65, foto_focal_point: data.foto_focal_point || '50% 50%' };
            setItem(equipmentObj);
            setEditData(equipmentObj);
        } catch (error) {
            console.error('Error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const { error } = await supabase.from('equipos_fisicos').update({
                nombre: editData.nombre,
                modelo: editData.modelo,
                codigo: editData.codigo,
                estado: editData.estado,
                horas_mantenimiento_limite: editData.horas_mantenimiento_limite,
                foto_focal_point: editData.foto_focal_point
            }).eq('id', id);
            if (error) throw error;
            setIsEditing(false);
            fetchEquipmentDetail();
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        }
    };

    const handleImageClick = (e) => {
        if (!isEditing || isUploading) return;
        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setEditData({ ...editData, foto_focal_point: `${Math.round(x)}% ${Math.round(y)}%` });
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
            setIsUploading(true);
            const filePath = await uploadMedia(file, 'equipment', id);
            const { error } = await supabase.from('equipos_fisicos').update({ imagen_path: filePath }).eq('id', id);
            if (error) throw error;
            fetchEquipmentDetail();
        } catch (error) {
            alert('Error al subir la imagen: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    if (loading && !item) return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest text-xs">Sincronizando ficha de maquinaria...</div>;
    if (!item) return <div className="p-8">Equipo no encontrado</div>;

    const displayImage = getMediaUrl(item.imagen_path) || item.imagen || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=400';

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                    <nav className="flex mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <Link to="/recursos-equipos" className="hover:text-primary transition-colors">Maquinaria</Link>
                        <span className="mx-2">/</span>
                        <span className="text-primary">Perfil de Activo</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        {isEditing ? (
                            <input 
                                className="text-3xl font-black text-slate-900 dark:text-white leading-none bg-white dark:bg-slate-800 border-2 border-primary/20 rounded-xl px-2 py-1 w-full outline-none focus:border-primary"
                                value={editData.nombre}
                                onChange={(e) => setEditData({...editData, nombre: e.target.value})}
                                autoFocus
                            />
                        ) : (
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-none uppercase tracking-tight">{item.nombre}</h1>
                        )}
                    </div>
                </div>
                <div className="flex gap-3">
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2"><LucideX size={16} /> Cancelar</button>
                            <button onClick={handleSave} className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"><LucideSave size={16} /> Guardar</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2"><LucideEdit3 size={16} /> Editar</button>
                            <button className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-primary rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2"><LucideHistory size={16} /> Historial</button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-6">
                    <div 
                        ref={imageContainerRef}
                        onClick={handleImageClick}
                        className={`bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm relative group ${isEditing ? 'cursor-crosshair ring-2 ring-primary ring-offset-4' : ''}`}
                    >
                        <img 
                            src={displayImage} 
                            alt={item.nombre} 
                            className="w-full h-64 object-cover transition-all duration-300"
                            style={{ objectPosition: isEditing ? editData.foto_focal_point : item.foto_focal_point }} 
                        />
                        {isEditing && (
                            <div className="absolute inset-0 flex flex-col items-center justify-between p-4 pointer-events-none">
                                <div className="bg-primary text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 animate-bounce mt-2"><LucideCrosshair size={12} /> Re-focalizar</div>
                                <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="bg-white/90 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-xl text-xs font-black shadow-xl flex items-center gap-2 hover:scale-105 transition-all pointer-events-auto mb-2"><LucideCamera size={14} /> Reemplazar Foto</button>
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex justify-between items-center">Monitor de Ciclo de Vida <LucideClock size={14} /></h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Uso Acumulado</p>
                                    <p className="text-xl font-black text-slate-900 dark:text-white">1,240 <span className="text-[10px] text-slate-400">HRS</span></p>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
                                <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Prox. Service</p><p className="text-xs font-bold text-amber-600">260 hrs</p></div>
                                <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Eficiencia</p><p className="text-xs font-bold text-emerald-600">94%</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl"><LucideSettings size={24} /></div>
                            <div><p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Última Revisión</p><p className="text-sm font-bold text-slate-900 dark:text-white">12 Oct, 2023</p></div>
                        </div>
                        <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl"><LucideCheckCircle2 size={24} /></div>
                            <div><p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Salud del Motor</p><p className="text-sm font-bold text-slate-900 dark:text-white">Óptima (98%)</p></div>
                        </div>
                    </div>

                    <EquipmentTechPanel 
                        item={item}
                        editData={editData}
                        setEditData={setEditData}
                        isEditing={isEditing}
                    />

                    <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/20 flex items-start gap-4">
                        <LucideAlertTriangle className="text-amber-500 shrink-0" size={24} />
                        <div>
                            <h4 className="text-sm font-black text-amber-800 dark:text-amber-400 uppercase tracking-tight mb-1">Atención Preventiva</h4>
                            <p className="text-xs text-amber-700/80 dark:text-amber-500/80 font-medium leading-relaxed">El sistema detectó una vibración inusual en el tren motriz durante la última jornada. Se recomienda inspección visual antes del próximo despliegue.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentDetail;

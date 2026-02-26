import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getMediaUrl, uploadMedia } from '../lib/storage';
import { 
    LucidePackage, LucideMapPin, LucideAlertTriangle, 
    LucideHistory, LucideSettings, LucideInfo, LucideTag,
    LucidePlus, LucideTrash2, LucideLayers, LucideScale,
    LucideEdit3, LucideSave, LucideX, LucideCamera, LucideLoader2
} from 'lucide-react';

const MaterialDetail = () => {
    const { id } = useParams();
    const [material, setMaterial] = useState(null);
    const [editData, setEditData] = useState(null);
    const [presentaciones, setPresentaciones] = useState([]);
    const [unidades, setUnidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showNewPres, setShowNewPres] = useState(false);
    const [newPres, setNewPres] = useState({ nombre: '', unidad_id: '', cantidad_en_unidad_base: 1 });
    const fileInputRef = useRef(null);

    const TIPOS_MEDIDA = [
        { id: 'masa', label: 'Peso (kg, g, tn)', icon: LucideScale },
        { id: 'volumen', label: 'Volumen (m3, lt)', icon: LucideLayers },
        { id: 'longitud', label: 'Longitud (m, ml)', icon: LucideInfo },
        { id: 'conteo', label: 'Unidad (un, u)', icon: LucidePackage }
    ];

    useEffect(() => {
        fetchMaterialDetail();
    }, [id]);

    const fetchMaterialDetail = async () => {
        try {
            setLoading(true);
            // 1. Cargar datos del material
            const { data, error } = await supabase
                .from('recursos')
                .select(`
                    *,
                    stock_actual (
                        cantidad_disponible,
                        proyectos (nombre)
                    )
                `)
                .eq('id', id)
                .single();

            if (error) throw error;

            // 2. Cargar presentaciones
            const { data: presData } = await supabase
                .from('recurso_presentaciones')
                .select('*, unidades_medida(*)')
                .eq('recurso_id', id)
                .eq('is_deleted', false);

            // 3. Cargar todas las unidades para el selector filtrado
            const { data: unitsData } = await supabase
                .from('unidades_medida')
                .select('*')
                .order('nombre');

            const stockTotal = data.stock_actual?.reduce((acc, s) => acc + (Number(s.cantidad_disponible) || 0), 0) || 0;

            const materialObj = {
                ...data,
                stockTotal,
                progress: Math.min((stockTotal / 1000) * 100, 100)
            };

            setMaterial(materialObj);
            setEditData(materialObj);
            setPresentaciones(presData || []);
            setUnidades(unitsData || []);
            
            if (unitsData?.length > 0) {
                setNewPres(prev => ({ ...prev, unidad_id: unitsData.find(u => u.simbolo === data.unidad_base)?.id || unitsData[0].id }));
            }

        } catch (error) {
            console.error('Error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const { error } = await supabase
                .from('recursos')
                .update({
                    nombre_interno: editData.nombre_interno,
                    sku: editData.sku,
                    ubicacion: editData.ubicacion,
                    descripcion: editData.descripcion,
                    unidad_base: editData.unidad_base,
                    categoria: editData.categoria,
                    tipo_medida: editData.tipo_medida
                })
                .eq('id', id);
            
            if (error) throw error;
            setMaterial(editData);
            setIsEditing(false);
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        }
    };

    const handleCancel = () => {
        setEditData(material);
        setIsEditing(false);
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const filePath = await uploadMedia(file, 'materials', id);

            // Actualizar en DB (usando la columna imagen_path según la migración del DBA)
            const { error } = await supabase
                .from('recursos')
                .update({ imagen_path: filePath })
                .eq('id', id);

            if (error) throw error;

            // Actualizamos localmente
            setMaterial(prev => ({ ...prev, imagen_path: filePath }));
            setEditData(prev => ({ ...prev, imagen_path: filePath }));
        } catch (error) {
            alert('Error al subir la imagen: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddPresentation = async () => {
        try {
            const { error } = await supabase
                .from('recurso_presentaciones')
                .insert([{ ...newPres, recurso_id: id }]);
            
            if (error) throw error;
            setShowNewPres(false);
            fetchMaterialDetail();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDeletePresentation = async (presId) => {
        try {
            const { error } = await supabase
                .from('recurso_presentaciones')
                .update({ is_deleted: true })
                .eq('id', presId);
            if (error) throw error;
            fetchMaterialDetail();
        } catch (error) {
            console.error(error.message);
        }
    };

    if (loading) return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest text-xs">Abriendo ficha técnica...</div>;
    if (!material) return <div className="p-8">Material no encontrado</div>;

    const currentUnits = unidades.filter(u => u.tipo === editData.tipo_medida);
    
    // Obtener la URL de visualización (priorizar path de storage si existe)
    const displayImage = getMediaUrl(material.imagen_path) || material.imagen || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=400';

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Input oculto para subida de archivos */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                    <nav className="flex mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <Link to="/recursos-materiales" className="hover:text-primary transition-colors">Materiales</Link>
                        <span className="mx-2">/</span>
                        <span className="text-primary">Ficha Técnica</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        {isEditing ? (
                            <input 
                                className="text-3xl font-black text-slate-900 dark:text-white leading-none bg-white dark:bg-slate-800 border-2 border-primary/20 rounded-xl px-2 py-1 w-full outline-none focus:border-primary"
                                value={editData.nombre_interno}
                                onChange={(e) => setEditData({...editData, nombre_interno: e.target.value})}
                                autoFocus
                            />
                        ) : (
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-none">{material.nombre_interno}</h1>
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
                                className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                            >
                                <LucideSave size={16} /> Guardar Cambios
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2"
                            >
                                <LucideEdit3 size={16} /> Editar Ficha
                            </button>
                            <button className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-primary rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">+ Ajustar Stock</button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lateral: Info General */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm relative group">
                        <img src={displayImage} alt={material.nombre_interno} className="w-full h-64 object-cover" />
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
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Estado de Inventario</h3>
                        <div className="mb-4">
                            <span className="text-4xl font-black text-slate-900 dark:text-white">{material.stockTotal.toLocaleString()}</span>
                            <span className="ml-2 text-slate-500 uppercase text-xs font-black">{material.unidad_base}</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 mb-6">
                            <div className={`h-2.5 rounded-full ${material.stockTotal < 100 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${material.progress}%` }}></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">SKU Maestro</p>
                                {isEditing ? (
                                    <input 
                                        className="text-xs font-black text-slate-700 dark:text-white uppercase bg-slate-50 dark:bg-slate-800 p-2 rounded-lg w-full border-2 border-primary/10 outline-none focus:border-primary"
                                        value={editData.sku || ''}
                                        placeholder="Sin SKU"
                                        onChange={(e) => setEditData({...editData, sku: e.target.value})}
                                    />
                                ) : (
                                    <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">{material.sku || 'S/D'}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Ubicación</p>
                                {isEditing ? (
                                    <input 
                                        className="text-xs font-black text-slate-700 dark:text-white uppercase bg-slate-50 dark:bg-slate-800 p-2 rounded-lg w-full border-2 border-primary/10 outline-none focus:border-primary"
                                        value={editData.ubicacion || ''}
                                        placeholder="Ej: DEPÓSITO"
                                        onChange={(e) => setEditData({...editData, ubicacion: e.target.value})}
                                    />
                                ) : (
                                    <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">{material.ubicacion || 'ALMACÉN'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Principal: Presentaciones y Detalles */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Sección de Presentaciones */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <LucideLayers className="text-primary" size={20} />
                                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-sm">Presentaciones de Compra</h3>
                            </div>
                            <button 
                                onClick={() => setShowNewPres(true)}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-[10px] font-black uppercase"
                            >
                                <LucidePlus size={14} /> Nueva Presentación
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                                    <tr>
                                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Empaque / Nombre</th>
                                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Contenido Neto</th>
                                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {presentaciones.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-10 text-center text-slate-400 text-xs font-bold uppercase italic">
                                                No hay presentaciones de empaque definidas.
                                            </td>
                                        </tr>
                                    ) : presentaciones.map(pres => (
                                        <tr key={pres.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400">
                                                        <LucidePackage size={16} />
                                                    </div>
                                                    <span className="text-sm font-black text-slate-700 dark:text-slate-200">{pres.nombre}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full">
                                                    <span className="text-sm font-black text-primary">{pres.cantidad_en_unidad_base}</span>
                                                    <span className="text-[10px] font-bold text-primary/60 uppercase">{material.unidad_base}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleDeletePresentation(pres.id)}
                                                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                                >
                                                    <LucideTrash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {showNewPres && (
                            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom-2">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                    <div className="md:col-span-1">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 text-xs">Nombre (Ej: Bolsa 50kg)</label>
                                        <input 
                                            className="w-full p-2.5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-lg text-sm font-bold shadow-sm focus:ring-1 focus:ring-primary outline-none"
                                            onChange={(e) => setNewPres({...newPres, nombre: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 text-xs">Cantidad en {material.unidad_base}</label>
                                        <input 
                                            type="number"
                                            className="w-full p-2.5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-lg text-sm font-bold shadow-sm focus:ring-1 focus:ring-primary outline-none"
                                            onChange={(e) => setNewPres({...newPres, cantidad_en_unidad_base: e.target.value})}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={handleAddPresentation}
                                            className="flex-1 bg-primary text-white p-2.5 rounded-lg text-[10px] font-black uppercase shadow-lg shadow-primary/20 transition-all active:scale-95"
                                        >
                                            Guardar
                                        </button>
                                        <button 
                                            onClick={() => setShowNewPres(false)}
                                            className="bg-white dark:bg-slate-900 text-slate-400 p-2.5 rounded-lg text-[10px] font-black uppercase border border-slate-200 dark:border-slate-700"
                                        >
                                            X
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Especificaciones Técnicas */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Especificaciones Técnicas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Descripción General</p>
                                    {isEditing ? (
                                        <textarea 
                                            className="w-full text-sm text-slate-700 dark:text-white leading-relaxed bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-2 border-primary/10 outline-none focus:border-primary min-h-[120px]"
                                            value={editData.descripcion || ''}
                                            placeholder="Añadir especificaciones técnicas..."
                                            onChange={(e) => setEditData({...editData, descripcion: e.target.value})}
                                        />
                                    ) : (
                                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl">{material.descripcion || 'Sin descripción técnica.'}</p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Tipo de Medida</label>
                                        {isEditing ? (
                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                {TIPOS_MEDIDA.map(tipo => (
                                                    <button 
                                                        key={tipo.id}
                                                        onClick={() => setEditData({...editData, tipo_medida: tipo.id, unidad_base: unidades.find(u => u.tipo === tipo.id && u.es_base)?.simbolo || ''})}
                                                        className={`flex items-center gap-2 p-2 rounded-lg text-[10px] font-black uppercase border-2 transition-all ${
                                                            editData.tipo_medida === tipo.id 
                                                            ? 'border-primary bg-primary/5 text-primary' 
                                                            : 'border-slate-100 dark:border-slate-700 text-slate-400'
                                                        }`}
                                                    >
                                                        <tipo.icon size={14} />
                                                        {tipo.label.split(' ')[0]}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-white uppercase">
                                                <LucideScale size={16} className="text-primary" />
                                                {TIPOS_MEDIDA.find(t => t.id === material.tipo_medida)?.label || 'CONTEO'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Unidad de Gestión</label>
                                        {isEditing ? (
                                            <select 
                                                className="w-full bg-white dark:bg-slate-900 border-2 border-primary/10 rounded-lg text-sm font-black text-primary p-2 outline-none focus:border-primary cursor-pointer hover:border-primary/40 transition-all"
                                                value={editData.unidad_base || ''}
                                                onChange={(e) => setEditData({...editData, unidad_base: e.target.value})}
                                            >
                                                <option value="" disabled>Seleccionar unidad...</option>
                                                {unidades.filter(u => u.tipo === editData.tipo_medida).map(u => (
                                                    <option key={u.id} value={u.simbolo}>{u.nombre} ({u.simbolo})</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <p className="text-sm font-black text-primary uppercase">{material.unidad_base}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Categoría</label>
                                        {isEditing ? (
                                            <select 
                                                className="w-full bg-white dark:bg-slate-900 border-2 border-primary/10 rounded-lg text-sm font-black text-slate-700 dark:text-white p-2 outline-none focus:border-primary"
                                                value={editData.categoria || ''}
                                                onChange={(e) => setEditData({...editData, categoria: e.target.value})}
                                            >
                                                <option value="OBRA GRUESA">OBRA GRUESA</option>
                                                <option value="TERMINACIONES">TERMINACIONES</option>
                                                <option value="INSTALACIONES">INSTALACIONES</option>
                                                <option value="HERRAMIENTAS">HERRAMIENTAS</option>
                                                <option value="OTROS">OTROS</option>
                                            </select>
                                        ) : (
                                            <p className="text-sm font-black text-slate-700 dark:text-white uppercase">{material.categoria || 'GENERAL'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaterialDetail;

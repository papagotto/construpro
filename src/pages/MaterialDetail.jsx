import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getMediaUrl, uploadMedia } from '../lib/storage';
import { 
    LucidePackage, LucideMapPin, LucideAlertTriangle, 
    LucideHistory, LucideSettings, LucideInfo, LucideTag,
    LucidePlus, LucideTrash2, LucideLayers, LucideScale,
    LucideEdit3, LucideSave, LucideX, LucideCamera, LucideLoader2,
    LucideTruck, LucideArrowRightLeft, LucideCrosshair, LucideLayoutGrid
} from 'lucide-react';

const MaterialDetail = () => {
    const { id } = useParams();
    const [material, setMaterial] = useState(null);
    const [editData, setEditData] = useState(null);
    const [presentaciones, setPresentaciones] = useState([]);
    const [unidades, setUnidades] = useState([]);
    const [ubicacionesStock, setUbicacionesStock] = useState([]);
    const [todasUbicaciones, setTodasUbicaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showNewPres, setShowNewPres] = useState(false);
    const [showAdjustStock, setShowAdjustStock] = useState(false);
    const [newPres, setNewPres] = useState({ nombre: '', unidad_id: '', cantidad_en_unidad_base: 1 });
    const [adjustStockData, setAdjustStockData] = useState({ ubicacion_id: '', cantidad: 0, tipo: 'entrada' });
    const fileInputRef = useRef(null);
    const imageContainerRef = useRef(null);

    const TIPOS_MEDIDA = [
        { id: 'masa', label: 'Peso (kg, g, tn)', icon: LucideScale },
        { id: 'volumen', label: 'Volumen (m3, lt)', icon: LucideLayers },
        { id: 'superficie', label: 'Área (m2, ha)', icon: LucideLayoutGrid },
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
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            // 2. Cargar stock por ubicación
            const { data: stockData } = await supabase
                .from('stock_por_ubicacion')
                .select('*, ubicaciones(*)')
                .eq('recurso_id', id);

            // 3. Cargar todas las ubicaciones disponibles para ajustes
            const { data: locsData } = await supabase
                .from('ubicaciones')
                .select('*')
                .eq('is_active', true);

            // 4. Cargar presentaciones
            const { data: presData } = await supabase
                .from('recurso_presentaciones')
                .select('*, unidades_medida(*)')
                .eq('recurso_id', id)
                .eq('is_deleted', false);

            // 5. Cargar todas las unidades
            const { data: unitsData } = await supabase
                .from('unidades_medida')
                .select('*')
                .order('nombre');

            const stockTotal = stockData?.reduce((acc, s) => acc + (Number(s.cantidad_actual) || 0), 0) || 0;

            const materialObj = {
                ...data,
                stockTotal,
                progress: Math.min((stockTotal / 1000) * 100, 100),
                foto_focal_point: data.foto_focal_point || '50% 50%'
            };

            setMaterial(materialObj);
            setEditData(materialObj);
            setUbicacionesStock(stockData || []);
            setTodasUbicaciones(locsData || []);
            setPresentaciones(presData || []);
            setUnidades(unitsData || []);
            
            if (unitsData?.length > 0) {
                setNewPres(prev => ({ ...prev, unidad_id: unitsData.find(u => u.simbolo === data.unidad_base)?.id || unitsData[0].id }));
            }

            if (locsData?.length > 0) {
                setAdjustStockData(prev => ({ ...prev, ubicacion_id: locsData[0].id }));
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
                    descripcion: editData.descripcion,
                    unidad_base: editData.unidad_base,
                    categoria: editData.categoria,
                    tipo_medida: editData.tipo_medida,
                    foto_focal_point: editData.foto_focal_point
                })
                .eq('id', id);
            
            if (error) throw error;
            setMaterial(editData);
            setIsEditing(false);
            // Refrescar datos para asegurar consistencia
            fetchMaterialDetail();
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        }
    };

    const handleTypeChange = (tipoId) => {
        // Al cambiar el tipo (ej: de masa a volumen), buscamos la unidad base de ese nuevo tipo
        const defaultUnit = unidades.find(u => u.tipo === tipoId && u.es_base)?.simbolo || 
                          unidades.find(u => u.tipo === tipoId)?.simbolo || '';
        
        setEditData({
            ...editData, 
            tipo_medida: tipoId,
            unidad_base: defaultUnit
        });
    };

    const handleAdjustStock = async () => {
        try {
            setLoading(true);
            const { ubicacion_id, cantidad, tipo } = adjustStockData;
            const factor = tipo === 'entrada' ? 1 : -1;
            const diff = Number(cantidad) * factor;

            const currentStock = ubicacionesStock.find(s => s.ubicacion_id === ubicacion_id)?.cantidad_actual || 0;
            const newStock = Number(currentStock) + diff;

            const { error } = await supabase
                .from('stock_por_ubicacion')
                .upsert({
                    recurso_id: id,
                    ubicacion_id: ubicacion_id,
                    cantidad_actual: newStock,
                    updated_at: new Date()
                }, { onConflict: 'recurso_id,ubicacion_id' });

            if (error) throw error;
            
            setShowAdjustStock(false);
            setAdjustStockData({ ...adjustStockData, cantidad: 0 });
            fetchMaterialDetail();
        } catch (error) {
            alert('Error ajustando stock: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditData(material);
        setIsEditing(false);
    };

    const handleImageClick = (e) => {
        if (!isEditing || isUploading) return;
        
        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        const focalPoint = `${Math.round(x)}% ${Math.round(y)}%`;
        setEditData({ ...editData, foto_focal_point: focalPoint });
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const filePath = await uploadMedia(file, 'materials', id);

            const { error } = await supabase
                .from('recursos')
                .update({ imagen_path: filePath })
                .eq('id', id);

            if (error) throw error;

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

    if (loading && !material) return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest text-xs">Sincronizando inventario técnico...</div>;
    if (!material) return <div className="p-8">Recurso no encontrado</div>;

    const displayImage = getMediaUrl(material.imagen_path) || material.imagen || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=400';

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                    <nav className="flex mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <Link to="/recursos-materiales" className="hover:text-primary transition-colors">Inventario</Link>
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
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-none uppercase tracking-tight">{material.nombre_interno}</h1>
                        )}
                    </div>
                </div>
                <div className="flex gap-3">
                    {isEditing ? (
                        <>
                            <button onClick={handleCancel} className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2">
                                <LucideX size={16} /> Cancelar
                            </button>
                            <button onClick={handleSave} className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2">
                                <LucideSave size={16} /> Guardar
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2">
                                <LucideEdit3 size={16} /> Editar
                            </button>
                            <button 
                                onClick={() => setShowAdjustStock(true)}
                                className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-primary rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                            >
                                <LucidePlus size={16} /> Ajustar Inventario
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lateral: Info General e Imagen */}
                <div className="space-y-6">
                    <div 
                        ref={imageContainerRef}
                        onClick={handleImageClick}
                        className={`bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm relative group ${isEditing ? 'cursor-crosshair ring-2 ring-primary ring-offset-4' : ''}`}
                    >
                        <img 
                            src={displayImage} 
                            alt={material.nombre_interno} 
                            className="w-full h-64 object-cover transition-all duration-300"
                            style={{ objectPosition: isEditing ? editData.foto_focal_point : material.foto_focal_point }} 
                        />
                        
                        {isEditing && (
                            <div className="absolute inset-0 flex flex-col items-center justify-between p-4 pointer-events-none">
                                <div className="bg-primary text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 animate-bounce mt-2">
                                    <LucideCrosshair size={12} /> Haz clic para reencuadrar
                                </div>
                                <div 
                                    className="absolute w-8 h-8 border-2 border-white rounded-full shadow-2xl flex items-center justify-center mix-blend-difference"
                                    style={{ 
                                        left: editData.foto_focal_point.split(' ')[0], 
                                        top: editData.foto_focal_point.split(' ')[1],
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                >
                                    <div className="w-1 h-1 bg-primary rounded-full"></div>
                                </div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} 
                                    className="bg-white/90 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-xl text-xs font-black shadow-xl flex items-center gap-2 hover:scale-105 transition-all pointer-events-auto mb-2"
                                >
                                    <LucideCamera size={14} /> Cambiar Foto
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Resumen de Existencias</h3>
                        <div className="mb-4">
                            <span className="text-4xl font-black text-slate-900 dark:text-white">{material.stockTotal.toLocaleString()}</span>
                            <span className="ml-2 text-slate-500 uppercase text-xs font-black">{material.unidad_base}</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 mb-6">
                            <div className={`h-2.5 rounded-full ${material.stockTotal < 100 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${material.progress}%` }}></div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">SKU Maestro</p>
                                <p className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase font-mono">{material.sku || 'SIN CÓDIGO'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Categoría Técnica</p>
                                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase">{material.categoria || 'GENERAL'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Principal: Multi-Ubicación y Presentaciones */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Nueva Sección: Stock por Ubicación */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                            <div className="flex items-center gap-2">
                                <LucideMapPin className="text-primary" size={20} />
                                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-sm">Distribución en Puntos de Stock</h3>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {ubicacionesStock.length === 0 ? (
                                <div className="p-10 text-center">
                                    <LucideAlertTriangle size={32} className="mx-auto text-amber-500 mb-3 opacity-20" />
                                    <p className="text-xs font-bold text-slate-400 uppercase italic">No hay stock registrado en ninguna ubicación.</p>
                                </div>
                            ) : (
                                ubicacionesStock.map(loc => (
                                    <div key={loc.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${loc.ubicaciones?.tipo === 'obra' ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-100 text-slate-500'}`}>
                                                {loc.ubicaciones?.tipo === 'obra' ? <LucideTruck size={16} /> : <LucidePackage size={16} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase">{loc.ubicaciones?.nombre}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">{loc.ubicaciones?.tipo}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-slate-900 dark:text-white">
                                                {loc.cantidad_actual.toLocaleString()} <span className="text-[10px] text-slate-400 uppercase">{material.unidad_base}</span>
                                            </p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Último movimiento: {new Date(loc.updated_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Modal/Sección de Ajuste de Stock */}
                        {showAdjustStock && (
                            <div className="p-6 bg-primary/5 border-t border-primary/10 animate-in slide-in-from-bottom-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                    <div className="md:col-span-1">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Punto de Stock</label>
                                        <select 
                                            className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold outline-none"
                                            value={adjustStockData.ubicacion_id}
                                            onChange={(e) => setAdjustStockData({...adjustStockData, ubicacion_id: e.target.value})}
                                        >
                                            {todasUbicaciones.map(u => (
                                                <option key={u.id} value={u.id}>{u.nombre} ({u.tipo})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Operación</label>
                                        <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                                            <button 
                                                onClick={() => setAdjustStockData({...adjustStockData, tipo: 'entrada'})}
                                                className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${adjustStockData.tipo === 'entrada' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400'}`}
                                            >
                                                Entrada
                                            </button>
                                            <button 
                                                onClick={() => setAdjustStockData({...adjustStockData, tipo: 'salida'})}
                                                className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${adjustStockData.tipo === 'salida' ? 'bg-red-500 text-white shadow-md' : 'text-slate-400'}`}
                                            >
                                                Salida
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Cantidad ({material.unidad_base})</label>
                                        <input 
                                            type="number"
                                            className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold outline-none"
                                            value={adjustStockData.cantidad}
                                            onChange={(e) => setAdjustStockData({...adjustStockData, cantidad: e.target.value})}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={handleAdjustStock}
                                            className="flex-1 bg-primary text-white p-2.5 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-primary/20"
                                        >
                                            Confirmar
                                        </button>
                                        <button 
                                            onClick={() => setShowAdjustStock(false)}
                                            className="p-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            <LucideX size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Presentaciones y Especificaciones */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-xs flex items-center gap-2">
                                    <LucideLayers size={16} className="text-primary" /> Presentaciones
                                </h3>
                                <button onClick={() => setShowNewPres(true)} className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-primary/10 hover:text-primary transition-all">
                                    <LucidePlus size={14} />
                                </button>
                            </div>
                            <div className="p-2 space-y-1">
                                {presentaciones.map(pres => (
                                    <div key={pres.id} className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl transition-colors group">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase">{pres.nombre}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-full">{pres.cantidad_en_unidad_base} {material.unidad_base}</span>
                                            <button onClick={() => handleDeletePresentation(pres.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all">
                                                <LucideTrash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Notas y Configuración Técnica</h3>
                            <div className="space-y-6">
                                {isEditing && (
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-4 border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in-95">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Tipo de Medida</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {TIPOS_MEDIDA.map(tipo => (
                                                    <button 
                                                        key={tipo.id}
                                                        onClick={() => handleTypeChange(tipo.id)}
                                                        className={`flex items-center gap-2 p-2.5 rounded-lg text-[10px] font-black uppercase border-2 transition-all ${
                                                            editData.tipo_medida === tipo.id 
                                                            ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                                                            : 'border-white dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 hover:border-slate-200'
                                                        }`}
                                                    >
                                                        <tipo.icon size={14} />
                                                        {tipo.label.split(' ')[0]}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Unidad de Gestión (Base)</label>
                                            <select 
                                                className="w-full bg-white dark:bg-slate-900 border-2 border-primary/10 rounded-xl text-sm font-black text-primary p-3 outline-none focus:border-primary cursor-pointer shadow-sm"
                                                value={editData.unidad_base || ''}
                                                onChange={(e) => setEditData({...editData, unidad_base: e.target.value})}
                                            >
                                                <option value="" disabled>Seleccionar unidad...</option>
                                                {unidades.filter(u => u.tipo === editData.tipo_medida).map(u => (
                                                    <option key={u.id} value={u.simbolo}>{u.nombre} ({u.simbolo})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Categoría Técnica</label>
                                            <select 
                                                className="w-full bg-white dark:bg-slate-900 border-2 border-primary/10 rounded-xl text-sm font-black text-slate-700 dark:text-white p-3 outline-none focus:border-primary cursor-pointer shadow-sm"
                                                value={editData.categoria || ''}
                                                onChange={(e) => setEditData({...editData, categoria: e.target.value})}
                                            >
                                                <option value="general">General</option>
                                                <option value="cemento">Cementos</option>
                                                <option value="acero">Aceros</option>
                                                <option value="aridos">Áridos</option>
                                                <option value="pintura">Pinturas</option>
                                                <option value="herramientas">Herramientas</option>
                                                <option value="equipos">Equipos / Maquinaria</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border-l-4 border-primary/40 min-h-[100px]">
                                    {isEditing ? (
                                        <textarea 
                                            className="w-full text-xs text-slate-700 dark:text-white leading-relaxed bg-transparent outline-none resize-none font-medium"
                                            rows={4}
                                            value={editData.descripcion || ''}
                                            onChange={(e) => setEditData({...editData, descripcion: e.target.value})}
                                            placeholder="Añadir descripción técnica detallada..."
                                        />
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-primary">
                                                <LucideInfo size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Información Registrada</span>
                                            </div>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                                {material.descripcion || 'Sin especificaciones registradas.'}
                                            </p>
                                        </div>
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

export default MaterialDetail;

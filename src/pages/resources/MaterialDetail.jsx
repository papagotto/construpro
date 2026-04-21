import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getMediaUrl, uploadMedia } from '../../lib/storage';
import MaterialStockPanel from '../../components/resources/detail/MaterialStockPanel';
import MaterialSpecsPanel from '../../components/resources/detail/MaterialSpecsPanel';
import { 
    LucidePlus, LucideEdit3, LucideSave, LucideX, LucideCamera, LucideCrosshair, LucideScale, LucideLayers, LucideLayoutGrid, LucideInfo, LucidePackage
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
    const [showAdjustStock, setShowAdjustStock] = useState(false);
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
            const { data, error } = await supabase.from('recursos').select('*').eq('id', id).single();
            if (error) throw error;
            const { data: stockData } = await supabase.from('stock_por_ubicacion').select('*, ubicaciones(*)').eq('recurso_id', id);
            const { data: locsData } = await supabase.from('ubicaciones').select('*').eq('is_active', true);
            const { data: presData } = await supabase.from('recurso_presentaciones').select('*, unidades_medida(*)').eq('recurso_id', id).eq('is_deleted', false);
            const { data: unitsData } = await supabase.from('unidades_medida').select('*').order('nombre');

            const stockTotal = stockData?.reduce((acc, s) => acc + (Number(s.cantidad_actual) || 0), 0) || 0;
            const materialObj = { ...data, stockTotal, progress: Math.min((stockTotal / 1000) * 100, 100), foto_focal_point: data.foto_focal_point || '50% 50%' };

            setMaterial(materialObj);
            setEditData(materialObj);
            setUbicacionesStock(stockData || []);
            setTodasUbicaciones(locsData || []);
            setPresentaciones(presData || []);
            setUnidades(unitsData || []);
            
            if (locsData?.length > 0) setAdjustStockData(prev => ({ ...prev, ubicacion_id: locsData[0].id }));
        } catch (error) {
            console.error('Error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const { error } = await supabase.from('recursos').update({
                nombre_interno: editData.nombre_interno,
                sku: editData.sku,
                descripcion: editData.descripcion,
                unidad_base: editData.unidad_base,
                categoria: editData.categoria,
                tipo_medida: editData.tipo_medida,
                foto_focal_point: editData.foto_focal_point
            }).eq('id', id);
            if (error) throw error;
            setIsEditing(false);
            fetchMaterialDetail();
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        }
    };

    const handleAdjustStock = async () => {
        try {
            const { ubicacion_id, cantidad, tipo } = adjustStockData;
            const factor = tipo === 'entrada' ? 1 : -1;
            const diff = Number(cantidad) * factor;
            const currentStock = ubicacionesStock.find(s => s.ubicacion_id === ubicacion_id)?.cantidad_actual || 0;
            const newStock = Number(currentStock) + diff;

            const { error } = await supabase.from('stock_por_ubicacion').upsert({
                recurso_id: id, ubicacion_id, cantidad_actual: newStock, updated_at: new Date()
            }, { onConflict: 'recurso_id,ubicacion_id' });

            if (error) throw error;
            setShowAdjustStock(false);
            fetchMaterialDetail();
        } catch (error) {
            alert('Error ajustando stock: ' + error.message);
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
            const filePath = await uploadMedia(file, 'materials', id);
            const { error } = await supabase.from('recursos').update({ imagen_path: filePath }).eq('id', id);
            if (error) throw error;
            fetchMaterialDetail();
        } catch (error) {
            alert('Error al subir la imagen: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    if (loading && !material) return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest text-xs">Sincronizando inventario técnico...</div>;
    if (!material) return <div className="p-8">Recurso no encontrado</div>;

    const displayImage = getMediaUrl(material.imagen_path) || material.imagen || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=400';

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

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
                            <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2"><LucideX size={16} /> Cancelar</button>
                            <button onClick={handleSave} className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"><LucideSave size={16} /> Guardar</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2"><LucideEdit3 size={16} /> Editar</button>
                            <button onClick={() => setShowAdjustStock(true)} className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-primary rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2"><LucidePlus size={16} /> Ajustar Inventario</button>
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
                            alt={material.nombre_interno} 
                            className="w-full h-64 object-cover transition-all duration-300"
                            style={{ objectPosition: isEditing ? editData.foto_focal_point : material.foto_focal_point }} 
                        />
                        {isEditing && (
                            <div className="absolute inset-0 flex flex-col items-center justify-between p-4 pointer-events-none">
                                <div className="bg-primary text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 animate-bounce mt-2"><LucideCrosshair size={12} /> Haz clic para reencuadrar</div>
                                <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="bg-white/90 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-xl text-xs font-black shadow-xl flex items-center gap-2 hover:scale-105 transition-all pointer-events-auto mb-2"><LucideCamera size={14} /> Cambiar Foto</button>
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
                            <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">SKU Maestro</p><p className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase font-mono">{material.sku || 'SIN CÓDIGO'}</p></div>
                            <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Categoría Técnica</p><span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase">{material.categoria || 'GENERAL'}</span></div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <MaterialStockPanel 
                        ubicacionesStock={ubicacionesStock}
                        unidadBase={material.unidad_base}
                        showAdjustStock={showAdjustStock}
                        setShowAdjustStock={setShowAdjustStock}
                        adjustStockData={adjustStockData}
                        setAdjustStockData={setAdjustStockData}
                        todasUbicaciones={todasUbicaciones}
                        handleAdjustStock={handleAdjustStock}
                    />

                    <MaterialSpecsPanel 
                        presentaciones={presentaciones}
                        unidadBase={material.unidad_base}
                        onAddPresentation={() => console.log('Add presentation')}
                        onDeletePresentation={(pid) => console.log('Delete pres', pid)}
                        isEditing={isEditing}
                        editData={editData}
                        setEditData={setEditData}
                        unidades={unidades}
                        tiposMedida={TIPOS_MEDIDA}
                    />
                </div>
            </div>
        </div>
    );
};

export default MaterialDetail;

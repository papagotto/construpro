import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
    LucidePackage, LucideMapPin, LucideAlertTriangle, 
    LucideHistory, LucideSettings, LucideInfo, LucideTag
} from 'lucide-react';

const MaterialDetail = () => {
    const { id } = useParams();
    const [material, setMaterial] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMaterialDetail();
    }, [id]);

    const fetchMaterialDetail = async () => {
        try {
            setLoading(true);
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

            const stockTotal = data.stock_actual?.reduce((acc, s) => acc + (Number(s.cantidad_disponible) || 0), 0) || 0;

            const mappedMaterial = {
                id: data.id,
                name: data.nombre_interno,
                sku: data.sku || 'N/A',
                category: data.categoria || 'Construcción',
                unit: data.unidad_base || 'unidades',
                stock: stockTotal,
                progress: Math.min((stockTotal / 1000) * 100, 100),
                image: data.imagen || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=400&auto=format&fit=crop',
                location: data.ubicacion || 'Almacén Central',
                description: data.descripcion || 'Sin descripción técnica disponible.',
                specifications: [
                    { label: 'Categoría', value: data.categoria || 'N/A' },
                    { label: 'Unidad de Medida', value: data.unidad_base || 'N/A' },
                    { label: 'Creado el', value: new Date(data.created_at).toLocaleDateString() }
                ],
                usageHistory: data.stock_actual?.map(s => ({
                    date: 'Actual',
                    project: s.proyectos?.nombre || 'General',
                    quantity: `${s.cantidad_disponible} ${data.unidad_base}`,
                    responsible: 'Sistema'
                })) || []
            };

            setMaterial(mappedMaterial);
        } catch (error) {
            console.error('Error cargando detalle de material:', error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center uppercase tracking-widest text-xs font-bold text-slate-500">Consultando almacén...</div>;
    if (!material) return <div className="p-8">Material no encontrado</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <nav className="flex mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <Link to="/recursos-materiales" className="hover:text-primary transition-colors">Recursos</Link>
                        <span className="mx-2">/</span>
                        <Link to="/recursos-materiales" className="hover:text-primary transition-colors">Materiales</Link>
                        <span className="mx-2">/</span>
                        <span className="text-primary">{material.name}</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{material.name}</h1>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${material.stock < 100 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {material.stock < 100 ? 'Stock Bajo' : 'Stock Saludable'}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 shadow-sm transition-all">+ Ajustar Stock</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-6">
                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <img src={material.image} alt={material.name} className="w-full h-64 object-cover" />
                    </div>
                    
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Estado de Inventario</h3>
                        <div className="mb-4">
                            <span className="text-4xl font-black text-slate-900 dark:text-white">{material.stock.toLocaleString()}</span>
                            <span className="ml-2 text-slate-500 lowercase font-medium">{material.unit}</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 mb-4">
                            <div className={`h-2.5 rounded-full ${material.stock < 100 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${material.progress}%` }}></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mt-6">
                            <div><p className="text-slate-400 mb-1">SKU</p><p className="font-bold text-slate-700 dark:text-slate-300 uppercase">{material.sku}</p></div>
                            <div><p className="text-slate-400 mb-1">Ubicación Principal</p><p className="font-bold text-slate-700 dark:text-slate-300">{material.location}</p></div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Información Técnica</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{material.description}</p>
                            <dl className="space-y-3">
                                {material.specifications.map((spec, idx) => (
                                    <div key={idx} className="flex justify-between border-b border-slate-50 dark:border-slate-800/50 pb-2 last:border-0">
                                        <dt className="text-xs font-bold text-slate-400 uppercase">{spec.label}</dt>
                                        <dd className="text-sm font-bold text-slate-800 dark:text-slate-200">{spec.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                        
                        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Stock por Obra</h3>
                            <div className="space-y-4">
                                {material.usageHistory.length > 0 ? material.usageHistory.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <LucideMapPin size={14} className="text-primary" />
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.project}</span>
                                        </div>
                                        <span className="text-xs font-black text-primary">{item.quantity}</span>
                                    </div>
                                )) : <p className="text-xs text-slate-400 italic">No hay stock asignado a proyectos específicos.</p>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <LucideHistory size={18} /> Movimientos Recientes
                        </h3>
                        <div className="text-center py-10">
                            <LucidePackage size={32} className="mx-auto text-slate-200 mb-3" />
                            <p className="text-xs text-slate-400">Sincronizando log de ingresos y consumos...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaterialDetail;

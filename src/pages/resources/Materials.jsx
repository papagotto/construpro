import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getMediaUrl } from '../../lib/storage';
import MaterialForm from '../../components/MaterialForm';
import ResourceTabs from '../../components/shared/ResourceTabs';
import SearchBar from '../../components/shared/SearchBar';
import MaterialTable from '../../components/resources/MaterialTable';
import MaterialCardMobile from '../../components/resources/MaterialCardMobile';
import { LucidePlus } from 'lucide-react';

const Materials = () => {
    const navigate = useNavigate();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('recursos')
                .select(`
                    *,
                    stock_actual (
                        cantidad_disponible
                    )
                `)
                .eq('is_deleted', false)
                .order('nombre_interno');

            if (error) throw error;

            const mappedMaterials = data.map(item => {
                const stockTotal = item.stock_actual?.reduce((acc, s) => acc + (Number(s.cantidad_disponible) || 0), 0) || 0;
                return {
                    id: item.id,
                    name: item.nombre_interno,
                    sku: item.sku || 'N/A',
                    category: item.categoria || 'General',
                    categoryColor: item.categoria === 'acero' ? 'bg-indigo-100 text-indigo-700' : 
                                  item.categoria === 'cemento' ? 'bg-slate-100 text-slate-700' : 'bg-blue-100 text-blue-700',
                    stock: stockTotal,
                    unit: item.unit_base || 'unidades',
                    description: item.descripcion,
                    image: getMediaUrl(item.imagen_path) || item.imagen || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=200&auto=format&fit=crop',
                    location: item.ubicacion,
                    progress: Math.min((stockTotal / 1000) * 100, 100),
                    progressColor: stockTotal < 100 ? 'bg-red-500' : stockTotal < 500 ? 'bg-amber-500' : 'bg-emerald-500'
                };
            });

            setMaterials(mappedMaterials);
        } catch (error) {
            console.error('Error cargando materiales:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredMaterials = materials.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Catálogo de Recursos</h1>
                    <p className="text-slate-500 text-sm">Gestione el inventario de materiales y equipamiento de construcción.</p>
                </div>
                <button 
                    onClick={() => setShowForm(true)}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:scale-95"
                >
                    <LucidePlus size={16} />
                    Añadir Material
                </button>
            </div>

            <ResourceTabs />

            <SearchBar 
                placeholder="Buscar por SKU o Nombre..."
                value={searchTerm}
                onChange={setSearchTerm}
            />

            <div className="bg-transparent md:bg-white dark:md:bg-slate-900 md:rounded-xl md:border md:border-slate-200 md:dark:border-slate-800 overflow-hidden md:shadow-sm">
                <MaterialTable 
                    materials={filteredMaterials}
                    loading={loading}
                    onMaterialClick={(id) => navigate(`/recursos-materiales/${id}`)}
                />
            </div>

            <MaterialCardMobile 
                materials={filteredMaterials}
                onMaterialClick={(id) => navigate(`/recursos-materiales/${id}`)}
            />

            {showForm && (
                <div className="fixed inset-0 z-[100] flex justify-end bg-slate-900/40 backdrop-blur-sm transition-all duration-500 animate-in fade-in">
                    <div className="w-full max-w-lg h-full">
                        <MaterialForm 
                            onClose={() => setShowForm(false)} 
                            onSuccess={fetchMaterials} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Materials;

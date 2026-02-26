import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getMediaUrl } from '../lib/storage';

const Materials = () => {
    const navigate = useNavigate();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            setLoading(true);
            // Consultamos recursos y traemos el stock sumado
            const { data, error } = await supabase
                .from('recursos')
                .select(`
                    *,
                    stock_actual (
                        cantidad_disponible
                    )
                `)
                .eq('is_deleted', false);

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

    return (
        <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Catálogo de Recursos</h1>
                    <p className="text-slate-500 text-sm">Gestione el inventario de materiales y equipamiento de construcción.</p>
                </div>
                <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm">
                    <span className="material-icons text-sm">add</span>
                    Añadir Material
                </button>
            </div>

            <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
                <button className="px-6 py-3 text-sm font-semibold border-b-2 border-primary text-primary">Materiales</button>
                <Link
                    to="/recursos-equipos"
                    className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-b-2 border-transparent"
                >
                    Equipamiento
                </Link>
                <Link
                    to="/usuarios"
                    className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-b-2 border-transparent"
                >
                    Personal
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center mb-6 shadow-sm">
                <div className="relative w-full md:flex-1">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">inventory</span>
                    <input
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm focus:ring-primary focus:border-primary transition-all"
                        placeholder="Buscar por SKU o Nombre..."
                        type="text"
                    />
                </div>
                <button className="w-full md:w-auto p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex justify-center items-center">
                    <span className="material-icons text-slate-600 dark:text-slate-400">filter_list</span>
                </button>
            </div>

            <div className="bg-transparent md:bg-white dark:md:bg-slate-900 md:rounded-xl md:border md:border-slate-200 md:dark:border-slate-800 overflow-hidden md:shadow-sm">
                {loading ? (
                    <div className="p-12 text-center text-slate-500 uppercase tracking-widest text-xs font-bold">Cargando inventario...</div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Material</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">SKU</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoría</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ubicación</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {materials.map((item) => (
                                        <tr 
                                            key={item.id} 
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                                            onClick={() => navigate(`/recursos-materiales/${item.id}`)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700">
                                                        <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm text-slate-900 dark:text-white">{item.name}</p>
                                                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{item.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-mono text-slate-500">{item.sku}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${item.categoryColor}`}>
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`text-sm font-semibold ${item.stock < 100 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                                                        {item.stock.toLocaleString()} {item.unit}
                                                    </span>
                                                    <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full ${item.progressColor}`} style={{ width: `${item.progress}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="material-icons text-sm">location_on</span>
                                                    {item.location}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                                    <span className="material-icons">more_vert</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-4">
                            {materials.map((item) => (
                                <div 
                                    key={item.id} 
                                    className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 active:scale-[0.98] transition-all"
                                    onClick={() => navigate(`/recursos-materiales/${item.id}`)}
                                >
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-100 dark:border-slate-800 flex-shrink-0 shadow-sm">
                                            <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight truncate">{item.name}</h3>
                                                <span className="text-[9px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded-md border border-slate-100 dark:border-slate-800">{item.sku}</span>
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${item.categoryColor}`}>
                                                    {item.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-50 dark:border-slate-800/50">
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1.5">Stock Disponible</p>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-sm font-black ${item.stock < 100 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                                                    {item.stock.toLocaleString()} {item.unit}
                                                </span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                                                <div className={`h-full rounded-full ${item.progressColor}`} style={{ width: `${item.progress}%` }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1.5">Ubicación</p>
                                            <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-bold">
                                                <span className="material-icons text-base text-slate-400">location_on</span>
                                                {item.location}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Materials;

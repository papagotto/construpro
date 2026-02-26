import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getMediaUrl } from '../lib/storage';

const Equipment = () => {
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('equipos_fisicos')
                .select('*')
                .eq('is_deleted', false);

            if (error) throw error;

            const mappedEquipment = data.map(item => ({
                id: item.id,
                name: item.nombre,
                code: item.codigo || 'EQ-N/A',
                status: item.estado === 'uso' ? 'En Uso' : 
                        item.estado === 'mantenimiento' ? 'Mantenimiento' : 'Disponible',
                statusColor: item.estado === 'uso' ? 'bg-blue-100 text-blue-700' :
                            item.estado === 'mantenimiento' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700',
                image: getMediaUrl(item.imagen_path) || item.imagen || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=400&auto=format&fit=crop',
                maintenanceDate: item.fecha_mantenimiento ? new Date(item.fecha_mantenimiento).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : 'No programada',
                isWarning: item.is_warning
            }));

            setEquipment(mappedEquipment);
        } catch (error) {
            console.error('Error cargando equipos:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Catálogo de Recursos</h1>
                    <p className="text-slate-500 text-sm">Administra y visualiza el inventario de materiales y maquinaria pesada.</p>
                </div>
                <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm">
                    <span className="material-icons text-sm">add</span>
                    Añadir Equipamiento
                </button>
            </div>

            <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
                <Link
                    to="/recursos-materiales"
                    className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-b-2 border-transparent"
                >
                    Materiales
                </Link>
                <button className="px-6 py-3 text-sm font-semibold border-b-2 border-primary text-primary">Equipamiento</button>
                <Link
                    to="/usuarios"
                    className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-b-2 border-transparent"
                >
                    Personal
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                <div className="relative flex-1 w-full">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="Buscar por nombre, modelo o ID..."
                        type="text"
                    />
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Cargando flota de equipos...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {equipment.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="h-48 overflow-hidden relative">
                                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.name} src={item.image} />
                                <span className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm ${item.statusColor}`}>
                                    {item.status}
                                </span>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-slate-900 dark:text-white truncate" title={item.name}>{item.name}</h3>
                                <p className="text-xs text-slate-500 mt-1">ID: {item.code}</p>
                                <div className={`mt-4 flex items-center space-x-2 text-xs font-medium p-2 rounded ${item.isWarning ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20' : 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50'}`}>
                                    <span className="material-icons text-sm">{item.isWarning ? 'warning' : 'event_note'}</span>
                                    <span>Mantenimiento: {item.maintenanceDate}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-5">
                                    <Link 
                                        to={`/recursos-equipos/${item.id}`}
                                        className="py-2 text-xs font-semibold text-center text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                                    >
                                        Ver Detalles
                                    </Link>
                                    <button
                                        className={`py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded transition-colors ${item.status === 'Mantenimiento' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={item.status === 'Mantenimiento'}
                                    >
                                        Asignar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Equipment;

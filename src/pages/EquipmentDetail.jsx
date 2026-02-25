import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
    LucideSettings, LucideAlertCircle, LucideHistory, 
    LucideUserCheck, LucideInfo, LucideCalendar, LucideMapPin
} from 'lucide-react';

const EquipmentDetail = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

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

            const mappedItem = {
                id: data.id,
                name: data.nombre,
                code: data.codigo || 'EQ-N/A',
                status: data.estado === 'uso' ? 'En Uso' : 
                        data.estado === 'mantenimiento' ? 'Mantenimiento' : 'Disponible',
                statusColor: data.estado === 'uso' ? 'bg-blue-100 text-blue-700' :
                            data.estado === 'mantenimiento' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700',
                image: data.imagen || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=400&auto=format&fit=crop',
                hours: data.horas_acumuladas || 0,
                maxHours: data.horas_mantenimiento_limite || 2000,
                maintenanceDate: data.fecha_mantenimiento ? new Date(data.fecha_mantenimiento).toLocaleDateString() : 'No programada',
                location: 'Almacén Central',
                maintenanceHistory: [],
                operators: ['Carlos Ruiz (Principal)', 'Luis Torres'],
                specs: [
                    { label: 'Modelo', value: data.modelo || 'Estándar' },
                    { label: 'Horas Acumuladas', value: `${data.horas_acumuladas || 0} hrs` },
                    { label: 'Límite Mant.', value: `${data.horas_mantenimiento_limite || 2000} hrs` }
                ]
            };

            setItem(mappedItem);
        } catch (error) {
            console.error('Error cargando detalle de equipo:', error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center uppercase tracking-widest text-xs font-bold text-slate-500">Cargando datos técnicos...</div>;
    if (!item) return <div className="p-8">Equipamiento no encontrado</div>;

    const usagePercent = Math.min((item.hours / item.maxHours) * 100, 100);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <nav className="flex mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <Link to="/recursos-materiales" className="hover:text-primary transition-colors">Recursos</Link>
                        <span className="mx-2">/</span>
                        <Link to="/recursos-equipos" className="hover:text-primary transition-colors">Equipamiento</Link>
                        <span className="mx-2">/</span>
                        <span className="text-primary">{item.name}</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{item.name}</h1>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${item.statusColor}`}>{item.status}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-orange-600 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors">Reportar Falla</button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 shadow-sm transition-all">+ Agendar Mantenimiento</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-6">
                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm aspect-video lg:aspect-square">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Uso del Equipamiento</h3>
                        <div className="mb-4"><span className="text-4xl font-black text-slate-900 dark:text-white">{item.hours} hrs</span></div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 mb-2">
                            <div className={`h-2.5 rounded-full ${usagePercent > 80 ? 'bg-red-500' : 'bg-sky-500'}`} style={{ width: `${usagePercent}%` }}></div>
                        </div>
                        <p className="text-xs text-slate-400 mb-6">{usagePercent.toFixed(1)}% de vida útil antes de mantenimiento mayor</p>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                            <LucideMapPin size={16} className="text-primary" />
                            <span className="font-medium">{item.location}</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Próximo Mantenimiento</h3>
                            <div className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{item.maintenanceDate}</div>
                            <p className="text-sm text-slate-400 mb-4 italic">Servicio preventivo a las {item.maxHours} hrs</p>
                            
                            <div className="space-y-4">
                                <p className="text-xs font-bold text-slate-400 uppercase">Historial Reciente</p>
                                <p className="text-xs text-slate-400 italic">Sincronizando registros de taller...</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Operadores Autorizados</h3>
                                <div className="flex -space-x-3 mb-4">
                                    {item.operators.map((op, idx) => (
                                        <div key={idx} className="w-10 h-10 rounded-full border-2 border-white dark:border-surface-dark bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">{op[0]}</div>
                                    ))}
                                </div>
                                <p className="text-sm text-slate-500">{item.operators.join(', ')}</p>
                            </div>

                            <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Especificaciones Técnicas</h3>
                                <dl className="grid grid-cols-2 gap-4">
                                    {item.specs.map((spec, idx) => (
                                        <div key={idx}>
                                            <dt className="text-xs text-slate-400 mb-1">{spec.label}</dt>
                                            <dd className="text-sm font-bold text-slate-700 dark:text-slate-300">{spec.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentDetail;

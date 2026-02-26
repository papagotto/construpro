import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getMediaUrl } from '../lib/storage';

const Projects = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            // Consultamos directamente a nuestra nueva vista inteligente
            const { data, error } = await supabase
                .from('proyectos_resumen')
                .select('*')
                .eq('is_deleted', false)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Mapear los datos de la vista al formato que usa la interfaz
            const mappedProjects = data.map(project => ({
                id: project.id,
                name: project.nombre,
                client: project.cliente,
                budget: Number(project.presupuesto || 0),
                startDate: new Date(project.fecha_inicio).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
                endDate: project.fecha_fin ? new Date(project.fecha_fin).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : 'No definida',
                progress: Math.round(project.progreso_fisico_total),
                image: getMediaUrl(project.portada_path) || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=400&auto=format&fit=crop',
                stage: project.estado === 'en_curso' ? 'Activo' : 
                       project.estado === 'en_riesgo' ? 'En Riesgo' : 
                       project.estado === 'pendiente' ? 'Pendiente' : 'Finalizado',
                stageColor: project.estado === 'en_curso' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                           project.estado === 'en_riesgo' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                           project.estado === 'finalizado' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                           'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
                spent: Number(project.gasto_real_total || 0),
                spentPercent: Math.round(project.progreso_financiero_total),
                spentStatus: project.progreso_financiero_total > 90 ? 'danger' : project.progreso_financiero_total > 75 ? 'warning' : 'normal'
            }));

            setProjects(mappedProjects);
        } catch (error) {
            console.error('Error cargando proyectos:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Proyectos</h1>
                    <p className="text-slate-500 text-sm">Gestiona y monitorea el estado de todas tus obras activas.</p>
                </div>
                <button className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Nuevo Proyecto
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 mb-6 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="w-full md:flex-1 relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                        <input
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary border transition-all"
                            placeholder="Nombre o cliente..."
                            type="text"
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <select className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary border transition-all">
                            <option value="">Todos los Estados</option>
                            <option value="activo">Activo</option>
                            <option value="pausa">En Pausa</option>
                            <option value="finalizado">Finalizado</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>
                    <div className="w-full md:w-56 relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">calendar_today</span>
                        <input
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary border transition-all"
                            onFocus={(e) => (e.target.type = 'date')}
                            placeholder="Fecha de Fin Estimada"
                            type="text"
                        />
                    </div>
                    <button className="w-full md:w-auto px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-medium flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-all">
                        <span className="material-symbols-outlined text-[18px]">filter_list</span>
                        Más Filtros
                    </button>
                </div>
            </div>

            <div className="bg-transparent md:bg-white dark:md:bg-slate-900 md:rounded-xl md:border md:border-slate-200 md:dark:border-slate-800 md:shadow-sm overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre / Cliente</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Etapa</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Progreso</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fechas</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Presupuesto</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Gasto Actual</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">Cargando proyectos...</td>
                                </tr>
                            ) : projects.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">No se encontraron proyectos.</td>
                                </tr>
                            ) : projects.map((project) => (
                                <tr 
                                    key={project.id} 
                                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                                    onClick={() => navigate(`/proyectos/${project.id}`)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
                                                <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{project.name}</div>
                                                <div className="text-sm text-slate-500">{project.client}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${project.stageColor}`}>
                                            {project.stage}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-full max-w-[120px]">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">{project.progress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-accent h-full rounded-full" style={{ width: `${project.progress}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm leading-tight">
                                        <div className="text-slate-900 dark:text-slate-200">{project.startDate}</div>
                                        <div className="text-slate-400 text-xs">Fin: {project.endDate}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right font-medium text-slate-700 dark:text-slate-300">
                                        {formatCurrency(project.budget)}
                                    </td>
                                    <td className={`px-6 py-4 text-sm text-right font-bold ${project.spentStatus === 'danger' ? 'text-red-500' :
                                            project.spentStatus === 'warning' ? 'text-orange-500' :
                                                'text-slate-700 dark:text-slate-300'
                                        }`}>
                                        {formatCurrency(project.spent)}
                                        <div className="text-[10px] font-normal">
                                            ({project.spentPercent > 100 ? 'Excedido' : `${project.spentPercent}%`})
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards View */}
                <div className="md:hidden space-y-4">
                    {loading ? (
                        <div className="p-12 text-center text-slate-500">Cargando...</div>
                    ) : projects.map((project) => (
                        <div 
                            key={project.id} 
                            className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 active:scale-[0.98] transition-all"
                            onClick={() => navigate(`/proyectos/${project.id}`)}
                        >
                            <div className="flex gap-4">
                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 flex-shrink-0">
                                    <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight truncate">{project.name}</h3>
                                            <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-base">person</span>
                                                {project.client}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 text-[9px] font-black uppercase rounded-full shadow-sm ${project.stageColor}`}>
                                            {project.stage}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/30">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado de Obra</span>
                                    <span className="text-xs font-black text-slate-900 dark:text-white">{project.progress}%</span>
                                </div>
                                <div className="w-full bg-white dark:bg-slate-800 h-2.5 rounded-full overflow-hidden shadow-inner border border-slate-100 dark:border-slate-700/50">
                                    <div className="bg-accent h-full rounded-full transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-5 gap-x-2 pt-2">
                                <div>
                                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1.5">Presupuesto</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(project.budget)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1.5">Gasto Real</p>
                                    <p className={`text-sm font-black ${
                                        project.spentStatus === 'danger' ? 'text-red-500' :
                                        project.spentStatus === 'warning' ? 'text-orange-500' :
                                        'text-emerald-600'
                                    }`}>
                                        {formatCurrency(project.spent)}
                                    </p>
                                </div>
                                <div className="pt-2 border-t border-slate-50 dark:border-slate-800/30">
                                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1.5">Fecha Inicio</p>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                        {project.startDate}
                                    </div>
                                </div>
                                <div className="text-right pt-2 border-t border-slate-50 dark:border-slate-800/30">
                                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1.5">Entrega Est.</p>
                                    <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                                        <span className="material-symbols-outlined text-[14px]">event_available</span>
                                        {project.endDate}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-500">Mostrando <span className="font-medium text-slate-900 dark:text-white">1</span> a <span className="font-medium text-slate-900 dark:text-white">{projects.length}</span> de <span className="font-medium text-slate-900 dark:text-white">{projects.length}</span> proyectos</p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-xs font-medium text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50">
                            Anterior
                        </button>
                        <div className="flex items-center gap-1">
                            <button className="w-8 h-8 text-xs font-bold bg-primary text-white rounded-lg">1</button>
                            <button className="w-8 h-8 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg">2</button>
                            <button className="w-8 h-8 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg">3</button>
                            <span className="text-slate-400 mx-1">...</span>
                            <button className="w-8 h-8 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg">6</button>
                        </div>
                        <button className="px-3 py-1.5 text-xs font-medium text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50">
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Proyectos Activos', value: '18', icon: 'architecture', color: 'text-primary', bcolor: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: 'Alertas de Presupuesto', value: '3', icon: 'priority_high', color: 'text-orange-500', bcolor: 'bg-orange-50 dark:bg-orange-900/20' },
                    { label: 'Finalizados este mes', value: '5', icon: 'task_alt', color: 'text-emerald-600', bcolor: 'bg-emerald-50 dark:bg-emerald-900/20' }
                ].map((stat) => (
                    <div key={stat.label} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex items-center gap-4">
                        <div className={`w-12 h-12 ${stat.bcolor} rounded-lg flex items-center justify-center ${stat.color}`}>
                            <span className="material-symbols-outlined">{stat.icon}</span>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                            <p className="text-xl font-bold">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Projects;

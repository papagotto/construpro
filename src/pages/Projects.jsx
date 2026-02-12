import { useNavigate } from 'react-router-dom';
import { detailedProjects } from '../data/mockData';

const Projects = () => {
    const navigate = useNavigate();

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
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[240px] relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                        <input
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary border"
                            placeholder="Nombre o cliente..."
                            type="text"
                        />
                    </div>
                    <div className="w-48">
                        <select className="w-full py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary border">
                            <option value="">Todos los Estados</option>
                            <option value="activo">Activo</option>
                            <option value="pausa">En Pausa</option>
                            <option value="finalizado">Finalizado</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>
                    <div className="w-56 relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">calendar_today</span>
                        <input
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary border"
                            onFocus={(e) => (e.target.type = 'date')}
                            placeholder="Fecha de Fin Estimada"
                            type="text"
                        />
                    </div>
                    <button className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-medium flex items-center gap-2 border border-slate-200 dark:border-slate-700">
                        <span className="material-symbols-outlined text-[18px]">filter_list</span>
                        Más Filtros
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
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
                            {detailedProjects.map((project) => (
                                <tr 
                                    key={project.id} 
                                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                                    onClick={() => navigate(`/proyectos/${project.id}`)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{project.name}</div>
                                        <div className="text-sm text-slate-500">{project.client}</div>
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
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-500">Mostrando <span className="font-medium text-slate-900 dark:text-white">1</span> a <span className="font-medium text-slate-900 dark:text-white">3</span> de <span className="font-medium text-slate-900 dark:text-white">24</span> proyectos</p>
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

import { useParams, Link } from 'react-router-dom';
import { detailedProjects } from '../data/mockData';

const ProjectDetail = () => {
    const { id } = useParams();
    const project = detailedProjects.find(p => p.id === parseInt(id));

    if (!project) {
        return <div className="p-8">Proyecto no encontrado</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Content Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <nav className="flex mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <Link to="/proyectos" className="hover:text-primary transition-colors">Proyectos</Link>
                        <span className="mx-2">/</span>
                        <span className="text-primary">{project.name}</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{project.name}</h1>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            En Ejecución
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        Generar Reporte
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 shadow-sm transition-all">
                        + Nueva Tarea
                    </button>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="relative w-12 h-12 flex-shrink-0">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path className="text-slate-100 dark:text-slate-800" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            <path className="text-primary" strokeDasharray={`${project.progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{project.progress}%</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Avance</p>
                        <p className="text-lg font-black text-slate-900 dark:text-white">General</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                        <span className="material-icons">schedule</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Tiempo</p>
                        <p className="text-lg font-black text-slate-900 dark:text-white">{project.daysLeft} días</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-bold text-slate-400 uppercase">Presupuesto</p>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">${(project.spent/1000).toFixed(0)}k / ${(project.budget/1000).toFixed(0)}k</p>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(project.spent/project.budget)*100}%` }}></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                        <span className="material-icons">assignment</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Tareas</p>
                        <p className="text-lg font-black text-slate-900 dark:text-white">{project.pendingTasks} pendientes</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Timeline Column */}
                <div className="lg:col-span-2 bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">Línea de Tiempo de Hitos</h3>
                    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent dark:before:via-slate-800">
                        {project.milestones.map((m, idx) => (
                            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-surface-dark bg-slate-50 dark:bg-slate-900 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    {m.status === 'completed' ? (
                                        <span className="material-icons text-emerald-500">check_circle</span>
                                    ) : m.status === 'active' ? (
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                        </span>
                                    ) : (
                                        <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                                    )}
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
                                    <div className="flex items-center justify-between space-x-2 mb-1">
                                        <div className="font-bold text-slate-900 dark:text-white">{m.name}</div>
                                        <time className="font-medium text-xs text-primary">{m.date}</time>
                                    </div>
                                    <div className="text-slate-500 text-xs">Responsable: Ing. Ana García</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Team and Resources */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Equipo del Proyecto</h3>
                        <div className="space-y-4">
                            {project.team.map((person, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {person.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{person.name}</p>
                                        <p className="text-xs text-slate-500">{person.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2 text-xs font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">
                            Gestionar Equipo
                        </button>
                    </div>

                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Recursos Críticos</h3>
                        <div className="space-y-4">
                            {project.criticalResources.map((res, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-700 dark:text-slate-300">{res.name}</span>
                                        <span className={res.status === 'Crítico' ? 'text-red-500' : 'text-emerald-500'}>{res.stock}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                                        <div className={`h-1.5 rounded-full ${res.status === 'Crítico' ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: res.stock }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;

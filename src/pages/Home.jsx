import { dashboardStats, activeProjects, budgetData, alerts, recentActivity, userData } from '../data/mockData';

const Home = () => {
    return (
        <>
            <section className="bg-primary rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 flex items-center justify-center">
                    <span className="material-icons text-[180px] rotate-12">architecture</span>
                </div>
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold mb-1">¡Buenos días, {userData.name}!</h1>
                    <p className="text-primary-100/80 text-sm mb-6">Aquí tienes un resumen del estado actual de tus obras.</p>
                    <div className="flex flex-wrap gap-8">
                        {dashboardStats.map((stat) => (
                            <div key={stat.label} className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md">
                                    <span className="material-icons">{stat.icon}</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-xs text-white/70 uppercase font-medium">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <span className="w-2 h-6 bg-primary rounded-full"></span>
                            Proyectos Activos
                        </h2>
                        <button className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
                            Ver Todo <span className="material-icons text-sm">arrow_forward</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeProjects.map((project) => (
                            <div key={project.id} className="bg-surface-light dark:bg-surface-dark p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold group-hover:text-primary transition-colors">{project.name}</h3>
                                        <p className="text-xs text-slate-500">Cliente: {project.client}</p>
                                    </div>
                                    <span className={`${project.statusColor} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase`}>
                                        {project.status}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="font-medium text-slate-600 dark:text-slate-400">Progreso de Obra</span>
                                            <span className="font-bold text-primary">{project.progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                            <div className="bg-accent h-full transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs py-2 border-y border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-1">
                                            <span className="material-icons text-sm text-slate-400">calendar_today</span>
                                            <span>{project.startDate}</span>
                                        </div>
                                        <span className="text-slate-300">|</span>
                                        <div className="flex items-center gap-1">
                                            <span className="material-icons text-sm text-slate-400">event</span>
                                            <span>{project.endDate}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="flex-1 border border-primary text-primary hover:bg-primary hover:text-white transition-colors py-2 rounded text-xs font-semibold">Etapas</button>
                                        <button className="flex-1 border border-primary text-primary hover:bg-primary hover:text-white transition-colors py-2 rounded text-xs font-semibold">Tareas</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold">Presupuesto vs. Gasto (Mensual)</h2>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-primary"></span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Presupuesto</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-accent"></span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Gasto Real</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-64 flex items-end justify-between gap-4 px-2">
                            {budgetData.map((data) => (
                                <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex justify-center gap-1 h-48">
                                        <div className="w-1/3 bg-primary rounded-t" style={{ height: `${data.budget}%` }}></div>
                                        <div className="w-1/3 bg-accent rounded-t" style={{ height: `${data.actual}%` }}></div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-bold">{data.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-surface-light dark:bg-surface-dark rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-4 bg-red-50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/20">
                            <h2 className="font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
                                <span className="material-icons text-lg">warning</span>
                                Alertas Críticas
                            </h2>
                        </div>
                        <div className="p-4 space-y-4">
                            {alerts.map((alert) => (
                                <div key={alert.id} className="flex gap-3">
                                    <div className="w-1 bg-red-500 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-bold">{alert.title}</p>
                                        <p className="text-xs text-slate-500">{alert.description}</p>
                                        <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">{alert.project}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h2 className="font-bold mb-6">Actividad Reciente</h2>
                        <div className="space-y-6 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-slate-200 dark:before:bg-slate-700">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="relative pl-8">
                                    <span className={`absolute left-0 w-5 h-5 ${activity.color} rounded-full flex items-center justify-center ring-4 ring-white dark:ring-surface-dark`}>
                                        <span className="material-icons text-[10px] text-white">{activity.icon}</span>
                                    </span>
                                    <p className="text-xs font-bold">{activity.action}</p>
                                    <p className="text-[10px] text-slate-500">{activity.context}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 relative h-40">
                        <img
                            alt="Map location"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3PFOwh-FyhkQVq4KdAK03T8syEHQDv4Uipwi5SMv0tq09to8bOMCOb3OtDa1YSALKO9IfXCeIxTTe86pT9moJCa64HiMrKAAzZK5ffwJ5h-kCPFJYJ9avGJuLFOmsFLQyQsWmIIuEsyAVdS8cnJLnykp-Jcg-Y_Be9PNZGlkRn4GTSHDNfXIXn3xqxc7bLwFjCWOGDXDve7fzW9hBjSYimzNk8ZcW34Hv9YzcFFCsf0Hk0ZS4LL8Dk3WR5odTZr-LXiXFMZW1iCQ"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                            <div className="text-white">
                                <p className="text-[10px] font-bold uppercase tracking-wider">Ubicación Actual</p>
                                <p className="text-xs font-medium">Santa Fe, CDMX - Zona de Obra</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;

import { reports, finances } from '../data/mockData';

const Reports = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Inteligencia de Negocio</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Análisis estratégico de costos, rentabilidad y desempeño.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center transition-all shadow-sm">
                        <span className="material-icons text-xl mr-2">analytics</span>
                        Generar Nuevo Análisis
                    </button>
                </div>
            </div>

            {/* Selector de Reporte */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reports.types.map((type) => (
                    <div
                        key={type.id}
                        className={`bg-white dark:bg-surface-dark border-2 rounded-xl p-5 shadow-sm cursor-pointer relative transition-all group ${type.selected ? 'border-primary' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-800'}`}
                    >
                        <div className={`${type.selected ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <span className="material-icons">{type.icon}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white">{type.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">{type.description}</p>
                        {type.selected && (
                            <div className="absolute top-4 right-4">
                                <span className="material-icons text-primary">check_circle</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* DASHBOARD ESTRATÉGICO (KPIs Financieros) */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Análisis de Rentabilidad Corporativa</h2>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {finances.summary.map((kpi, idx) => (
                        <div key={idx} className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 rounded-lg ${kpi.iconColor} bg-opacity-10`}>
                                    <span className="material-icons-outlined block">{kpi.icon}</span>
                                </div>
                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                                    kpi.trend === 'up' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-slate-50 text-slate-500'
                                }`}>
                                    {kpi.change}
                                </span>
                            </div>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{kpi.label}</p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{kpi.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Gráfico de Barras: Presupuesto vs Real */}
                    <div className="lg:col-span-2 bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h4 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Desempeño Presupuestario Mensual</h4>
                                <p className="text-xs text-slate-500 italic">Comparativa global de todas las obras en ejecución</p>
                            </div>
                            <button className="text-primary text-xs font-bold uppercase hover:underline">Ver Auditoría</button>
                        </div>
                        <div className="h-64 flex items-end gap-4 px-4">
                            {finances.monthlyHistory.map((data, idx) => (
                                <div key={idx} className="flex-1 flex flex-col justify-end gap-1 group">
                                    <div className="w-full h-full flex items-end justify-center gap-1">
                                        <div 
                                            className="w-3 bg-slate-100 dark:bg-slate-800 rounded-t-sm transition-all group-hover:bg-slate-200"
                                            style={{ height: `${(data.budget/300000)*100}%` }}
                                        ></div>
                                        <div 
                                            className={`w-3 rounded-t-sm transition-all shadow-sm ${data.actual > data.budget ? 'bg-red-500' : 'bg-primary'}`}
                                            style={{ height: `${(data.actual/300000)*100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-[10px] text-center text-slate-400 font-bold uppercase mt-2">{data.month}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 flex gap-6 justify-center">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-slate-200 dark:bg-slate-800 rounded-sm"></div>
                                <span className="text-xs text-slate-500 font-bold uppercase">Proyectado</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-primary rounded-sm"></div>
                                <span className="text-xs text-slate-500 font-bold uppercase">Ejecutado</span>
                            </div>
                        </div>
                    </div>

                    {/* Desviaciones Card */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Alertas de Desviación</h4>
                            <span className="material-icons text-orange-500">priority_high</span>
                        </div>
                        <div className="flex-1 space-y-4">
                            {finances.deviations.map((dev, idx) => (
                                <div key={idx} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{dev.project}</span>
                                        <span className={`text-xs font-black ${dev.status === 'danger' ? 'text-red-500' : 'text-orange-500'}`}>
                                            {dev.deviation}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${dev.status === 'danger' ? 'bg-red-500' : 'bg-orange-500'}`} 
                                            style={{ width: dev.status === 'danger' ? '90%' : '75%' }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2.5 text-xs font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors uppercase tracking-widest">
                            Descargar Resumen Ejecutivo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;

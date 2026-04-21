import React from 'react';

const StrategicDashboard = ({ monthlyHistory, deviations }) => {
    return (
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
                    {monthlyHistory?.map((data, idx) => (
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
                    {deviations?.map((dev, idx) => (
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
    );
};

export default StrategicDashboard;

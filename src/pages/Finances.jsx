import { finances } from '../data/mockData';

const Finances = () => {
    const formatCurrency = (value) => {
        const absValue = Math.abs(value);
        const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(absValue);
        return value < 0 ? `-${formatted}` : formatted;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Movimientos de Caja</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Registro detallado de ingresos y egresos operativos.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 text-sm font-bold text-emerald-600 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/30 rounded-lg hover:bg-emerald-50 transition-all shadow-sm flex-1 md:flex-none">
                        + Ingreso
                    </button>
                    <button className="px-4 py-2 text-sm font-bold text-red-600 bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/30 rounded-lg hover:bg-red-50 transition-all shadow-sm flex-1 md:flex-none">
                        + Gasto
                    </button>
                    <button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95">
                        Conciliar Bancos
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative w-full">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                    <input 
                        type="text" 
                        placeholder="Buscar por concepto o ID..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                    <select className="w-full md:w-auto bg-slate-50 dark:bg-slate-800/50 border-none rounded-lg px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all">
                        <option>Todos los Proyectos</option>
                        <option>Residencial Los Álamos</option>
                        <option>Torre Delta</option>
                    </select>
                    <select className="w-full md:w-auto bg-slate-50 dark:bg-slate-800/50 border-none rounded-lg px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all">
                        <option>Categorías</option>
                        <option>Materiales</option>
                        <option>Nómina</option>
                        <option>Maquinaria</option>
                    </select>
                </div>
                <div className="relative w-full md:w-40">
                    <input 
                        type="text" 
                        placeholder="Fecha" 
                        onFocus={(e) => e.target.type = 'date'}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-lg px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
            </div>

            {/* Movements Table */}
            <div className="bg-transparent md:bg-white dark:md:bg-surface-dark md:rounded-xl md:border md:border-slate-200 md:dark:border-slate-800 md:shadow-sm overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Concepto</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Proyecto</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoría</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Monto</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Estado</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {finances.movements.map((move) => (
                                <tr key={move.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{move.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">{move.concept}</span>
                                            <span className="text-[10px] text-slate-400 font-mono tracking-tighter">{move.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{move.project}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${move.categoryColor}`}>
                                            {move.category}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-mono text-sm font-bold ${
                                        move.type === 'expense' ? 'text-red-500' : 'text-slate-900 dark:text-white'
                                    }`}>
                                        {formatCurrency(move.amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex justify-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${move.statusColor}`}>
                                                {move.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-primary transition-colors p-1 rounded-lg hover:bg-primary/5">
                                            <span className="material-icons-outlined text-lg">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards View */}
                <div className="md:hidden space-y-4">
                    {finances.movements.map((move) => (
                        <div key={move.id} className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 active:scale-[0.98] transition-all">
                            <div className="flex justify-between items-start">
                                <div className="flex-1 pr-4">
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug">{move.concept}</h3>
                                    <p className="text-[10px] text-slate-400 font-mono mt-1 tracking-wider uppercase">{move.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-lg font-black font-mono leading-none ${
                                        move.type === 'expense' ? 'text-red-500' : 'text-emerald-600'
                                    }`}>
                                        {formatCurrency(move.amount)}
                                    </p>
                                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Monto Final</span>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-3 grid grid-cols-2 gap-4 border border-slate-100 dark:border-slate-800/50">
                                <div className="space-y-1">
                                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Fecha Operativa</p>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                                        <span className="material-icons text-sm opacity-50">calendar_month</span>
                                        {move.date}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Centro de Costo</p>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 truncate">
                                        <span className="material-icons text-sm opacity-50">business</span>
                                        {move.project}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-1">
                                <div className="flex gap-2">
                                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase shadow-sm ${move.categoryColor}`}>
                                        {move.category}
                                    </span>
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase shadow-sm ${move.statusColor}`}>
                                        {move.status}
                                    </span>
                                </div>
                                <button className="text-slate-400 p-1 hover:text-primary transition-colors">
                                    <span className="material-icons text-xl">arrow_forward_ios</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50/30 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-4 md:mt-0">
                    <p className="text-xs text-slate-500 font-medium">Mostrando <span className="text-slate-900 dark:text-white">4</span> de <span className="text-slate-900 dark:text-white">128</span> movimientos</p>
                    <div className="flex gap-2">
                        <button className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all opacity-50 cursor-not-allowed">
                            <span className="material-icons text-sm">chevron_left</span>
                        </button>
                        <button className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm">
                            <span className="material-icons text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Finances;

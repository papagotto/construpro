import React from 'react';

const MovementTable = ({ movements, formatCurrency, loading }) => {
    if (loading) {
        return <div className="p-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Cargando estados financieros...</div>;
    }

    return (
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
                    {movements.map((move) => (
                        <tr key={move.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{move.date}</td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{move.concept}</span>
                                    <span className="text-[10px] text-slate-400 font-mono tracking-tighter">{move.id.substring(0,8)}...</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{move.project}</td>
                            <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${move.categoryColor}`}>{move.category}</span></td>
                            <td className={`px-6 py-4 text-right font-mono text-sm font-bold ${move.type === 'expense' ? 'text-red-500' : 'text-emerald-600'}`}>{formatCurrency(move.amount)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center"><div className="flex justify-center"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${move.statusColor}`}>{move.status}</span></div></td>
                            <td className="px-6 py-4 text-right"><button className="text-slate-400 hover:text-primary transition-colors p-1 rounded-lg hover:bg-primary/5"><span className="material-icons-outlined text-lg">more_vert</span></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MovementTable;

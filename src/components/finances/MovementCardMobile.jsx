import React from 'react';

const MovementCardMobile = ({ movements, formatCurrency }) => {
    return (
        <div className="md:hidden space-y-4">
            {movements.map((move) => (
                <div key={move.id} className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 active:scale-[0.98] transition-all">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                            <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug">{move.concept}</h3>
                            <p className="text-[10px] text-slate-400 font-mono mt-1 tracking-wider uppercase">{move.id.substring(0,8)}...</p>
                        </div>
                        <div className="text-right">
                            <p className={`text-lg font-black font-mono leading-none ${move.type === 'expense' ? 'text-red-500' : 'text-emerald-600'}`}>{formatCurrency(move.amount)}</p>
                            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Monto Final</span>
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-3 grid grid-cols-2 gap-4 border border-slate-100 dark:border-slate-800/50">
                        <div className="space-y-1"><p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Fecha Operativa</p><div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">{move.date}</div></div>
                        <div className="space-y-1"><p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Centro de Costo</p><div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 truncate">{move.project}</div></div>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                        <div className="flex gap-2"><span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase shadow-sm ${move.categoryColor}`}>{move.category}</span><span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase shadow-sm ${move.statusColor}`}>{move.status}</span></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MovementCardMobile;

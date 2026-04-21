import React from 'react';

const FinancialKPIs = ({ summary }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {summary?.map((kpi, idx) => (
                <div key={idx} className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-lg ${kpi.iconColor || 'bg-primary/10 text-primary'} bg-opacity-10`}>
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
    );
};

export default FinancialKPIs;

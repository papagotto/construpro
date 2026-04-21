import React from 'react';
import { LucideHardHat, LucideBuilding2, LucideCheckCircle2, LucideTrendingUp, LucideAlertCircle } from 'lucide-react';

const DashboardHero = ({ userName, stats, formatCurrency }) => {
    const kpis = [
        { label: 'Proyectos', value: stats.projects, icon: LucideBuilding2 },
        { label: 'Tareas Activas', value: stats.tasks, icon: LucideCheckCircle2 },
        { label: 'Ingresos Totales', value: formatCurrency(stats.income), icon: LucideTrendingUp },
        { label: 'Egresos Totales', value: formatCurrency(stats.expense), icon: LucideAlertCircle },
    ];

    return (
        <section className="bg-primary rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-[-50px] top-[-20px] h-[150%] w-1/3 opacity-10 flex items-center justify-center">
                <LucideHardHat size={280} className="rotate-12" />
            </div>
            <div className="relative z-10">
                <h1 className="text-3xl font-black mb-2 tracking-tight">¡Hola, {userName}!</h1>
                <p className="text-primary-100/80 text-sm font-medium mb-8 uppercase tracking-widest">Resumen Operativo de la Empresa</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {kpis.map((stat, idx) => (
                        <div key={idx} className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/20 rounded-lg"><stat.icon size={18} /></div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/60">{stat.label}</p>
                            </div>
                            <p className="text-xl font-black">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DashboardHero;

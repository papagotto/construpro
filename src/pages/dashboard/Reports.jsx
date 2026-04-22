import React from 'react';
import { reports, finances } from '../../data/mockData';
import ReportSelector from '../../components/reports/ReportSelector';
import FinancialKPIs from '../../components/reports/FinancialKPIs';
import StrategicDashboard from '../../components/reports/StrategicDashboard';

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

            <ReportSelector reportTypes={reports?.types} />

            {/* DASHBOARD ESTRATÉGICO (KPIs Financieros) */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Análisis de Rentabilidad Corporativa</h2>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                </div>

                <FinancialKPIs summary={finances?.summary} />

                <StrategicDashboard 
                    monthlyHistory={finances?.monthlyHistory}
                    deviations={finances?.deviations}
                />
            </div>
        </div>
    );
};

export default Reports;

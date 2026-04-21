import React from 'react';
import { LucideCamera, LucideCheckCircle2 } from 'lucide-react';

const ProjectStatsBanner = ({ project, projectImage, onCameraClick }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 h-64 rounded-3xl overflow-hidden relative shadow-2xl group">
                <img src={projectImage} alt={project.nombre} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                    <div>
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Presupuesto Adjudicado</p>
                        <p className="text-3xl font-black text-white">${project.budget.toLocaleString()}</p>
                    </div>
                    <button onClick={onCameraClick} className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-2xl hover:bg-white/20 transition-all">
                        <LucideCamera size={20} />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Avance Global</p>
                    <div className="relative w-32 h-32 mx-auto mb-4">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100" strokeWidth="3" />
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-primary transition-all duration-1000" strokeWidth="3" strokeDasharray={`${project.progress}, 100`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">{project.progress}%</span>
                        </div>
                    </div>
                </div>
                <div className="bg-emerald-600 p-6 rounded-3xl shadow-lg shadow-emerald-500/20 text-white">
                    <LucideCheckCircle2 className="mb-4 opacity-50" size={24} />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Inversión Real</p>
                    <p className="text-2xl font-black">${project.spent.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default ProjectStatsBanner;

import React from 'react';
import { Link } from 'react-router-dom';
import { LucideChevronRight, LucideCalendar } from 'lucide-react';

const RecentProjects = ({ projects, onProjectClick }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-black flex items-center gap-2 text-slate-800 dark:text-white uppercase tracking-tighter">
                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                    Proyectos Recientes
                </h2>
                <Link to="/proyectos" className="text-primary text-xs font-black flex items-center gap-1 hover:underline uppercase tracking-widest">
                    Ver Todo <LucideChevronRight size={14} />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                    <div 
                        key={project.id} 
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/50 transition-all group cursor-pointer" 
                        onClick={() => onProjectClick(project.id)}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="font-black text-slate-900 dark:text-white leading-tight mb-1">{project.name}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{project.client}</p>
                            </div>
                            <span className={`${project.statusColor} text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-sm`}>
                                {project.status}
                            </span>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <div className="flex justify-between text-[10px] font-black uppercase mb-2 tracking-widest">
                                    <span className="text-slate-400">Avance Técnico</span>
                                    <span className="text-primary">{project.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner">
                                    <div className="bg-accent h-full transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 py-3 border-t border-slate-50 dark:border-slate-800/50">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                                    <LucideCalendar size={14} className="text-slate-400" />
                                    Inicio: {project.startDate}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentProjects;

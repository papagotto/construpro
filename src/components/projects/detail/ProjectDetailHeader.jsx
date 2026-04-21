import React from 'react';
import { Link } from 'react-router-dom';
import { LucideEdit3 } from 'lucide-react';

const ProjectDetailHeader = ({ project, onEdit }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <nav className="flex mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <Link to="/proyectos" className="hover:text-primary transition-colors">Obras</Link>
                    <span className="mx-2 opacity-30">/</span>
                    <span className="text-primary">{project.nombre}</span>
                </nav>
                <div className="flex items-center gap-4">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{project.nombre}</h1>
                    <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm ${project.stageColor}`}>
                        {project.stage}
                    </span>
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={onEdit} className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white border border-slate-200 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
                    <LucideEdit3 size={14} /> Gestión
                </button>
            </div>
        </div>
    );
};

export default ProjectDetailHeader;

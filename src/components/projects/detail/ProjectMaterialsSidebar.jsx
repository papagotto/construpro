import React from 'react';
import { LucideCalculator, LucidePackage, LucideAlertTriangle } from 'lucide-react';

const ProjectMaterialsSidebar = ({ 
    activeTaskId, 
    activeRubroId, 
    activeStageId, 
    project, 
    materials, 
    onClearSelection 
}) => {
    const title = activeTaskId ? 'Cómputo por Tarea' : 
                  activeRubroId ? 'Cómputo por Rubro' : 
                  activeStageId ? 'Cómputo por Etapa' : 'Cómputo Global';

    const subtitle = activeTaskId ? (
        project.stages.flatMap(s => s.rubros).flatMap(r => r.tasks).find(t => t.id === activeTaskId)?.titulo
    ) : activeRubroId ? (
        project.stages.flatMap(s => s.rubros).find(r => r.id === activeRubroId)?.nombre
    ) : activeStageId ? (
        project.stages.find(s => s.id === activeStageId)?.nombre 
    ) : 'Total de la Obra';

    return (
        <div className="bg-slate-900 rounded-[32px] p-8 shadow-2xl text-white">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/20 text-primary rounded-2xl">
                    <LucideCalculator size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-black tracking-tight">{title}</h3>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest truncate max-w-[200px]">
                        {subtitle}
                    </p>
                </div>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {materials.length > 0 ? (
                    materials.map((mat, idx) => (
                        <div key={idx} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                            <div>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{mat.nombre}</p>
                                <p className="text-lg font-black">{mat.cantidad.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {mat.unidad}</p>
                            </div>
                            <LucidePackage size={20} className="text-primary opacity-50" />
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center opacity-30">
                        <LucideAlertTriangle size={32} className="mx-auto mb-4" />
                        <p className="text-xs font-bold uppercase tracking-widest px-4">No hay materiales calculados para esta selección</p>
                    </div>
                )}
            </div>

            {(activeStageId || activeRubroId || activeTaskId) && (
                <button 
                    onClick={onClearSelection}
                    className="w-full mt-8 py-4 bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-white/5"
                >
                    Ver Cómputo Global
                </button>
            )}
        </div>
    );
};

export default ProjectMaterialsSidebar;

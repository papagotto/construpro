import React from 'react';
import { DraftingCompass as LucideArchitecture, LucideClock } from 'lucide-react';

const RubroDefinitionPanel = ({ rubro, setRubro, unidades, onUpdate }) => {
    return (
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                    <LucideArchitecture size={24} />
                </div>
                <h2 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Definición Rubro</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Nombre del Rubro</label>
                    <input 
                        type="text" 
                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-white outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary/20"
                        value={rubro.nombre}
                        onChange={(e) => setRubro({...rubro, nombre: e.target.value})}
                        onBlur={(e) => onUpdate({ nombre: e.target.value })}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Unidad</label>
                        <select 
                            className="select-custom !p-2 !ring-1"
                            value={rubro.unidad_id || ''}
                            onChange={(e) => onUpdate({ unidad_id: e.target.value })}
                        >
                            <option value="">Seleccionar...</option>
                            {unidades.map(u => (
                                <option key={u.id} value={u.id}>{u.nombre} ({u.simbolo})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Personal</label>
                        <input 
                            type="number" 
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-white outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary/20"
                            value={rubro.personal_minimo}
                            onChange={(e) => setRubro({...rubro, personal_minimo: e.target.value})}
                            onBlur={(e) => onUpdate({ personal_minimo: parseInt(e.target.value) })}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 flex justify-between px-1">
                        <span>Rendimiento</span>
                        <span className="text-primary normal-case">h / {rubro.unidades_medida?.simbolo || 'u'}</span>
                    </label>
                    <div className="relative">
                        <LucideClock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="number" 
                            step="0.01"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-white outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary/20"
                            value={rubro.rendimiento_mano_obra}
                            onChange={(e) => setRubro({...rubro, rendimiento_mano_obra: e.target.value})}
                            onBlur={(e) => onUpdate({ rendimiento_mano_obra: parseFloat(e.target.value) })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RubroDefinitionPanel;

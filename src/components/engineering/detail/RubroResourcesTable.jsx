import React from 'react';
import { LucidePackage, LucideTrash2 } from 'lucide-react';

const RubroResourcesTable = ({ materiales, unidadSimbolo, onUpdateQty, onRemove }) => {
    return (
        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-2">
                    <LucidePackage className="text-emerald-500" size={20} />
                    <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-sm">Cómputo de Materiales</h3>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{materiales.length} RECURSOS</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {materiales.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 text-sm italic">
                        Sin materiales vinculados. Utilice el buscador inferior.
                    </div>
                ) : (
                    materiales.map(m => (
                        <div key={m.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-none group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                                    <LucidePackage size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white uppercase">{m.recursos?.nombre_interno}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{m.recursos?.categoria} • SKU: {m.recursos?.sku || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Cant. / {unidadSimbolo || 'u'}</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="number"
                                            step="0.001"
                                            className="w-24 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-black text-center focus:ring-2 focus:ring-primary/20 outline-none"
                                            value={m.cantidad_por_unidad}
                                            onChange={(e) => onUpdateQty(m.id, e.target.value)}
                                        />
                                        <span className="text-xs font-black text-slate-400 uppercase w-12">{m.recursos?.unidad_base || m.recursos?.unit_base}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onRemove(m.id)}
                                    className="p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <LucideTrash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RubroResourcesTable;

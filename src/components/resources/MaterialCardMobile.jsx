import React from 'react';
import { LucideMapPin } from 'lucide-react';

const MaterialCardMobile = ({ materials, onMaterialClick }) => {
    return (
        <div className="md:hidden space-y-4 mb-8">
            {materials.map((item) => (
                <div 
                    key={item.id} 
                    className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 active:scale-[0.98] transition-all"
                    onClick={() => onMaterialClick(item.id)}
                >
                    <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700">
                            <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase truncate">{item.name}</h3>
                                    <p className="text-[10px] font-mono text-slate-400 mt-0.5 tracking-wider">SKU: {item.sku}</p>
                                </div>
                                <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded shadow-sm ${item.categoryColor}`}>
                                    {item.category}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-3 grid grid-cols-2 gap-4 border border-slate-100 dark:border-slate-800/50">
                        <div className="space-y-1">
                            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Stock Disponible</p>
                            <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 dark:text-slate-300">
                                {item.stock.toLocaleString()} <span className="text-[10px] opacity-50">{item.unit}</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Estado Nivel</p>
                            <div className="w-full h-1.5 bg-white dark:bg-slate-700 rounded-full overflow-hidden mt-1.5">
                                <div className={`h-full rounded-full ${item.progressColor}`} style={{ width: `${item.progress}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {item.location && (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase px-1">
                            <LucideMapPin size={12} className="text-primary" />
                            <span>Ubicación: {item.location}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MaterialCardMobile;

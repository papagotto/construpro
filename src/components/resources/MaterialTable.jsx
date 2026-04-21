import React from 'react';
import { LucideMoreVertical } from 'lucide-react';

const MaterialTable = ({ materials, loading, onMaterialClick }) => {
    if (loading) {
        return <div className="p-12 text-center text-slate-500 uppercase tracking-widest text-xs font-bold animate-pulse">Sincronizando inventario técnico...</div>;
    }

    return (
        <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Material</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">SKU</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoría</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock Total</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {materials.map((item) => (
                        <tr 
                            key={item.id} 
                            className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                            onClick={() => onMaterialClick(item.id)}
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                                        <img alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" src={item.image} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-900 dark:text-white uppercase">{item.name}</p>
                                        <p className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{item.description}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-xs font-black font-mono text-slate-400">{item.sku}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${item.categoryColor}`}>
                                    {item.category}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-1.5">
                                    <span className={`text-sm font-black ${item.stock < 100 ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
                                        {item.stock.toLocaleString()} <span className="text-[10px] opacity-50 uppercase">{item.unit}</span>
                                    </span>
                                    <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-700 ${item.progressColor}`} style={{ width: `${item.progress}%` }}></div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); }}
                                    className="p-2 text-slate-300 hover:text-primary transition-colors"
                                >
                                    <LucideMoreVertical size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MaterialTable;

import React from 'react';
import { LucideEdit3, LucideTrash2 } from 'lucide-react';

const UnitsTable = ({ unidades, loading, onEdit, onDelete }) => {
    if (loading) {
        return (
            <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                Actualizando sistema métrico...
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Símbolo</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Factor vs Base</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {unidades.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-700 dark:text-slate-300">{u.nombre}</span>
                                    {u.es_base && <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black uppercase rounded">Maestra</span>}
                                </div>
                            </td>
                            <td className="px-6 py-4 font-black text-primary uppercase text-sm">{u.simbolo}</td>
                            <td className="px-6 py-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{u.tipo}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <div className="text-sm font-bold text-slate-600 dark:text-slate-400">
                                    {u.es_base ? '1.0' : `× ${u.factor_conversion_base}`}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => onEdit(u)}
                                        className="p-2 text-slate-300 hover:text-primary transition-colors"
                                    >
                                        <LucideEdit3 size={18} />
                                    </button>
                                    <button 
                                        onClick={() => onDelete(u.id)}
                                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                        <LucideTrash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UnitsTable;

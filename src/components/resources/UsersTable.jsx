import React from 'react';
import { LucideUser, LucideBriefcase, LucideSettings, LucideTrash2 } from 'lucide-react';

const UsersTable = ({ users, loading, getStatusColor, onSettingsClick, onDeleteClick }) => {
    if (loading) {
        return <div className="p-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Sincronizando nómina...</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Integrante</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rol / Nivel</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Proyecto Asignado</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Estado</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                        <LucideUser size={20} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">{u.identificador_usuario.split('@')[0]}</p>
                                        <p className="text-[11px] text-slate-500 font-medium">{u.identificador_usuario}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-tight border border-primary/10">
                                        {u.roles?.nombre || 'Sin Rol'}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400">LVL {u.roles?.nivel_acceso || 0}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                                    <LucideBriefcase size={14} className="text-slate-400" />
                                    {u.proyectos?.nombre || 'Flotante / Global'}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusColor(u.estado)}`}>
                                    {u.estado ? 'Activo' : 'Inactivo'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => onSettingsClick(u.id)}
                                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                    >
                                        <LucideSettings size={18} />
                                    </button>
                                    <button 
                                        onClick={() => onDeleteClick(u.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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

export default UsersTable;

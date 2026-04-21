import React from 'react';
import { LucideHistory, LucideUserCheck } from 'lucide-react';

const EquipmentTechPanel = ({ 
    item, 
    editData, 
    setEditData, 
    isEditing 
}) => {
    return (
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Especificaciones de Maquinaria</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Modelo / Serie</label>
                        {isEditing ? (
                            <input 
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-bold border-none outline-none ring-2 ring-primary/10 focus:ring-primary"
                                value={editData.modelo || ''}
                                onChange={(e) => setEditData({...editData, modelo: e.target.value})}
                            />
                        ) : (
                            <p className="text-sm font-bold text-slate-700 dark:text-white uppercase">{item.modelo || 'S/D'}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Identificador (ID)</label>
                        {isEditing ? (
                            <input 
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-bold border-none outline-none ring-2 ring-primary/10 focus:ring-primary"
                                value={editData.codigo || ''}
                                onChange={(e) => setEditData({...editData, codigo: e.target.value})}
                            />
                        ) : (
                            <p className="text-sm font-mono font-bold text-slate-500 uppercase">{item.codigo || 'EQ-N/A'}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Límite para Mantenimiento</label>
                        {isEditing ? (
                            <div className="relative">
                                <input 
                                    type="number"
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-bold border-none outline-none ring-2 ring-primary/10 focus:ring-primary"
                                    value={editData.horas_mantenimiento_limite}
                                    onChange={(e) => setEditData({...editData, horas_mantenimiento_limite: e.target.value})}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">HRS</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <LucideHistory size={16} className="text-amber-500" />
                                <p className="text-sm font-bold text-slate-700 dark:text-white">{item.horas_mantenimiento_limite || 2000} hrs</p>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Estado Operativo</label>
                        {isEditing ? (
                            <select 
                                className="select-custom !p-2.5 !ring-1"
                                value={editData.estado}
                                onChange={(e) => setEditData({...editData, estado: e.target.value})}
                            >
                                <option value="disponible">Disponible</option>
                                <option value="uso">En Uso</option>
                                <option value="mantenimiento">En Mantenimiento</option>
                            </select>
                        ) : (
                            <div className="flex items-center gap-2">
                                <LucideUserCheck size={16} className="text-primary" />
                                <p className="text-sm font-bold text-slate-700 dark:text-white uppercase">{item.estado}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentTechPanel;

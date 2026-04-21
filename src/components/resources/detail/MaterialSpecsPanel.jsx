import React from 'react';
import { LucideLayers, LucidePlus, LucideTrash2, LucideInfo } from 'lucide-react';

const MaterialSpecsPanel = ({ 
    presentaciones, 
    unidadBase, 
    onAddPresentation, 
    onDeletePresentation,
    isEditing,
    editData,
    setEditData,
    unidades,
    tiposMedida
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-xs flex items-center gap-2">
                        <LucideLayers size={16} className="text-primary" /> Presentaciones
                    </h3>
                    <button onClick={onAddPresentation} className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-primary/10 hover:text-primary transition-all">
                        <LucidePlus size={14} />
                    </button>
                </div>
                <div className="p-2 space-y-1">
                    {presentaciones.map(pres => (
                        <div key={pres.id} className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl transition-colors group">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase">{pres.nombre}</span>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-full">{pres.cantidad_en_unidad_base} {unidadBase}</span>
                                <button onClick={() => onDeletePresentation(pres.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all">
                                    <LucideTrash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Notas y Configuración Técnica</h3>
                <div className="space-y-6">
                    {isEditing && (
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-4 border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in-95">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Tipo de Medida</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {tiposMedida.map(tipo => (
                                        <button 
                                            key={tipo.id}
                                            onClick={() => setEditData({...editData, tipo_medida: tipo.id})}
                                            className={`flex items-center gap-2 p-2.5 rounded-lg text-[10px] font-black uppercase border-2 transition-all ${
                                                editData.tipo_medida === tipo.id 
                                                ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                                                : 'border-white dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 hover:border-slate-200'
                                            }`}
                                        >
                                            <tipo.icon size={14} />
                                            {tipo.label.split(' ')[0]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Unidad de Gestión (Base)</label>
                                <select 
                                    className="w-full bg-white dark:bg-slate-900 border-2 border-primary/10 rounded-xl text-sm font-black text-primary p-3 outline-none focus:border-primary cursor-pointer shadow-sm"
                                    value={editData.unidad_base || ''}
                                    onChange={(e) => setEditData({...editData, unidad_base: e.target.value})}
                                >
                                    <option value="" disabled>Seleccionar unidad...</option>
                                    {unidades.filter(u => u.tipo === editData.tipo_medida).map(u => (
                                        <option key={u.id} value={u.simbolo}>{u.nombre} ({u.simbolo})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border-l-4 border-primary/40 min-h-[100px]">
                        {isEditing ? (
                            <textarea 
                                className="w-full text-xs text-slate-700 dark:text-white leading-relaxed bg-transparent outline-none resize-none font-medium"
                                rows={4}
                                value={editData.descripcion || ''}
                                onChange={(e) => setEditData({...editData, descripcion: e.target.value})}
                                placeholder="Añadir descripción técnica detallada..."
                            />
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <LucideInfo size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Información Registrada</span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                    {editData.descripcion || 'Sin especificaciones registradas.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaterialSpecsPanel;

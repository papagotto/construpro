import React from 'react';
import { LucideX, LucideAlertTriangle } from 'lucide-react';

const UnitModal = ({ 
    showModal, 
    setShowModal, 
    isEditing, 
    currentUnit, 
    setCurrentUnit, 
    TIPOS, 
    onSave 
}) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        {isEditing ? 'Editar Unidad' : 'Nueva Unidad Técnica'}
                    </h3>
                    <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><LucideX size={20} /></button>
                </div>
                
                <div className="p-6 space-y-4">
                    {isEditing && !currentUnit.es_base && (
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-xl flex gap-3">
                            <LucideAlertTriangle className="text-amber-500 shrink-0" size={20} />
                            <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold leading-tight uppercase">
                                Cuidado: Cambiar el factor alterará todos los cálculos de stock y APU existentes.
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Nombre</label>
                            <input 
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-white outline-none" 
                                value={currentUnit.nombre}
                                onChange={(e) => setCurrentUnit({...currentUnit, nombre: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Símbolo</label>
                            <input 
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-white outline-none" 
                                value={currentUnit.simbolo}
                                onChange={(e) => setCurrentUnit({...currentUnit, simbolo: e.target.value})}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Categoría</label>
                        <select 
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-white outline-none"
                            value={currentUnit.tipo}
                            disabled={isEditing}
                            onChange={(e) => setCurrentUnit({...currentUnit, tipo: e.target.value})}
                        >
                            {TIPOS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 flex justify-between">
                            <span>Factor de Conversión</span>
                            {currentUnit.es_base && <span className="text-primary normal-case">Unidad Base (Fijo 1.0)</span>}
                        </label>
                        <input 
                            type="number" 
                            step="0.000001"
                            className={`w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-white outline-none ${currentUnit.es_base ? 'opacity-50 cursor-not-allowed' : ''}`}
                            value={currentUnit.factor_conversion_base}
                            disabled={currentUnit.es_base}
                            onChange={(e) => setCurrentUnit({...currentUnit, factor_conversion_base: e.target.value})}
                        />
                    </div>

                    {!isEditing && (
                        <label className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="w-4 h-4 rounded text-primary focus:ring-primary"
                                checked={currentUnit.es_base}
                                onChange={(e) => setCurrentUnit({...currentUnit, es_base: e.target.checked, factor_conversion_base: e.target.checked ? 1 : currentUnit.factor_conversion_base})}
                            />
                            <span className="text-xs font-bold text-primary uppercase">Establecer como Nueva Unidad Base</span>
                        </label>
                    )}
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                    <button onClick={() => setShowModal(false)} className="flex-1 py-3 text-sm font-bold text-slate-500">Cancelar</button>
                    <button 
                        onClick={onSave}
                        className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-black shadow-lg shadow-primary/20"
                    >
                        {isEditing ? 'Actualizar' : 'Guardar Unidad'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnitModal;

import React from 'react';
import { LucideX } from 'lucide-react';

const ApuModal = ({ showModal, setShowModal, newRubro, setNewRubro, unidades, onCreate }) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in duration-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Nuevo Rubro Maestro</h3>
                    <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><LucideX size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Nombre</label>
                        <input 
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-white outline-none ring-2 ring-primary/10 focus:ring-primary transition-all" 
                            placeholder="Ej: Mampostería de Elevación"
                            value={newRubro.nombre}
                            onChange={(e) => setNewRubro({...newRubro, nombre: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Unidad</label>
                            <select 
                                className="select-custom"
                                value={newRubro.unidad_id}
                                onChange={(e) => setNewRubro({...newRubro, unidad_id: e.target.value})}
                            >
                                {unidades.map(u => (
                                    <option key={u.id} value={u.id}>{u.nombre} ({u.simbolo})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Min. Personas</label>
                            <input 
                                type="number" 
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-white outline-none ring-2 ring-primary/10 focus:ring-primary transition-all" 
                                value={newRubro.personal_minimo}
                                onChange={(e) => setNewRubro({...newRubro, personal_minimo: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                    <button onClick={() => setShowModal(false)} className="flex-1 py-3 text-sm font-bold text-slate-500">Cancelar</button>
                    <button 
                        onClick={onCreate}
                        className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-black shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                    >
                        Crear y Configurar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApuModal;

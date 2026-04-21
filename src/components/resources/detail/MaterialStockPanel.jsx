import React from 'react';
import { LucideMapPin, LucideAlertTriangle, LucideTruck, LucidePackage, LucideX } from 'lucide-react';

const MaterialStockPanel = ({ 
    ubicacionesStock, 
    unidadBase, 
    showAdjustStock, 
    setShowAdjustStock, 
    adjustStockData, 
    setAdjustStockData, 
    todasUbicaciones, 
    handleAdjustStock 
}) => {
    return (
        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex items-center gap-2">
                    <LucideMapPin className="text-primary" size={20} />
                    <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-sm">Distribución en Puntos de Stock</h3>
                </div>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {ubicacionesStock.length === 0 ? (
                    <div className="p-10 text-center">
                        <LucideAlertTriangle size={32} className="mx-auto text-amber-500 mb-3 opacity-20" />
                        <p className="text-xs font-bold text-slate-400 uppercase italic">No hay stock registrado en ninguna ubicación.</p>
                    </div>
                ) : (
                    ubicacionesStock.map(loc => (
                        <div key={loc.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${loc.ubicaciones?.tipo === 'obra' ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-100 text-slate-500'}`}>
                                    {loc.ubicaciones?.tipo === 'obra' ? <LucideTruck size={16} /> : <LucidePackage size={16} />}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase">{loc.ubicaciones?.nombre}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{loc.ubicaciones?.tipo}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-black text-slate-900 dark:text-white">
                                    {loc.cantidad_actual.toLocaleString()} <span className="text-[10px] text-slate-400 uppercase">{unidadBase}</span>
                                </p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Último movimiento: {new Date(loc.updated_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showAdjustStock && (
                <div className="p-6 bg-primary/5 border-t border-primary/10 animate-in slide-in-from-bottom-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-1">
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Punto de Stock</label>
                            <select 
                                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold outline-none"
                                value={adjustStockData.ubicacion_id}
                                onChange={(e) => setAdjustStockData({...adjustStockData, ubicacion_id: e.target.value})}
                            >
                                {todasUbicaciones.map(u => (
                                    <option key={u.id} value={u.id}>{u.nombre} ({u.tipo})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Operación</label>
                            <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                                <button 
                                    onClick={() => setAdjustStockData({...adjustStockData, tipo: 'entrada'})}
                                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${adjustStockData.tipo === 'entrada' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400'}`}
                                >
                                    Entrada
                                </button>
                                <button 
                                    onClick={() => setAdjustStockData({...adjustStockData, tipo: 'salida'})}
                                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${adjustStockData.tipo === 'salida' ? 'bg-red-500 text-white shadow-md' : 'text-slate-400'}`}
                                >
                                    Salida
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Cantidad ({unidadBase})</label>
                            <input 
                                type="number"
                                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold outline-none"
                                value={adjustStockData.cantidad}
                                onChange={(e) => setAdjustStockData({...adjustStockData, cantidad: e.target.value})}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={handleAdjustStock}
                                className="flex-1 bg-primary text-white p-2.5 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-primary/20"
                            >
                                Confirmar
                            </button>
                            <button 
                                onClick={() => setShowAdjustStock(false)}
                                className="p-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <LucideX size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaterialStockPanel;

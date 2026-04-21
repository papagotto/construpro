import React from 'react';
import { Link } from 'react-router-dom';

const EquipmentGrid = ({ equipment, loading }) => {
    if (loading) {
        return <div className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Cargando flota de equipos...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {equipment.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="h-48 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                        <img 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            alt={item.name} 
                            src={item.image} 
                        />
                        <span className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm ${item.statusColor}`}>
                            {item.status}
                        </span>
                    </div>
                    <div className="p-5">
                        <h3 className="font-bold text-slate-900 dark:text-white truncate" title={item.name}>{item.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">ID: {item.code}</p>
                        <div className={`mt-4 flex items-center space-x-2 text-xs font-medium p-2 rounded ${item.isWarning ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20' : 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50'}`}>
                            <span className="material-icons text-sm">{item.isWarning ? 'warning' : 'event_note'}</span>
                            <span>Mantenimiento: {item.maintenanceDate}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-5">
                            <Link 
                                to={`/recursos-equipos/${item.id}`}
                                className="py-2 text-xs font-semibold text-center text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                            >
                                Ver Detalles
                            </Link>
                            <button
                                className={`py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded transition-colors ${item.status === 'Mantenimiento' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={item.status === 'Mantenimiento'}
                            >
                                Asignar
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EquipmentGrid;

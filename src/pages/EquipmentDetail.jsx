import { useParams, Link } from 'react-router-dom';
import { equipment } from '../data/mockData';

const EquipmentDetail = () => {
    const { id } = useParams();
    const item = equipment.find(e => e.id === parseInt(id));

    if (!item) {
        return <div className="p-8">Equipamiento no encontrado</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Content Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <nav className="flex mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <Link to="/recursos-equipos" className="hover:text-primary transition-colors">Recursos</Link>
                        <span className="mx-2">/</span>
                        <Link to="/recursos-equipos" className="hover:text-primary transition-colors">Equipamiento</Link>
                        <span className="mx-2">/</span>
                        <span className="text-primary">{item.name}</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{item.name}</h1>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${item.statusColor}`}>
                            {item.status}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-orange-600 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors">
                        Reportar Falla
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 shadow-sm transition-all">
                        + Agendar Mantenimiento
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Image and Usage */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm aspect-video lg:aspect-square">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Uso del Equipamiento</h3>
                        <div className="mb-4">
                            <span className="text-4xl font-black text-slate-900 dark:text-white">{item.hours || '0 hrs'}</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 mb-2">
                            <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <p className="text-xs text-slate-400 mb-6">65% de vida útil antes de mantenimiento mayor</p>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                            <span className="material-icons text-primary text-base">location_on</span>
                            <span className="font-medium">{item.location || 'Ubicación no disponible'}</span>
                        </div>
                    </div>
                </div>

                {/* Columns 2-3: Services and Specs */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Próximo Mantenimiento</h3>
                            <div className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                                {item.maintenanceDate}
                            </div>
                            <p className="text-sm text-slate-400 mb-4 italic">Servicio preventivo de 1,500 hrs</p>
                            
                            <div className="space-y-4">
                                <p className="text-xs font-bold text-slate-400 uppercase">Historial Reciente</p>
                                {item.maintenanceHistory?.map((service, idx) => (
                                    <div key={idx} className="flex gap-4 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{service.service}</p>
                                            <p className="text-xs text-slate-400">{service.date} • {service.tech}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Operadores Autorizados</h3>
                                <div className="flex -space-x-3 mb-4">
                                    {item.operators?.map((op, idx) => (
                                        <div key={idx} className="w-10 h-10 rounded-full border-2 border-white dark:border-surface-dark bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                                            {op[0]}
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-white dark:border-surface-dark bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                                        +
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500">{item.operators?.join(', ')}</p>
                            </div>

                            <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Especificaciones Técnicas</h3>
                                <dl className="grid grid-cols-2 gap-4">
                                    {item.specs?.map((spec, idx) => (
                                        <div key={idx}>
                                            <dt className="text-xs text-slate-400 mb-1">{spec.label}</dt>
                                            <dd className="text-sm font-bold text-slate-700 dark:text-slate-300">{spec.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentDetail;

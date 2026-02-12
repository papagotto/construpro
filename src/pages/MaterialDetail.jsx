import { useParams, Link } from 'react-router-dom';
import { materials } from '../data/mockData';

const MaterialDetail = () => {
    const { id } = useParams();
    const material = materials.find(m => m.id === parseInt(id));

    if (!material) {
        return <div className="p-8">Material no encontrado</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Content Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <nav className="flex mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <Link to="/recursos-materiales" className="hover:text-primary transition-colors">Recursos</Link>
                        <span className="mx-2">/</span>
                        <Link to="/recursos-materiales" className="hover:text-primary transition-colors">Materiales</Link>
                        <span className="mx-2">/</span>
                        <span className="text-primary">{material.name}</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{material.name}</h1>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            Stock Saludable
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                        Eliminar
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 shadow-sm transition-all">
                        + Editar Material
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Image and Stock */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <img src={material.image} alt={material.name} className="w-full h-64 object-cover" />
                    </div>
                    
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Estado de Inventario</h3>
                        <div className="mb-4">
                            <span className="text-4xl font-black text-slate-900 dark:text-white">{material.stock.toLocaleString()}</span>
                            <span className="ml-2 text-slate-500 lowercase font-medium">{material.unit}</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 mb-4">
                            <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${material.progress}%` }}></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mt-6">
                            <div>
                                <p className="text-slate-400 mb-1">SKU</p>
                                <p className="font-bold text-slate-700 dark:text-slate-300">{material.sku}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 mb-1">Ubicación</p>
                                <p className="font-bold text-slate-700 dark:text-slate-300">{material.location}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columns 2-3: Details and History */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Especificaciones Técnicas</h3>
                            <dl className="space-y-3">
                                {material.specifications.map((spec, idx) => (
                                    <div key={idx} className="flex justify-between border-b border-slate-50 dark:border-slate-800/50 pb-2 last:border-0">
                                        <dt className="text-slate-500">{spec.label}</dt>
                                        <dd className="font-bold text-slate-800 dark:text-slate-200">{spec.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                        
                        <div className="bg-orange-50/50 dark:bg-orange-900/10 p-6 rounded-xl border border-orange-100 dark:border-orange-900/30 shadow-sm flex items-start gap-4">
                            <span className="material-icons text-orange-500">warning</span>
                            <div>
                                <h3 className="font-bold text-orange-800 dark:text-orange-400 mb-1">Configuración de Alerta</h3>
                                <p className="text-orange-700 dark:text-orange-300 text-sm leading-relaxed">{material.alert || 'Sin alertas configuradas'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Historial de Uso Reciente</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                        <th className="pb-3 font-medium">Fecha</th>
                                        <th className="pb-3 font-medium">Proyecto</th>
                                        <th className="pb-3 font-medium">Cantidad</th>
                                        <th className="pb-3 font-medium">Responsable</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {material.usageHistory.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="py-3 text-slate-500">{item.date}</td>
                                            <td className="py-3 font-bold text-slate-700 dark:text-slate-300">{item.project}</td>
                                            <td className="py-3 text-slate-800 dark:text-slate-200">{item.quantity}</td>
                                            <td className="py-3 text-slate-500">{item.responsible}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaterialDetail;

import { Link, useNavigate } from 'react-router-dom';
import { materials } from '../data/mockData';

const Materials = () => {
    const navigate = useNavigate();

    return (
        <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Catálogo de Recursos</h1>
                    <p className="text-slate-500 text-sm">Gestione el inventario de materiales y equipamiento de construcción.</p>
                </div>
                <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm">
                    <span className="material-icons text-sm">add</span>
                    Añadir Material
                </button>
            </div>

            <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
                <button className="px-6 py-3 text-sm font-semibold border-b-2 border-primary text-primary">Materiales</button>
                <Link
                    to="/recursos-equipos"
                    className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-b-2 border-transparent"
                >
                    Equipamiento
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 items-center mb-6 shadow-sm">
                <div className="relative flex-1 min-w-[240px]">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">inventory</span>
                    <input
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm focus:ring-primary focus:border-primary"
                        placeholder="Buscar por SKU o Nombre..."
                        type="text"
                    />
                </div>
                <select className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm focus:ring-primary focus:border-primary px-4 py-2 min-w-[160px]">
                    <option value="">Todas las Categorías</option>
                    <option value="cemento">Cemento</option>
                    <option value="acero">Acero</option>
                    <option value="madera">Madera</option>
                </select>
                <select className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm focus:ring-primary focus:border-primary px-4 py-2 min-w-[160px]">
                    <option value="">Disponibilidad</option>
                    <option value="high">Stock Alto</option>
                    <option value="low">Stock Bajo</option>
                    <option value="out">Sin Stock</option>
                </select>
                <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-icons text-slate-600 dark:text-slate-400">filter_list</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Material</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">SKU</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoría</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ubicación</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {materials.map((item) => (
                                <tr 
                                    key={item.id} 
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                                    onClick={() => navigate(`/recursos-materiales/${item.id}`)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700">
                                                <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-slate-900 dark:text-white">{item.name}</p>
                                                <p className="text-xs text-slate-500">{item.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono text-slate-500">{item.sku}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.categoryColor}`}>
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-sm font-semibold ${item.stock < 100 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                                                {item.stock.toLocaleString()} {item.unit}
                                            </span>
                                            <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${item.progressColor}`} style={{ width: `${item.progress}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                                            <span className="material-icons text-sm">location_on</span>
                                            {item.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                            <span className="material-icons">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Mostrando <span className="font-medium text-slate-900 dark:text-white">1 - {materials.length}</span> de <span className="font-medium text-slate-900 dark:text-white">{materials.length}</span> materiales
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded text-sm disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" disabled>Anterior</button>
                        <button className="px-3 py-1 bg-primary text-white rounded text-sm font-medium">1</button>
                        <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">2</button>
                        <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">3</button>
                        <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Siguiente</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Materials;

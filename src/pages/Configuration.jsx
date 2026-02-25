import { settings } from '../data/mockData';

const Configuration = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Configuración del Sistema</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Administra las preferencias generales, notificaciones y seguridad de la plataforma.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {settings.sections.map((section) => (
                    <div key={section.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500">
                                <span className="material-icons-outlined">{section.icon}</span>
                            </div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{section.title}</h2>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {section.items.map((item, idx) => (
                                <div key={idx} className="p-6 flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                                    {item.type === 'toggle' ? (
                                        <button
                                            className={`w-11 h-6 rounded-full relative transition-colors p-1 ${item.enabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                                        >
                                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${item.enabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                        </button>
                                    ) : item.type === 'button' ? (
                                        <button className="text-primary text-sm font-bold hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors border border-primary/20">
                                            Actualizar
                                        </button>
                                    ) : item.type === 'link' ? (
                                        <button className="text-primary text-sm font-bold hover:underline">Gestionar</button>
                                    ) : (
                                        <span className="text-sm text-slate-500">{item.value}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-900/20 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h4 className="text-red-800 dark:text-red-400 font-bold">Zona de Peligro</h4>
                    <p className="text-red-600/70 dark:text-red-400/50 text-xs mt-1">Elimina tu cuenta y todos los datos asociados de forma permanente.</p>
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-sm">
                    Eliminar Cuenta
                </button>
            </div>
        </div>
    );
};

export default Configuration;

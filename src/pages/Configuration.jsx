import { settings } from '../data/mockData';

const Configuration = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configuración</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Administra tu perfil, preferencias y seguridad de la cuenta.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Perfil de Usuario</h2>
                </div>
                <div className="p-6 flex flex-col md:flex-row gap-8 items-start">
                    <div className="relative group">
                        <img
                            src={settings.profile.avatar}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-50 dark:ring-slate-800 transition-all group-hover:ring-primary/20"
                        />
                        <button className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-lg border-2 border-white dark:border-slate-900 hover:scale-110 transition-transform">
                            <span className="material-icons text-sm">photo_camera</span>
                        </button>
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Nombre Completo</label>
                            <input
                                type="text"
                                defaultValue={settings.profile.name}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary focus:outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Cargo</label>
                            <input
                                type="text"
                                defaultValue={settings.profile.role}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary focus:outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Correo Electrónico</label>
                            <input
                                type="email"
                                defaultValue={settings.profile.email}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary focus:outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Teléfono</label>
                            <input
                                type="tel"
                                defaultValue={settings.profile.phone}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                    <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-sm">
                        Guardar Cambios
                    </button>
                </div>
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

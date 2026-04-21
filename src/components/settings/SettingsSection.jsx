import React from 'react';

const SettingsSection = ({ section }) => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
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
    );
};

export default SettingsSection;

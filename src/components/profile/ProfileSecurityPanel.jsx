import React from 'react';

const ProfileSecurityPanel = ({ accessLevel, userId }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                    Nivel de Acceso
                </h3>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <span className="text-xl font-black">{accessLevel || 0}</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Nivel Autorizado</p>
                        <p className="text-xs text-slate-500">Determina los módulos visibles en el sistema.</p>
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-slate-400 rounded-full"></span>
                    Seguridad
                </h3>
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">UID del Sistema</p>
                    <code className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 p-2 rounded-lg block truncate text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {userId}
                    </code>
                </div>
            </div>
        </div>
    );
};

export default ProfileSecurityPanel;

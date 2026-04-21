import React from "react";

const DangerZone = ({ onDeleteAccount }) => {
    return (
        <div className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-900/20 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
                <h4 className="text-red-800 dark:text-red-400 font-bold">Zona de Peligro</h4>
                <p className="text-red-600/70 dark:text-red-400/50 text-xs mt-1">Elimina tu cuenta y todos los datos asociados de forma permanente.</p>
            </div>
            <button 
                onClick={onDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-sm"
            >
                Eliminar Cuenta
            </button>
        </div>
    );
};

export default DangerZone;

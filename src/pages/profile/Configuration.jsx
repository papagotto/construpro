import React from 'react';
import { settings } from '../data/mockData';
import SettingsSection from '../../components/settings/SettingsSection';
import DangerZone from '../../components/settings/DangerZone';

const Configuration = () => {
    const handleDeleteAccount = () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta de forma permanente? Esta acción no se puede deshacer.')) {
            console.log('Eliminando cuenta...');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Configuración del Sistema</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Administra las preferencias generales, notificaciones y seguridad de la plataforma.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {settings.sections.map((section) => (
                    <SettingsSection key={section.id} section={section} />
                ))}
            </div>

            <DangerZone onDeleteAccount={handleDeleteAccount} />
        </div>
    );
};

export default Configuration;

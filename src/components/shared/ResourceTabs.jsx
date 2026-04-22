import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ResourceTabs = () => {
    const location = useLocation();
    
    const tabs = [
        { label: 'Materiales', path: '/recursos-materiales' },
        { label: 'Equipamiento', path: '/recursos-equipos' },
        { label: 'Personal', path: '/recursos-personal' }
    ];

    return (
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
            {tabs.map((tab) => {
                const isActive = location.pathname === tab.path;
                return (
                    <Link
                        key={tab.path}
                        to={tab.path}
                        className={`px-6 py-3 text-sm font-medium transition-all ${
                            isActive 
                            ? 'border-b-2 border-primary text-primary font-semibold' 
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-b-2 border-transparent'
                        }`}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </div>
    );
};

export default ResourceTabs;

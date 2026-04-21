import React from 'react';
import { LucideSearch, LucideFilter, LucideSettings2 } from 'lucide-react';

const SearchBar = ({ 
    placeholder, 
    value, 
    onChange, 
    showFilter = true, 
    showSettings = false,
    onSettingsClick 
}) => {
    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center mb-6 shadow-sm">
            <div className="relative w-full md:flex-1">
                <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm focus:ring-primary focus:border-primary transition-all shadow-inner outline-none"
                    placeholder={placeholder || "Buscar..."}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                {showFilter && (
                    <button className="flex-1 md:w-auto p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex justify-center items-center">
                        <LucideFilter className="text-slate-600 dark:text-slate-400" size={18} />
                    </button>
                )}
                {showSettings && (
                    <button 
                        onClick={onSettingsClick}
                        className="flex-1 md:w-auto p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex justify-center items-center"
                    >
                        <LucideSettings2 size={18} className="text-slate-600 dark:text-slate-400" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;

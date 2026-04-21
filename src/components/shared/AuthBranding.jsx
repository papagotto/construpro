import React from 'react';
import { LucideHardHat } from 'lucide-react';

const AuthBranding = ({ subtitle }) => {
    return (
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg shadow-primary/20 mb-4">
                <LucideHardHat size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">ConstruPro</h1>
            {subtitle && (
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default AuthBranding;

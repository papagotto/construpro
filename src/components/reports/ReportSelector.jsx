import React from 'react';

const ReportSelector = ({ reportTypes }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reportTypes?.map((type) => (
                <div
                    key={type.id}
                    className={`bg-white dark:bg-surface-dark border-2 rounded-xl p-5 shadow-sm cursor-pointer relative transition-all group ${type.selected ? 'border-primary' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-800'}`}
                >
                    <div className={`${type.selected ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <span className="material-icons">{type.icon}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{type.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{type.description}</p>
                    {type.selected && (
                        <div className="absolute top-4 right-4">
                            <span className="material-icons text-primary">check_circle</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReportSelector;

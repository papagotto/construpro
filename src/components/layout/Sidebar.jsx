import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { navigation } from '../../data/mockData';

const Sidebar = ({ isOpen, onClose }) => {
    const [openMenus, setOpenMenus] = useState(['Recursos']);

    const toggleMenu = (name) => {
        setOpenMenus((prev) =>
            prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
        );
    };

    const renderNavItem = (item) => {
        if (item.subItems) {
            const isSubMenuOpen = openMenus.includes(item.name);
            return (
                <div key={item.name} className="relative">
                    <button
                        onClick={() => toggleMenu(item.name)}
                        className="flex items-center justify-between w-full gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <span className="material-icons">{item.icon}</span>
                            <span>{item.name}</span>
                        </div>
                        <span
                            className={`material-icons text-sm transform transition-transform duration-200 ${isSubMenuOpen ? 'rotate-180' : ''
                                }`}
                        >
                            expand_more
                        </span>
                    </button>
                    {isSubMenuOpen && (
                        <div className="pl-8 pt-1 space-y-1">
                            {item.subItems.map((subItem) => (
                                <NavLink
                                    key={subItem.name}
                                    to={subItem.href}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive
                                            ? 'text-primary bg-primary/10 font-medium'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`
                                    }
                                >
                                    <span className="material-icons text-sm">{subItem.icon}</span>
                                    <span>{subItem.name}</span>
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                        ? 'text-primary bg-primary/10 font-medium'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`
                }
            >
                <span className="material-icons">{item.icon}</span>
                <span>{item.name}</span>
            </NavLink>
        );
    };

    const categories = [...new Set(navigation.map((i) => i.category))];

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-surface-light dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0`}>
                <div className="p-4 space-y-1">
                    {categories.map((cat) => (
                        <div key={cat} className="mb-6">
                            <p className="text-[10px] font-bold text-slate-400 uppercase px-4 mb-2 tracking-widest">
                                {cat}
                            </p>
                            {navigation
                                .filter((i) => i.category === cat)
                                .map((item) => renderNavItem(item))}
                        </div>
                    ))}
                </div>
                <div className="sticky bottom-0 w-full p-4 bg-surface-light dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800">
                    <div className="bg-primary/5 rounded-lg p-4">
                        <p className="text-xs font-semibold text-primary mb-1">Plan Pro</p>
                        <p className="text-[10px] text-slate-500 mb-3">Expira en 24 días</p>
                        <button className="w-full bg-primary text-white text-xs py-2 rounded font-medium hover:bg-primary/90 transition-colors">
                            Actualizar Plan
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

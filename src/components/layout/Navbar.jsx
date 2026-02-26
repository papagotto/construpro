import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getMediaUrl } from '../../lib/storage';

const Navbar = ({ onToggleSidebar }) => {
    const { profile, user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const menuRef = useRef(null);

    // Resetear error de imagen si cambia el path del avatar
    useEffect(() => {
        setImageError(false);
    }, [profile?.avatar_url]);

    // Cerrar menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    // Obtener iniciales si no hay avatar
    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length > 1) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts[0].substring(0, 2).toUpperCase();
    };

    const userName = profile?.nombre || user?.email?.split('@')[0] || 'Usuario';
    const userRole = profile?.roles?.nombre || 'Consultor';
    const userAvatar = getMediaUrl(profile?.avatar_url);

    return (
        <nav className="fixed top-0 z-50 w-full bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 h-16 flex items-center px-6">
            {/* Left: Logo Area */}
            <div className="flex-1 flex items-center gap-4">
                <button 
                    onClick={onToggleSidebar}
                    className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <span className="material-icons">menu</span>
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white shadow-sm shadow-primary/20">
                        <span className="material-icons text-xl">architecture</span>
                    </div>
                    <span className="font-bold text-xl tracking-tighter text-primary dark:text-white uppercase">
                        CONSTRU<span className="text-accent font-black">PRO</span>
                    </span>
                </div>
            </div>

            {/* Center: Search Area */}
            <div className="flex-1 hidden lg:flex justify-center">
                <div className="flex items-center bg-slate-100 dark:bg-slate-800/50 rounded-xl px-4 py-2 w-full max-w-md border border-transparent focus-within:border-primary/30 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all shadow-inner">
                    <span className="material-icons text-slate-400 text-lg mr-3">search</span>
                    <input
                        className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 placeholder-slate-400 font-medium"
                        placeholder="Buscar proyectos, materiales o tareas..."
                        type="text"
                    />
                    <span className="hidden xl:block text-[10px] font-black text-slate-400 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded ml-2 uppercase">⌘K</span>
                </div>
            </div>

            {/* Right: User & Actions Area */}
            <div className="flex-1 flex items-center justify-end gap-2 sm:gap-4">
                <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors group">
                    <span className="material-icons">notifications</span>
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
                </button>
                
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>
                
                <div className="relative" ref={menuRef}>
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center gap-3 pl-2 cursor-pointer group focus:outline-none"
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-xs font-black text-slate-900 dark:text-white leading-none tracking-tight">
                                {userName}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold opacity-80">
                                {userRole}
                            </p>
                        </div>
                        <div className="relative">
                            {userAvatar && !imageError ? (
                                <img
                                    alt={userName}
                                    className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/10 group-hover:ring-primary transition-all"
                                    src={userAvatar}
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/10 group-hover:ring-primary transition-all text-primary font-bold text-xs">
                                    {getInitials(userName)}
                                </div>
                            )}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-surface-dark"></div>
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 animate-in fade-in zoom-in duration-200">
                            {/* User Header */}
                            <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800/50 mb-1">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{userName}</p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</p>
                            </div>

                            {/* Menu Items */}
                            <Link 
                                to="/perfil" 
                                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <span className="material-icons text-lg opacity-60">person</span>
                                <span className="font-medium">Mi Perfil</span>
                            </Link>
                            <Link 
                                to="/configuracion" 
                                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <span className="material-icons text-lg opacity-60">settings</span>
                                <span className="font-medium">Configuración del Sistema</span>
                            </Link>

                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-4"></div>

                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                            >
                                <span className="material-icons text-lg opacity-60">logout</span>
                                <span className="font-bold">Cerrar Sesión</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

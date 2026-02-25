import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
    LucideUserPlus, LucideBadgeCheck, LucideShield, 
    LucideMail, LucideMoreVertical, LucideTrash2, 
    LucideUser, LucideBriefcase, LucideCircle, LucideSettings
} from 'lucide-react';

const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowNewUserModal] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            
            // Cargar Roles
            const { data: rolesData } = await supabase.from('roles').select('*').order('nivel_acceso', { ascending: false });
            setRoles(rolesData || []);

            // Cargar Usuarios con sus roles y proyectos
            const { data: usersData, error } = await supabase
                .from('usuarios')
                .select(`
                    *,
                    roles (nombre, nivel_acceso),
                    proyectos (nombre)
                `)
                .eq('is_deleted', false);

            if (error) throw error;
            setUsers(usersData || []);
        } catch (error) {
            console.error('Error cargando personal:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (estado) => {
        return estado 
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Catálogo de Recursos</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Administra los accesos, roles y asignaciones del equipo técnico.</p>
                </div>
                <button 
                    onClick={() => setShowNewUserModal(true)}
                    className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                    <LucideUserPlus size={18} />
                    Añadir Integrante
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
                <Link
                    to="/recursos-materiales"
                    className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-b-2 border-transparent"
                >
                    Materiales
                </Link>
                <Link
                    to="/recursos-equipos"
                    className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-b-2 border-transparent"
                >
                    Equipamiento
                </Link>
                <button className="px-6 py-3 text-sm font-semibold border-b-2 border-primary text-primary">Personal</button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Equipo</p>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">{users.length}</span>
                        <LucideUser className="text-primary/20" size={24} />
                    </div>
                </div>
                {roles.map(rol => (
                    <div key={rol.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{rol.nombre}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">
                                {users.filter(u => u.roles?.nombre === rol.nombre).length}
                            </span>
                            <LucideBadgeCheck className="text-slate-200 dark:text-slate-800" size={24} />
                        </div>
                    </div>
                )).slice(0, 3)}
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Sincronizando nómina...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Integrante</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rol / Nivel</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Proyecto Asignado</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Estado</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                                    <LucideUser size={20} className="text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">{u.identificador_usuario.split('@')[0]}</p>
                                                    <p className="text-[11px] text-slate-500 font-medium">{u.identificador_usuario}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-tight border border-primary/10">
                                                    {u.roles?.nombre || 'Sin Rol'}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400">LVL {u.roles?.nivel_acceso || 0}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                                                <LucideBriefcase size={14} className="text-slate-400" />
                                                {u.proyectos?.nombre || 'Flotante / Global'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusColor(u.estado)}`}>
                                                {u.estado ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => navigate('/perfil')}
                                                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                                >
                                                    <LucideSettings size={18} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                    <LucideTrash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import ResourceTabs from '../../components/shared/ResourceTabs';
import SearchBar from '../../components/shared/SearchBar';
import UsersTable from '../../components/resources/UsersTable';
import { LucidePlus } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('usuarios')
                .select(`
                    *,
                    roles:rol_id (nombre, nivel_acceso),
                    proyectos:proyecto_id (nombre)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data);
        } catch (error) {
            console.error('Error cargando usuarios:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        return status ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200';
    };

    const filteredUsers = users.filter(u => 
        u.identificador_usuario.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.roles?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Capital Humano</h1>
                    <p className="text-slate-500 text-sm">Gestione accesos, roles y asignaciones del personal técnico.</p>
                </div>
                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
                    <LucidePlus size={16} />
                    Alta de Personal
                </button>
            </div>

            <ResourceTabs />

            <SearchBar 
                placeholder="Buscar por usuario, correo o rol..."
                value={searchTerm}
                onChange={setSearchTerm}
            />

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <UsersTable 
                    users={filteredUsers}
                    loading={loading}
                    getStatusColor={getStatusColor}
                    onSettingsClick={(id) => console.log('Settings', id)}
                    onDeleteClick={(id) => console.log('Delete', id)}
                />
            </div>
        </div>
    );
};

export default Users;

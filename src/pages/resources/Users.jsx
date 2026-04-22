import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { deleteUserCompletely } from '../../services/adminServices';
import ResourceTabs from '../../components/shared/ResourceTabs';
import SearchBar from '../../components/shared/SearchBar';
import UsersTable from '../../components/resources/UsersTable';
import UserInviteModal from '../../components/resources/UserInviteModal';
import { LucidePlus } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

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
                    proyectos:proyecto_asignado_id (nombre)
                `)
                .eq('is_deleted', false) // Solo usuarios no eliminados
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data);
        } catch (error) {
            console.error('Error cargando usuarios:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        const userToDelete = users.find(u => u.id === userId);
        if (!window.confirm(`¿Estás seguro de que deseas eliminar a ${userToDelete?.nombre || userToDelete?.identificador_usuario}? Esta acción revocará definitivamente su acceso al sistema.`)) {
            return;
        }

        try {
            const result = await deleteUserCompletely(userId);

            if (!result.success) throw new Error(result.error);

            // Refrescar lista
            fetchUsers();
            alert('Usuario eliminado correctamente del sistema y de autenticación.');
        } catch (error) {
            console.error('Error al eliminar usuario:', error.message);
            alert('Error: ' + (error.message || 'No tienes permisos suficientes para esta acción.'));
        }
    };

    const getStatusColor = (status) => {
        return status ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200';
    };

    const filteredUsers = users.filter(u => 
        u.identificador_usuario.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.roles?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Capital Humano</h1>
                    <p className="text-slate-500 text-sm">Gestione accesos, roles y asignaciones del personal técnico.</p>
                </div>
                <button 
                    onClick={() => setIsInviteModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
                >
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
                    onDeleteClick={handleDeleteUser}
                />
            </div>

            <UserInviteModal 
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onSuccess={fetchUsers}
            />
        </div>
    );
};

export default Users;

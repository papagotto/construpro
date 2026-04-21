import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getMediaUrl } from '../../lib/storage';
import ResourceTabs from '../../components/shared/ResourceTabs';
import SearchBar from '../../components/shared/SearchBar';
import EquipmentGrid from '../../components/resources/EquipmentGrid';

const Equipment = () => {
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('equipos_fisicos')
                .select('*')
                .eq('is_deleted', false)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const mappedEquipment = data.map(item => {
                const finalImageUrl = getMediaUrl(item.imagen_path) || item.imagen || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=400';
                return {
                    id: item.id,
                    name: item.nombre,
                    code: item.codigo || 'EQ-N/A',
                    status: item.estado === 'uso' ? 'En Uso' : 
                            item.estado === 'mantenimiento' ? 'Mantenimiento' : 'Disponible',
                    statusColor: item.estado === 'uso' ? 'bg-blue-100 text-blue-700' :
                                item.estado === 'mantenimiento' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700',
                    image: finalImageUrl,
                    maintenanceDate: item.fecha_mantenimiento ? new Date(item.fecha_mantenimiento).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : 'No programada',
                    isWarning: item.is_warning
                };
            });

            setEquipment(mappedEquipment);
        } catch (error) {
            console.error('Error cargando equipos:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredEquipment = equipment.filter(e => 
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        e.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Catálogo de Recursos</h1>
                    <p className="text-slate-500 text-sm">Administra y visualiza el inventario de materiales y maquinaria pesada.</p>
                </div>
                <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm">
                    <span className="material-icons text-sm">add</span>
                    Añadir Equipamiento
                </button>
            </div>

            <ResourceTabs />

            <SearchBar 
                placeholder="Buscar por nombre, modelo o ID..."
                value={searchTerm}
                onChange={setSearchTerm}
            />

            <EquipmentGrid 
                equipment={filteredEquipment}
                loading={loading}
            />
        </div>
    );
};

export default Equipment;

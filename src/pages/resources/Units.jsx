import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import ResourceTabs from '../../components/shared/ResourceTabs';
import SearchBar from '../../components/shared/SearchBar';
import UnitsTable from '../../components/resources/UnitsTable';
import UnitModal from '../../components/resources/UnitModal';
import { LucidePlus, LucideScale, LucideLayers, LucideLayoutGrid, LucideInfo, LucidePackage } from 'lucide-react';

const Units = () => {
    const [unidades, setUnidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUnit, setCurrentUnit] = useState({
        nombre: '', simbolo: '', tipo: 'masa', factor_conversion_base: 1, es_base: false
    });

    const TIPOS = [
        { id: 'masa', label: 'Peso (Masa)', icon: LucideScale },
        { id: 'volumen', label: 'Volumen', icon: LucideLayers },
        { id: 'superficie', label: 'Superficie', icon: LucideLayoutGrid },
        { id: 'longitud', label: 'Longitud', icon: LucideInfo },
        { id: 'conteo', label: 'Unidades', icon: LucidePackage }
    ];

    useEffect(() => {
        fetchUnits();
    }, []);

    const fetchUnits = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('unidades_medida').select('*').order('tipo').order('nombre');
            if (error) throw error;
            setUnidades(data);
        } catch (error) {
            console.error('Error cargando unidades:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (isEditing) {
                const { error } = await supabase.from('unidades_medida').update(currentUnit).eq('id', currentUnit.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('unidades_medida').insert([currentUnit]);
                if (error) throw error;
            }
            setShowModal(false);
            fetchUnits();
        } catch (error) {
            alert('Error al guardar unidad: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Está seguro de eliminar esta unidad?')) return;
        try {
            const { error } = await supabase.from('unidades_medida').delete().eq('id', id);
            if (error) throw error;
            fetchUnits();
        } catch (error) {
            alert('Error al eliminar: ' + error.message);
        }
    };

    const openEdit = (unit) => {
        setCurrentUnit(unit);
        setIsEditing(true);
        setShowModal(true);
    };

    const openCreate = () => {
        setCurrentUnit({ nombre: '', simbolo: '', tipo: 'masa', factor_conversion_base: 1, es_base: false });
        setIsEditing(false);
        setShowModal(true);
    };

    const filteredUnits = unidades.filter(u => 
        u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.simbolo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sistema de Medidas</h1>
                    <p className="text-slate-500 text-sm">Estandarice las unidades para cálculos precisos de APU y stock.</p>
                </div>
                <button 
                    onClick={openCreate}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
                >
                    <LucidePlus size={16} />
                    Nueva Unidad
                </button>
            </div>

            <ResourceTabs />

            <SearchBar 
                placeholder="Buscar unidad o símbolo..."
                value={searchTerm}
                onChange={setSearchTerm}
            />

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <UnitsTable 
                    unidades={filteredUnits}
                    loading={loading}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                />
            </div>

            <UnitModal 
                showModal={showModal}
                setShowModal={setShowModal}
                isEditing={isEditing}
                currentUnit={currentUnit}
                setCurrentUnit={setCurrentUnit}
                TIPOS={TIPOS}
                onSave={handleSave}
            />
        </div>
    );
};

export default Units;

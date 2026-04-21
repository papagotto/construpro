import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import ApuStats from '../../components/engineering/ApuStats';
import ApuGrid from '../../components/engineering/ApuGrid';
import ApuModal from '../../components/engineering/ApuModal';
import { LucidePlus, LucideSearch, LucideSettings2 } from 'lucide-react';

const Engineering = () => {
    const navigate = useNavigate();
    const [recetas, setRecetas] = useState([]);
    const [unidades, setUnidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewModal, setShowNewModal] = useState(false);
    const [newRubro, setNewRubro] = useState({ nombre: '', unidad_id: '', rendimiento_mano_obra: 1, personal_minimo: 1 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: unidadesData } = await supabase.from('unidades_medida').select('*').order('nombre');
            setUnidades(unidadesData || []);
            if (unidadesData?.length > 0) {
                setNewRubro(prev => ({ ...prev, unidad_id: unidadesData[0].id }));
            }

            const { data: recetasData, error } = await supabase
                .from('recetas_apu')
                .select(`*, unidades_medida (nombre, simbolo), receta_recursos (count)`)
                .eq('is_deleted', false)
                .order('nombre');

            if (error) throw error;
            setRecetas(recetasData || []);
        } catch (error) {
            console.error('Error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRubro = async () => {
        try {
            const { data, error } = await supabase.from('recetas_apu').insert([{
                ...newRubro,
                personal_minimo: parseInt(newRubro.personal_minimo || 1),
                rendimiento_mano_obra: parseFloat(newRubro.rendimiento_mano_obra || 1)
            }]).select().single();
            if (error) throw error;
            setShowNewModal(false);
            navigate(`/ingenieria/${data.id}`);
        } catch (error) {
            alert('Error al crear: ' + error.message);
        }
    };

    const handleDeleteRubro = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este rubro maestro?')) return;
        try {
            const { error } = await supabase.from('recetas_apu').update({ is_deleted: true }).eq('id', id);
            if (error) throw error;
            fetchData();
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const filteredRecetas = recetas.filter(r => r.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Análisis de Rubros (APU)</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Biblioteca maestra de fórmulas constructivas y rendimientos.</p>
                </div>
                <button 
                    onClick={() => setShowNewModal(true)}
                    className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                    <LucidePlus size={18} />
                    Nuevo Rubro
                </button>
            </div>

            <ApuStats recetas={recetas} />

            <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center shadow-sm">
                <div className="relative w-full md:flex-1">
                    <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm focus:ring-primary focus:border-primary transition-all outline-none"
                        placeholder="Buscar por rubro o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="w-full md:w-auto p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex justify-center items-center">
                    <LucideSettings2 size={18} className="text-slate-600 dark:text-slate-400" />
                </button>
            </div>

            <ApuGrid 
                recetas={filteredRecetas} 
                loading={loading} 
                onEdit={(id) => navigate(`/ingenieria/${id}`)}
                onDelete={handleDeleteRubro}
            />

            <ApuModal 
                showModal={showNewModal}
                setShowModal={setShowNewModal}
                newRubro={newRubro}
                setNewRubro={setNewRubro}
                unidades={unidades}
                onCreate={handleCreateRubro}
            />
        </div>
    );
};

export default Engineering;

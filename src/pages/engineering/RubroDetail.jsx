import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import RubroDefinitionPanel from '../../components/engineering/detail/RubroDefinitionPanel';
import RubroResourcesTable from '../../components/engineering/detail/RubroResourcesTable';
import ResourceSelector from '../../components/engineering/detail/ResourceSelector';
import { LucideArrowLeft } from 'lucide-react';

const RubroDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rubro, setRubro] = useState(null);
    const [unidades, setUnidades] = useState([]);
    const [materiales, setMateriales] = useState([]);
    const [catalogoRecursos, setCatalogoRecursos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRubroData();
    }, [id]);

    const fetchRubroData = async () => {
        try {
            setLoading(true);
            const { data: unidadesData } = await supabase.from('unidades_medida').select('*').order('nombre');
            setUnidades(unidadesData || []);

            const { data: rubroData, error: rubroError } = await supabase
                .from('recetas_apu')
                .select(`*, unidades_medida (id, nombre, simbolo)`)
                .eq('id', id)
                .single();
            if (rubroError) throw rubroError;

            await fetchMaterialesList();
            const { data: catData } = await supabase.from('recursos').select('*').eq('is_deleted', false);
            setRubro(rubroData);
            setCatalogoRecursos(catData || []);
        } catch (error) {
            console.error('Error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchMaterialesList = async () => {
        const { data } = await supabase.from('receta_recursos').select('*, recursos(*)').eq('receta_id', id);
        setMateriales(data || []);
    };

    const handleUpdateRubro = async (updates) => {
        try {
            const { error } = await supabase.from('recetas_apu').update(updates).eq('id', id);
            if (error) throw error;
            if (updates.unidad_id) fetchRubroData();
            else setRubro({ ...rubro, ...updates });
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        }
    };

    const handleAddMaterial = async (recursoId) => {
        try {
            const { error } = await supabase.from('receta_recursos').insert({
                receta_id: id, recurso_id: recursoId, cantidad_por_unidad: 1, coeficiente_desperdicio: 1.05
            });
            if (error) throw error;
            fetchMaterialesList();
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const handleRemoveMaterial = async (relId) => {
        try {
            const { error } = await supabase.from('receta_recursos').delete().eq('id', relId);
            if (error) throw error;
            setMateriales(materiales.filter(m => m.id !== relId));
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const handleUpdateMaterialQty = async (relId, cantidad) => {
        try {
            setMateriales(materiales.map(m => m.id === relId ? { ...m, cantidad_por_unidad: cantidad } : m));
            const { error } = await supabase.from('receta_recursos').update({ cantidad_por_unidad: cantidad }).eq('id', relId);
            if (error) throw error;
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    if (loading) return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest text-xs">Sincronizando biblioteca...</div>;
    if (!rubro) return <div className="p-20 text-center text-slate-500">Rubro no encontrado.</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => navigate('/ingenieria')}
                    className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm"
                >
                    <LucideArrowLeft size={18} />
                    Volver a Biblioteca
                </button>
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg border border-primary/10">
                    Modo Ingeniería APU
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <RubroDefinitionPanel 
                        rubro={rubro} 
                        setRubro={setRubro} 
                        unidades={unidades} 
                        onUpdate={handleUpdateRubro} 
                    />
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <RubroResourcesTable 
                            materiales={materiales}
                            unidadSimbolo={rubro.unidades_medida?.simbolo}
                            onUpdateQty={handleUpdateMaterialQty}
                            onRemove={handleRemoveMaterial}
                        />
                        <ResourceSelector 
                            catalogoRecursos={catalogoRecursos}
                            materialesVinculados={materiales}
                            onAdd={handleAddMaterial}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RubroDetail;

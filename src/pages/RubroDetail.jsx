import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
    DraftingCompass as LucideArchitecture, LucideSave, LucideArrowLeft, 
    LucidePlus, LucideTrash2, LucidePackage, LucideClock, LucideUsers, LucideAlertCircle,
    LucideSearch
} from 'lucide-react';

const RubroDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rubro, setRubro] = useState(null);
    const [unidades, setUnidades] = useState([]);
    const [materiales, setMateriales] = useState([]);
    const [catalogoRecursos, setCatalogoRecursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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

            await fetchMaterialesList(); // Carga solo materiales

            const { data: catData } = await supabase.from('recursos').select('*').eq('is_deleted', false);
            setRubro(rubroData);
            setCatalogoRecursos(catData || []);
        } catch (error) {
            console.error('Error cargando rubro:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchMaterialesList = async () => {
        const { data } = await supabase
            .from('receta_recursos')
            .select('*, recursos(*)')
            .eq('receta_id', id);
        setMateriales(data || []);
    };

    const handleUpdateRubro = async (updates) => {
        try {
            setSaving(true);
            const { error } = await supabase.from('recetas_apu').update(updates).eq('id', id);
            if (error) throw error;
            if (updates.unidad_id) fetchRubroData();
            else setRubro({ ...rubro, ...updates });
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleAddMaterial = async (recursoId) => {
        try {
            const { error } = await supabase
                .from('receta_recursos')
                .insert({
                    receta_id: id,
                    recurso_id: recursoId,
                    cantidad_por_unidad: 1,
                    coeficiente_desperdicio: 1.05
                });
            if (error) throw error;
            // Solo recargamos la lista de materiales, no toda la página
            fetchMaterialesList();
        } catch (error) {
            console.error('Error vinculando material:', error.message);
        }
    };

    const handleRemoveMaterial = async (relId) => {
        try {
            const { error } = await supabase.from('receta_recursos').delete().eq('id', relId);
            if (error) throw error;
            setMateriales(materiales.filter(m => m.id !== relId));
        } catch (error) {
            console.error('Error eliminando vínculo:', error.message);
        }
    };

    const handleUpdateMaterialQty = async (relId, cantidad) => {
        try {
            // Actualización local inmediata para fluidez
            setMateriales(materiales.map(m => m.id === relId ? { ...m, cantidad_por_unidad: cantidad } : m));
            
            const { error } = await supabase
                .from('receta_recursos')
                .update({ cantidad_por_unidad: cantidad })
                .eq('id', relId);
            if (error) throw error;
        } catch (error) {
            console.error('Error actualizando cantidad:', error.message);
        }
    };

    if (loading) return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest text-xs">Sincronizando biblioteca...</div>;
    if (!rubro) return <div className="p-20 text-center text-slate-500">Rubro no encontrado.</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            {/* Header Navigation */}
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
                {/* Panel Izquierdo: Datos Generales */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 text-primary rounded-xl">
                                <LucideArchitecture size={24} />
                            </div>
                            <h2 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Definición Rubro</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Nombre del Rubro</label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-white outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary/20"
                                    value={rubro.nombre}
                                    onChange={(e) => setRubro({...rubro, nombre: e.target.value})}
                                    onBlur={(e) => handleUpdateRubro({ nombre: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Unidad</label>
                                    <select 
                                        className="select-custom !p-2 !ring-1"
                                        value={rubro.unidad_id || ''}
                                        onChange={(e) => handleUpdateRubro({ unidad_id: e.target.value })}
                                    >
                                        <option value="">Seleccionar...</option>
                                        {unidades.map(u => (
                                            <option key={u.id} value={u.id}>{u.nombre} ({u.simbolo})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Personal</label>
                                    <input 
                                        type="number" 
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-white outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary/20"
                                        value={rubro.personal_minimo}
                                        onChange={(e) => setRubro({...rubro, personal_minimo: e.target.value})}
                                        onBlur={(e) => handleUpdateRubro({ personal_minimo: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 flex justify-between px-1">
                                    <span>Rendimiento</span>
                                    <span className="text-primary normal-case">h / {rubro.unidades_medida?.simbolo || 'u'}</span>
                                </label>
                                <div className="relative">
                                    <LucideClock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-white outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary/20"
                                        value={rubro.rendimiento_mano_obra}
                                        onChange={(e) => setRubro({...rubro, rendimiento_mano_obra: e.target.value})}
                                        onBlur={(e) => handleUpdateRubro({ rendimiento_mano_obra: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Panel Derecho: Insumos */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30">
                            <div className="flex items-center gap-2">
                                <LucidePackage className="text-emerald-500" size={20} />
                                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-sm">Cómputo de Materiales</h3>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{materiales.length} RECURSOS</span>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {materiales.length === 0 ? (
                                <div className="p-12 text-center text-slate-400 text-sm italic">
                                    Sin materiales vinculados. Utilice el buscador inferior.
                                </div>
                            ) : (
                                materiales.map(m => (
                                    <div key={m.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-none group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                                                <LucidePackage size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white uppercase">{m.recursos?.nombre_interno}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">{m.recursos?.categoria} • SKU: {m.recursos?.sku || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Cant. / {rubro.unidades_medida?.simbolo || 'u'}</label>
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="number"
                                                        step="0.001"
                                                        className="w-24 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-black text-center focus:ring-2 focus:ring-primary/20 outline-none"
                                                        value={m.cantidad_por_unidad}
                                                        onChange={(e) => handleUpdateMaterialQty(m.id, e.target.value)}
                                                    />
                                                    <span className="text-xs font-black text-slate-400 uppercase w-12">{m.recursos?.unidad_base || m.recursos?.unit_base}</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleRemoveMaterial(m.id)}
                                                className="p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <LucideTrash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Selector Instantáneo */}
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">+ Añadir Insumo al Análisis</label>
                            <div className="relative">
                                <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <select 
                                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                                    onChange={(e) => {
                                        if (e.target.value) handleAddMaterial(e.target.value);
                                        e.target.value = '';
                                    }}
                                >
                                    <option value="">Buscar material por nombre o categoría...</option>
                                    {catalogoRecursos.filter(r => !materiales.some(m => m.recurso_id === r.id)).map(r => (
                                        <option key={r.id} value={r.id}>{r.nombre_interno} ({r.unidad_base || r.unit_base})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RubroDetail;

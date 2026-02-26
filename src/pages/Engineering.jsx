import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
    DraftingCompass as LucideArchitecture, LucidePlus, LucideSettings2, LucideUsers, 
    LucideClock, LucidePackage, LucideSearch, LucideMoreVertical, LucideX, LucideTrash2
} from 'lucide-react';

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
            
            // Cargar Unidades Oficiales
            const { data: unidadesData } = await supabase
                .from('unidades_medida')
                .select('*')
                .order('nombre', { ascending: true });
            
            setUnidades(unidadesData || []);
            if (unidadesData?.length > 0) {
                setNewRubro(prev => ({ ...prev, unidad_id: unidadesData[0].id }));
            }

            // Cargar Recetas con su relación de unidad
            const { data: recetasData, error } = await supabase
                .from('recetas_apu')
                .select(`
                    *,
                    unidades_medida (nombre, simbolo),
                    receta_recursos (count)
                `)
                .eq('is_deleted', false)
                .order('nombre', { ascending: true });

            if (error) throw error;
            setRecetas(recetasData || []);
        } catch (error) {
            console.error('Error cargando datos de ingeniería:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRubro = async () => {
        try {
            // Asegurarse de que unidad_id no esté vacío
            if (!newRubro.unidad_id) {
                alert('Por favor seleccione una unidad de medida oficial.');
                return;
            }

            const { data, error } = await supabase
                .from('recetas_apu')
                .insert([newRubro])
                .select()
                .single();

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
            const { error } = await supabase
                .from('recetas_apu')
                .update({ is_deleted: true })
                .eq('id', id);
            if (error) throw error;
            fetchData(); // Recargar todos los datos
        } catch (error) {
            console.error('Error al borrar:', error.message);
        }
    };

    const filteredRecetas = recetas.filter(r => 
        r.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header */}
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

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Rubros</p>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">{recetas.length}</span>
                        <LucideArchitecture size={24} className="text-primary/20" />
                    </div>
                </div>
                <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rendimiento Promedio</p>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-emerald-600">
                            {(recetas.reduce((acc, r) => acc + (Number(r.rendimiento_mano_obra) || 0), 0) / (recetas.length || 1)).toFixed(1)} h/u
                        </span>
                        <LucideClock size={24} className="text-emerald-500/20" />
                    </div>
                </div>
                <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mano de Obra Crítica</p>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-amber-600">
                            {recetas.filter(r => (r.personal_minimo || 0) > 2).length} rubros
                        </span>
                        <LucideUsers size={24} className="text-amber-500/20" />
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center shadow-sm">
                <div className="relative w-full md:flex-1">
                    <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm focus:ring-primary focus:border-primary transition-all outline-none"
                        placeholder="Buscar por rubro o descripción..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="w-full md:w-auto p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex justify-center items-center">
                    <LucideSettings2 size={18} className="text-slate-600 dark:text-slate-400" />
                </button>
            </div>

            {/* APU List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Cargando biblioteca técnica...</div>
                ) : filteredRecetas.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-500 italic">No se encontraron rubros definidos.</div>
                ) : (
                    filteredRecetas.map((r) => (
                        <div key={r.id} className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{r.nombre}</h3>
                                    <p className="text-xs text-slate-400 mt-1 uppercase font-black">
                                        Unidad: {r.unidades_medida?.simbolo || r.unidad_medida}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => handleDeleteRubro(r.id)}
                                    className="p-2 text-slate-300 hover:text-red-500 rounded-lg"
                                >
                                    <LucideTrash2 size={18} />
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Rendimiento</p>
                                    <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                                        <LucideClock size={14} className="text-primary" />
                                        <span className="text-sm">{r.rendimiento_mano_obra} h/{r.unidades_medida?.simbolo || r.unidad_medida}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Min. Personal</p>
                                    <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                                        <LucideUsers size={14} className="text-amber-500" />
                                        <span className="text-sm">{r.personal_minimo} pers.</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Insumos</p>
                                    <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                                        <LucidePackage size={14} className="text-emerald-500" />
                                        <span className="text-sm">{r.receta_recursos?.[0]?.count || 0} ítems</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 flex gap-2">
                                <button 
                                    onClick={() => navigate(`/ingenieria/${r.id}`)}
                                    className="flex-1 py-2 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors border border-primary/10"
                                >
                                    Editar Fórmulas
                                </button>
                                <button className="px-3 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 rounded-lg">
                                    Duplicar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal de Nuevo Rubro */}
            {showNewModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in duration-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Nuevo Rubro Maestro</h3>
                            <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-600"><LucideX size={20} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Nombre</label>
                                <input 
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-white outline-none ring-2 ring-primary/10 focus:ring-primary transition-all" 
                                    placeholder="Ej: Mampostería de Elevación"
                                    onChange={(e) => setNewRubro({...newRubro, nombre: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Unidad</label>
                                    <select 
                                        className="select-custom"
                                        value={newRubro.unit_id}
                                        onChange={(e) => setNewRubro({...newRubro, unidad_id: e.target.value})}
                                    >
                                        {unidades.map(u => (
                                            <option key={u.id} value={u.id}>{u.nombre} ({u.simbolo})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Min. Personas</label>
                                    <input 
                                        type="number" 
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-white outline-none ring-2 ring-primary/10 focus:ring-primary transition-all" 
                                        defaultValue="1"
                                        onChange={(e) => setNewRubro({...newRubro, personal_minimo: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                            <button onClick={() => setShowNewModal(false)} className="flex-1 py-3 text-sm font-bold text-slate-500">Cancelar</button>
                            <button 
                                onClick={handleCreateRubro}
                                className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-black shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                            >
                                Crear y Configurar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Engineering;

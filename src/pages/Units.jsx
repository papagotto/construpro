import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
    LucideScale, LucideLayers, LucideInfo, LucidePackage, 
    LucidePlus, LucideTrash2, LucideSettings2, LucideSearch, LucideX, LucideSave, LucideEdit3, LucideAlertTriangle
} from 'lucide-react';

const Units = () => {
    const [unidades, setUnidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUnit, setCurrentUnit] = useState({ 
        nombre: '', 
        simbolo: '', 
        tipo: 'masa', 
        factor_conversion_base: 1, 
        es_base: false 
    });

    const TIPOS = [
        { id: 'masa', label: 'Peso / Masa', icon: LucideScale, color: 'text-blue-500' },
        { id: 'volumen', label: 'Volumen', icon: LucideLayers, color: 'text-emerald-500' },
        { id: 'longitud', label: 'Longitud', icon: LucideInfo, color: 'text-amber-500' },
        { id: 'conteo', label: 'Conteo / Unidad', icon: LucidePackage, color: 'text-purple-500' }
    ];

    useEffect(() => {
        fetchUnits();
    }, []);

    const fetchUnits = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('unidades_medida')
                .select('*')
                .order('tipo', { ascending: true })
                .order('nombre', { ascending: true });

            if (error) throw error;
            setUnidades(data || []);
        } catch (error) {
            console.error('Error cargando unidades:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (unit = null) => {
        if (unit) {
            setCurrentUnit(unit);
            setIsEditing(true);
        } else {
            setCurrentUnit({ nombre: '', simbolo: '', tipo: 'masa', factor_conversion_base: 1, es_base: false });
            setIsEditing(false);
        }
        setShowModal(true);
    };

    const handleSaveUnit = async () => {
        try {
            if (isEditing) {
                const { error } = await supabase
                    .from('unidades_medida')
                    .update({
                        nombre: currentUnit.nombre,
                        simbolo: currentUnit.simbolo,
                        tipo: currentUnit.tipo,
                        factor_conversion_base: currentUnit.factor_conversion_base,
                        es_base: currentUnit.es_base
                    })
                    .eq('id', currentUnit.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('unidades_medida')
                    .insert([currentUnit]);
                if (error) throw error;
            }
            
            setShowModal(false);
            fetchUnits();
        } catch (error) {
            alert('Error al procesar unidad: ' + error.message);
        }
    };

    const handleDeleteUnit = async (id) => {
        if (!confirm('¿Seguro que deseas eliminar esta unidad?')) return;
        try {
            const { error } = await supabase
                .from('unidades_medida')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchUnits();
        } catch (error) {
            alert('No se puede eliminar: Esta unidad está en uso por materiales o recetas.');
        }
    };

    const filteredUnits = unidades.filter(u => 
        u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.simbolo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Unidades de Medida</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Biblioteca técnica de magnitudes y conversiones.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                    <LucidePlus size={18} />
                    Agregar Unidad
                </button>
            </div>

            {/* Grid por Categorías */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {TIPOS.map(tipo => {
                    const count = unidades.filter(u => u.tipo === tipo.id).length;
                    const baseUnit = unidades.find(u => u.tipo === tipo.id && u.es_base);
                    return (
                        <div key={tipo.id} className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-800 ${tipo.color}`}>
                                    <tipo.icon size={20} />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{count} Items</span>
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase">{tipo.label}</h3>
                            <p className="text-xs text-slate-500 mt-1">Base: <span className="font-black text-primary uppercase">{baseUnit?.simbolo || 'S/D'}</span></p>
                        </div>
                    );
                })}
            </div>

            {/* Listado Detallado */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
                    <div className="relative flex-1">
                        <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm focus:ring-primary focus:border-primary transition-all outline-none"
                            placeholder="Buscar unidad..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Símbolo</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Factor vs Base</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Actualizando sistema métrico...</td></tr>
                            ) : filteredUnits.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-700 dark:text-slate-300">{u.nombre}</span>
                                            {u.es_base && <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black uppercase rounded">Maestra</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-black text-primary uppercase text-sm">{u.simbolo}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{u.tipo}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="text-sm font-bold text-slate-600 dark:text-slate-400">
                                            {u.es_base ? '1.0' : `× ${u.factor_conversion_base}`}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleOpenModal(u)}
                                                className="p-2 text-slate-300 hover:text-primary transition-colors"
                                            >
                                                <LucideEdit3 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteUnit(u.id)}
                                                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                            >
                                                <LucideTrash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Único (Crear/Editar) */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                {isEditing ? 'Editar Unidad' : 'Nueva Unidad Técnica'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><LucideX size={20} /></button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            {isEditing && !currentUnit.es_base && (
                                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-xl flex gap-3">
                                    <LucideAlertTriangle className="text-amber-500 shrink-0" size={20} />
                                    <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold leading-tight uppercase">
                                        Cuidado: Cambiar el factor alterará todos los cálculos de stock y APU existentes.
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Nombre</label>
                                    <input 
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold" 
                                        value={currentUnit.nombre}
                                        onChange={(e) => setCurrentUnit({...currentUnit, nombre: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Símbolo</label>
                                    <input 
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold" 
                                        value={currentUnit.simbolo}
                                        onChange={(e) => setCurrentUnit({...currentUnit, simbolo: e.target.value})}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Categoría</label>
                                <select 
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold"
                                    value={currentUnit.tipo}
                                    disabled={isEditing}
                                    onChange={(e) => setCurrentUnit({...currentUnit, tipo: e.target.value})}
                                >
                                    {TIPOS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 flex justify-between">
                                    <span>Factor de Conversión</span>
                                    {currentUnit.es_base && <span className="text-primary normal-case">Unidad Base (Fijo 1.0)</span>}
                                </label>
                                <input 
                                    type="number" 
                                    step="0.000001"
                                    className={`w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold ${currentUnit.es_base ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    value={currentUnit.factor_conversion_base}
                                    disabled={currentUnit.es_base}
                                    onChange={(e) => setCurrentUnit({...currentUnit, factor_conversion_base: e.target.value})}
                                />
                            </div>

                            {!isEditing && (
                                <label className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded text-primary focus:ring-primary"
                                        checked={currentUnit.es_base}
                                        onChange={(e) => setCurrentUnit({...currentUnit, es_base: e.target.checked, factor_conversion_base: e.target.checked ? 1 : currentUnit.factor_conversion_base})}
                                    />
                                    <span className="text-xs font-bold text-primary uppercase">Establecer como Nueva Unidad Base</span>
                                </label>
                            )}
                        </div>

                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-3 text-sm font-bold text-slate-500">Cancelar</button>
                            <button 
                                onClick={handleSaveUnit}
                                className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-black shadow-lg shadow-primary/20"
                            >
                                {isEditing ? 'Actualizar' : 'Guardar Unidad'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Units;

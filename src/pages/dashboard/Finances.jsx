import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import MovementTable from '../../components/finances/MovementTable';
import MovementCardMobile from '../../components/finances/MovementCardMobile';

const Finances = () => {
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('all');

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchMovements();
    }, [selectedProject]);

    const fetchInitialData = async () => {
        const { data } = await supabase.from('proyectos').select('id, nombre').eq('is_deleted', false);
        if (data) setProjects(data);
    };

    const fetchMovements = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from('transacciones')
                .select(`
                    *,
                    proyectos (nombre)
                `)
                .eq('is_deleted', false)
                .order('fecha', { ascending: false });

            if (selectedProject !== 'all') {
                query = query.eq('proyecto_id', selectedProject);
            }

            const { data, error } = await query;

            if (error) throw error;

            const mapped = data.map(m => ({
                id: m.id,
                date: new Date(m.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
                concept: m.concepto,
                project: m.proyectos?.nombre || 'General',
                category: m.categoria || 'Sin categoría',
                categoryColor: m.tipo === 'gasto' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700',
                amount: Number(m.monto),
                type: m.tipo === 'gasto' ? 'expense' : 'income',
                status: m.estado === 'completado' ? 'Completado' : 'Pendiente',
                statusColor: m.estado === 'completado' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }));

            setMovements(mapped);
        } catch (error) {
            console.error('Error cargando finanzas:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        const absValue = Math.abs(value);
        const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(absValue);
        return value < 0 ? `-${formatted}` : formatted;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Movimientos de Caja</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Registro detallado de ingresos y egresos operativos.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 text-sm font-bold text-emerald-600 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/30 rounded-lg hover:bg-emerald-50 transition-all shadow-sm flex-1 md:flex-none">+ Ingreso</button>
                    <button className="px-4 py-2 text-sm font-bold text-red-600 bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/30 rounded-lg hover:bg-red-50 transition-all shadow-sm flex-1 md:flex-none">+ Gasto</button>
                </div>
            </div>

            <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative w-full">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                    <input type="text" placeholder="Buscar por concepto o ID..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                    <select 
                        value={selectedProject} 
                        onChange={(e) => setSelectedProject(e.target.value)}
                        className="w-full md:w-auto bg-slate-50 dark:bg-slate-800/50 border-none rounded-lg px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                        <option value="all">Todos los Proyectos</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-transparent md:bg-white dark:md:bg-surface-dark md:rounded-xl md:border md:border-slate-200 md:dark:border-slate-800 md:shadow-sm overflow-hidden">
                <MovementTable 
                    movements={movements}
                    formatCurrency={formatCurrency}
                    loading={loading}
                />

                {!loading && (
                    <MovementCardMobile 
                        movements={movements}
                        formatCurrency={formatCurrency}
                    />
                )}
            </div>
        </div>
    );
};

export default Finances;

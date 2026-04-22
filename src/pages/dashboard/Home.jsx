import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardHero from '../../components/home/DashboardHero';
import RecentProjects from '../../components/home/RecentProjects';
import QuickActions from '../../components/home/QuickActions';

const Home = () => {
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        projects: 0,
        tasks: 0,
        income: 0,
        expense: 0
    });
    const [activeProjects, setActiveProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // 1. Contar proyectos activos
            const { count: projectCount } = await supabase
                .from('proyectos')
                .select('*', { count: 'exact', head: true })
                .eq('is_deleted', false);

            // 2. Contar tareas pendientes
            const { count: taskCount } = await supabase
                .from('tareas')
                .select('*', { count: 'exact', head: true })
                .neq('estado', 'finalizada');

            // 3. Obtener los 2 proyectos más recientes
            const { data: projectsData } = await supabase
                .from('proyectos')
                .select('*')
                .eq('is_deleted', false)
                .order('created_at', { ascending: false })
                .limit(2);

            // 4. Sumar presupuesto total
            const { data: financeData } = await supabase
                .from('transacciones')
                .select('monto, tipo');

            const totalIncome = financeData?.filter(f => f.tipo === 'ingreso').reduce((acc, f) => acc + Number(f.monto), 0) || 0;
            const totalExpense = financeData?.filter(f => f.tipo === 'gasto').reduce((acc, f) => acc + Number(f.monto), 0) || 0;

            setStats({
                projects: projectCount || 0,
                tasks: taskCount || 0,
                income: totalIncome,
                expense: totalExpense
            });

            setActiveProjects(projectsData?.map(p => ({
                id: p.id,
                name: p.nombre,
                client: p.cliente,
                progress: 0, // Cálculo pendiente por tareas
                status: p.estado === 'en_curso' ? 'Activo' : 
                       p.estado === 'pendiente' ? 'Pendiente' : 
                       p.estado === 'finalizado' ? 'Finalizado' : 'En Riesgo',
                statusColor: p.estado === 'en_curso' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700',
                startDate: p.fecha_inicio ? new Date(p.fecha_inicio).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : 'Pendiente'
            })) || []);

        } catch (error) {
            console.error('Error cargando dashboard:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
    };

    if (loading) return <div className="p-20 text-center uppercase tracking-widest text-xs font-bold text-slate-500 animate-pulse">Iniciando Centro de Mando...</div>;

    const userName = profile?.nombre || user?.email?.split('@')[0] || 'Director';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <DashboardHero 
                userName={userName}
                stats={stats}
                formatCurrency={formatCurrency}
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    <RecentProjects 
                        projects={activeProjects}
                        onProjectClick={(id) => navigate(`/proyectos/${id}`)}
                    />

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter">Flujo de Caja Consolidado</h2>
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ingresos</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Egresos</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-40 flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sincronizando Módulo de Análisis...</p>
                        </div>
                    </div>
                </div>

                <QuickActions />
            </div>
        </div>
    );
};

export default Home;

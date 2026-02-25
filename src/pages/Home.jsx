import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { 
    LucideHardHat, LucideBuilding2, LucideCheckCircle2, 
    LucideAlertCircle, LucideChevronRight, LucideCalendar,
    LucideTrendingUp, LucideArrowUpRight, LucideArrowDownRight
} from 'lucide-react';

const Home = () => {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        projects: 0,
        tasks: 0,
        budget: 0,
        materials: 0
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

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <section className="bg-primary rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-[-50px] top-[-20px] h-[150%] w-1/3 opacity-10 flex items-center justify-center">
                    <LucideHardHat size={280} className="rotate-12" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-black mb-2 tracking-tight">¡Hola, {profile?.identificador_usuario?.split('@')[0] || 'Director'}!</h1>
                    <p className="text-primary-100/80 text-sm font-medium mb-8 uppercase tracking-widest">Resumen Operativo de la Empresa</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Proyectos', value: stats.projects, icon: LucideBuilding2 },
                            { label: 'Tareas Activas', value: stats.tasks, icon: LucideCheckCircle2 },
                            { label: 'Ingresos Totales', value: formatCurrency(stats.income), icon: LucideTrendingUp },
                            { label: 'Egresos Totales', value: formatCurrency(stats.expense), icon: LucideAlertCircle },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-white/20 rounded-lg"><stat.icon size={18} /></div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60">{stat.label}</p>
                                </div>
                                <p className="text-xl font-black">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black flex items-center gap-2 text-slate-800 dark:text-white uppercase tracking-tighter">
                            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                            Proyectos Recientes
                        </h2>
                        <Link to="/proyectos" className="text-primary text-xs font-black flex items-center gap-1 hover:underline uppercase tracking-widest">
                            Ver Todo <LucideChevronRight size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeProjects.map((project) => (
                            <div key={project.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/50 transition-all group cursor-pointer" onClick={() => navigate(`/proyectos/${project.id}`)}>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="font-black text-slate-900 dark:text-white leading-tight mb-1">{project.name}</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{project.client}</p>
                                    </div>
                                    <span className={`${project.statusColor} text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-sm`}>
                                        {project.status}
                                    </span>
                                </div>
                                <div className="space-y-5">
                                    <div>
                                        <div className="flex justify-between text-[10px] font-black uppercase mb-2 tracking-widest">
                                            <span className="text-slate-400">Avance Técnico</span>
                                            <span className="text-primary">{project.progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner">
                                            <div className="bg-accent h-full transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 py-3 border-t border-slate-50 dark:border-slate-800/50">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                                            <LucideCalendar size={14} className="text-slate-400" />
                                            Inicio: {project.startDate}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

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

                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h2 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-accent rounded-full"></span>
                            Alertas de Control
                        </h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/30 flex gap-3">
                                <LucideAlertCircle className="text-orange-500 shrink-0" size={18} />
                                <div>
                                    <p className="text-xs font-bold text-orange-800 dark:text-orange-400">Verificación de Caja</p>
                                    <p className="text-[10px] text-orange-700/70 dark:text-orange-400/60 mt-0.5">Existen 3 transacciones pendientes de conciliar.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h2 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                            Acciones Rápidas
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/tareas" className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20">
                                <LucideCheckCircle2 size={20} className="text-primary mb-2" />
                                <p className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300">Mis Tareas</p>
                            </Link>
                            <Link to="/recursos-materiales" className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20">
                                <LucideHardHat size={20} className="text-primary mb-2" />
                                <p className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300">Almacén</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

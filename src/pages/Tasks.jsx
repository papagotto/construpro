import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { kanbanTasks } from '../data/mockData';

const Tasks = () => {
    const navigate = useNavigate();
    const [expandedSections, setExpandedSections] = useState({
        pendiente: true,
        enProceso: true,
        enRevision: true,
        finalizada: false
    });

    const toggleSection = (id) => {
        setExpandedSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const columns = [
        { id: 'pendiente', title: 'Pendiente', count: kanbanTasks.pendiente.length, color: 'border-slate-300', bgColor: 'bg-slate-50/50' },
        { id: 'enProceso', title: 'En Proceso', count: kanbanTasks.enProceso.length, color: 'border-blue-400', bgColor: 'bg-blue-50/30' },
        { id: 'enRevision', title: 'En Revisión', count: kanbanTasks.enRevision.length, color: 'border-amber-400', bgColor: 'bg-amber-50/30' },
        { id: 'finalizada', title: 'Finalizada', count: kanbanTasks.finalizada.length, color: 'border-emerald-400', bgColor: 'bg-emerald-50/30' }
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 lg:px-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gestor de Tareas</h1>
                    <p className="text-slate-500 text-sm">Control de avance y asignación de actividades.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative hidden sm:block">
                        <select className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer">
                            <option>Todos los Proyectos</option>
                        </select>
                        <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                    <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-all shadow-sm">
                        <span className="material-icons text-sm mr-2">add</span>
                        Nueva Tarea
                    </button>
                </div>
            </div>

            {/* VISTA MÓVIL: Secciones Verticales Colapsables */}
            <div className="md:hidden flex-1 space-y-3 px-4 pb-10 overflow-y-auto custom-scrollbar">
                {columns.map((column) => (
                    <div 
                        key={column.id} 
                        className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
                    >
                        <div 
                            className={`p-4 flex items-center justify-between cursor-pointer border-l-4 ${column.color}`}
                            onClick={() => toggleSection(column.id)}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`material-icons transition-transform duration-200 text-slate-400 ${expandedSections[column.id] ? 'rotate-180' : ''}`}>
                                    expand_more
                                </span>
                                <h3 className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide text-xs">
                                    {column.title}
                                </h3>
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    {column.count}
                                </span>
                            </div>
                        </div>

                        {expandedSections[column.id] && (
                            <div className="p-2 pt-0 space-y-2 border-t border-slate-100 dark:border-slate-800/50">
                                {kanbanTasks[column.id].map((task) => (
                                    <div
                                        key={task.id}
                                        className="bg-white dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 flex flex-col gap-2"
                                        onClick={() => navigate(`/tareas/${task.id}`)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase">{task.projectCode}</span>
                                            {task.priority && (
                                                <span className={`${task.priorityColor} text-[8px] px-1.5 py-0.5 rounded font-bold uppercase`}>
                                                    {task.priority}
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{task.title}</h4>
                                        <div className="flex items-center justify-between mt-1">
                                            <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                                <span className="material-icons text-xs">event</span>
                                                {task.date}
                                            </div>
                                            <img src={task.avatar} className="w-5 h-5 rounded-full" alt="" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* VISTA ESCRITORIO/TABLET: Kanban Horizontal */}
            <div className="hidden md:flex flex-1 gap-6 overflow-x-auto pb-6 custom-scrollbar min-h-0">
                {columns.map((column) => (
                    <div key={column.id} className="w-80 flex-shrink-0 flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/30 dark:bg-slate-900/20">
                        {/* Column Header */}
                        <div className={`p-4 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 border-t-4 ${column.color}`}>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wider">{column.title}</h3>
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    {column.count}
                                </span>
                            </div>
                            <button className="text-slate-400 hover:text-primary transition-colors">
                                <span className="material-icons text-lg">add_circle_outline</span>
                            </button>
                        </div>

                        {/* Column Content */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                            {kanbanTasks[column.id].map((task) => (
                                <div
                                    key={task.id}
                                    className={`bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group ${task.completed ? 'opacity-60 grayscale-[0.5]' : ''}`}
                                    onClick={() => navigate(`/tareas/${task.id}`)}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{task.projectCode}</span>
                                        {task.priority && (
                                            <span className={`${task.priorityColor} text-[9px] px-2 py-0.5 rounded font-bold uppercase`}>
                                                {task.priority}
                                            </span>
                                        )}
                                    </div>
                                    <h4 className={`text-sm font-bold mb-2 group-hover:text-primary transition-colors ${task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                                        {task.title}
                                    </h4>
                                    {task.subtitle && (
                                        <p className="text-xs text-slate-500 mb-3 italic">{task.subtitle}</p>
                                    )}
                                    <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-between">
                                        <div className={`flex items-center gap-1 ${task.dateColor || 'text-slate-500'}`}>
                                            <span className="material-icons text-xs">schedule</span>
                                            <span className="text-[11px] font-semibold">{task.date}</span>
                                        </div>
                                        <div className="flex -space-x-2">
                                            {task.avatars ? task.avatars.slice(0, 3).map((avatar, i) => (
                                                <img
                                                    key={i}
                                                    src={avatar}
                                                    alt="User"
                                                    className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"
                                                />
                                            )) : task.avatar && (
                                                <img
                                                    src={task.avatar}
                                                    alt="User"
                                                    className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {kanbanTasks[column.id].length === 0 && (
                                <div className="py-10 text-center">
                                    <span className="material-icons text-slate-200 dark:text-slate-800 text-4xl mb-2">inventory_2</span>
                                    <p className="text-slate-400 text-xs font-medium">Sin tareas pendientes</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tasks;

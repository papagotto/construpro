import { useNavigate } from 'react-router-dom';
import { kanbanTasks } from '../data/mockData';

const Tasks = () => {
    const navigate = useNavigate();
    const columns = [
        { id: 'pendiente', title: 'Pendiente', count: 8, tasks: kanbanTasks.pendiente },
        { id: 'enProceso', title: 'En Proceso', count: 4, tasks: kanbanTasks.enProceso },
        { id: 'enRevision', title: 'En Revisión', count: 2, tasks: kanbanTasks.enRevision },
        { id: 'finalizada', title: 'Finalizada', count: 15, tasks: kanbanTasks.finalizada }
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gestor de Tareas</h1>
                    <p className="text-slate-500 text-sm">Control de avance y asignación de actividades por proyecto.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer">
                            <option>Todos los Proyectos</option>
                            {/* Proyectos dinámicos aquí si es necesario */}
                        </select>
                        <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                    <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-all shadow-sm">
                        <span className="material-icons text-sm mr-2">add</span>
                        Nueva Tarea
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto min-h-0 custom-scrollbar pb-4">
                <div className="flex gap-6 h-full">
                    {columns.map((column) => (
                        <div key={column.id} className="w-80 flex-shrink-0 flex flex-col bg-slate-50/50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="p-4 flex items-center justify-between bg-white/50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 backdrop-blur-sm">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-slate-700 dark:text-slate-200">{column.title}</h3>
                                    <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                        {column.count}
                                    </span>
                                </div>
                                <button className="text-slate-400 hover:text-primary transition-colors">
                                    <span className="material-icons text-lg">add_circle_outline</span>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                                {kanbanTasks[column.id].map((task) => (
                                    <div
                                        key={task.id}
                                        className={`bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all cursor-pointer group ${task.completed ? 'opacity-60 grayscale-[0.5]' : ''}`}
                                        onClick={() => navigate(`/tareas/${task.id}`)}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{task.projectCode}</span>
                                            {task.priority && (
                                                <span className={`${task.priorityColor} text-[10px] px-2 py-0.5 rounded font-bold uppercase`}>
                                                    {task.priority}
                                                </span>
                                            )}
                                            {task.completed && (
                                                <span className="text-emerald-500 font-bold text-[10px] flex items-center gap-1">
                                                    <span className="material-icons text-[10px]">check_circle</span>
                                                    COMPLETADO
                                                </span>
                                            )}
                                        </div>
                                        <h4 className={`text-sm font-semibold mb-1 group-hover:text-primary transition-colors ${task.completed ? 'line-through text-slate-400 font-medium' : 'text-slate-900 dark:text-white'}`}>
                                            {task.title}
                                        </h4>
                                        {task.subtitle && (
                                            <p className="text-xs text-slate-500 mb-3">{task.subtitle}</p>
                                        )}
                                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                                            <div className={`flex items-center gap-1 ${task.dateColor || 'text-slate-500'}`}>
                                                <span className="material-icons text-sm">event</span>
                                                <span className="text-xs font-medium">{task.date}</span>
                                            </div>
                                            <div className="flex -space-x-2">
                                                {task.avatars ? task.avatars.map((avatar, i) => (
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
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tasks;

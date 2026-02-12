import { useParams, Link } from 'react-router-dom';
import { kanbanTasks } from '../data/mockData';

const TaskDetail = () => {
    const { id } = useParams();
    
    // Buscar la tarea en todas las categorías del kanban
    const allTasks = Object.values(kanbanTasks).flat();
    const task = allTasks.find(t => t.id === parseInt(id));

    if (!task) {
        return <div className="p-8">Tarea no encontrada</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Content Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <nav className="flex mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <Link to="/tareas" className="hover:text-primary transition-colors">Tareas</Link>
                        <span className="mx-2">/</span>
                        <span className="text-slate-400">{task.projectCode}</span>
                        <span className="mx-2">/</span>
                        <span className="text-primary truncate max-w-[200px]">{task.title}</span>
                    </nav>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{task.title}</h1>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${task.priorityColor}`}>
                            {task.priority}
                        </span>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
                            {task.status || 'Pendiente'}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                        Adjuntar Evidencia
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm transition-all">
                        Completar Tarea
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Tech Info & Collaboration */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Descripción Técnica</h3>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {task.description || 'No hay descripción detallada para esta tarea.'}
                        </p>
                    </div>

                    {/* Checklist */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Checklist de Ejecución</h3>
                        <div className="space-y-3">
                            {task.checklist?.length > 0 ? task.checklist.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <input 
                                        type="checkbox" 
                                        checked={item.completed} 
                                        readOnly
                                        className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                                    />
                                    <span className={`text-sm ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200 font-medium'}`}>
                                        {item.text}
                                    </span>
                                </div>
                            )) : (
                                <p className="text-sm text-slate-400 italic">No hay puntos de verificación definidos.</p>
                            )}
                        </div>
                    </div>

                    {/* Work Log / Bitácora */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">Bitácora de Obra</h3>
                        <div className="space-y-6">
                            {task.log?.length > 0 ? task.log.map((entry, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 shrink-0">
                                        {entry.user[0]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-baseline justify-between mb-1">
                                            <span className="font-bold text-slate-900 dark:text-white text-sm">{entry.user}</span>
                                            <span className="text-xs text-slate-400">{entry.time}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg">
                                            {entry.message}
                                        </p>
                                        {entry.photo && (
                                            <div className="mt-3 w-32 h-20 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-300 dark:border-slate-600">
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                    <span className="material-icons text-xl">image</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-slate-400 italic text-center py-4">Sin comentarios registrados.</p>
                            )}
                        </div>
                        {/* Add Comment Input Area */}
                        <div className="mt-8 flex gap-3">
                            <input 
                                type="text" 
                                placeholder="Escribe un comentario o reporte..."
                                className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20"
                            />
                            <button className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                                <span className="material-icons text-base">send</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Resources & Timelines */}
                <div className="space-y-6">
                    {/* Assigned Personnel */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Personal Asignado</h3>
                        <div className="space-y-4">
                            {task.assigned?.length > 0 ? task.assigned.map((person, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                        {person.avatar || person.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{person.name}</p>
                                        <p className="text-xs text-slate-500">{person.role}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-slate-400">Sin personal asignado.</p>
                            )}
                        </div>
                    </div>

                    {/* Linked Resources/Insumos */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Insumos Necesarios</h3>
                        <div className="space-y-3">
                            {task.resources?.length > 0 ? task.resources.map((res, idx) => (
                                <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{res.name}</span>
                                    <span className="text-xs font-black text-primary px-2 py-1 bg-white dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800">
                                        {res.quantity}
                                    </span>
                                </div>
                            )) : (
                                <p className="text-sm text-slate-400">No requiere insumos externos.</p>
                            )}
                        </div>
                    </div>

                    {/* Timeline / Cronograma */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Cronograma</h3>
                        <div className="mb-4">
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-slate-400 uppercase">Estado</span>
                                <span className="text-primary">{task.date || 'Sin definir'}</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div className="bg-primary h-full rounded-full" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <p className="text-[10px] text-slate-400 uppercase font-black mb-1">Inicio</p>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">12 Feb</p>
                            </div>
                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <p className="text-[10px] text-slate-400 uppercase font-black mb-1">Límite</p>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">17 Feb</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { detailedProjects, allTasks } from '../data/mockData';
import MaterialCalculator from '../components/MaterialCalculator';
import { 
    LucideLayers, LucidePlus, LucideCalculator, LucideCheckCircle2, 
    LucideClock, LucideAlertTriangle, LucideChevronRight, LucidePackage,
    LucideClipboardList, LucideUser
} from 'lucide-react';

const ProjectDetail = () => {
    const { id } = useParams();
    const initialProject = detailedProjects.find(p => p.id === parseInt(id));
    
    const [project, setProject] = useState(initialProject);
    const [activeStageId, setActiveStageId] = useState(null);
    const [showCalculator, setShowCalculator] = useState(false);
    const [showNewStageInput, setShowNewStageInput] = useState(false);
    const [newStageName, setNewStageName] = useState('');
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    if (!project) {
        return <div className="p-8">Proyecto no encontrado</div>;
    }

    const handleAddStage = () => {
        if (!newStageName.trim()) return;
        const newStage = {
            id: `s${Date.now()}`,
            name: newStageName,
            status: 'Pendiente',
            materialComputations: [],
            tasks: []
        };
        setProject({
            ...project,
            stages: [...(project.stages || []), newStage]
        });
        setNewStageName('');
        setShowNewStageInput(false);
    };

    const handleSaveComputation = (computation) => {
        const updatedStages = project.stages.map(stage => {
            if (stage.id === activeStageId) {
                return {
                    ...stage,
                    materialComputations: [...stage.materialComputations, { ...computation, id: Date.now() }]
                };
            }
            return stage;
        });
        setProject({ ...project, stages: updatedStages });
        setShowCalculator(false);
    };

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;
        const newTask = {
            id: Date.now(),
            title: newTaskTitle,
            status: 'pendiente',
            priority: 'Media',
            date: 'Por definir',
            assigned: []
        };
        
        const updatedStages = project.stages.map(stage => {
            if (stage.id === activeStageId) {
                return {
                    ...stage,
                    tasks: [...stage.tasks, newTask.id]
                };
            }
            return stage;
        });

        // En una app real, aquí también actualizaríamos el store global de tareas
        setProject({ ...project, stages: updatedStages });
        setNewTaskTitle('');
        setShowTaskForm(false);
    };

    const getTaskById = (taskId) => {
        return allTasks.find(t => t.id === taskId) || { title: 'Tarea Nueva', status: 'pendiente' };
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Content Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <nav className="flex mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <Link to="/proyectos" className="hover:text-primary transition-colors">Proyectos</Link>
                        <span className="mx-2">/</span>
                        <span className="text-primary">{project.name}</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{project.name}</h1>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${project.stageColor}`}>
                            {project.stage}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        Generar Reporte
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 shadow-sm transition-all">
                        + Nueva Tarea
                    </button>
                </div>
            </div>

            {/* KPI Row (Simplificado para brevedad, igual al anterior) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="relative w-12 h-12 flex-shrink-0">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path className="text-slate-100 dark:text-slate-800" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            <path className="text-primary" strokeDasharray={`${project.progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{project.progress}%</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Avance</p>
                        <p className="text-lg font-black text-slate-900 dark:text-white">General</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                        <LucideClock size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Tiempo</p>
                        <p className="text-lg font-black text-slate-900 dark:text-white">{project.daysLeft} días</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-bold text-slate-400 uppercase">Presupuesto</p>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">${(project.spent/1000).toFixed(0)}k / ${(project.budget/1000).toFixed(0)}k</p>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(project.spent/project.budget)*100}%` }}></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                        <LucideCheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Tareas</p>
                        <p className="text-lg font-black text-slate-900 dark:text-white">{project.pendingTasks} pendientes</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Stages and Computation */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Stages Section */}
                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                            <div className="flex items-center gap-2">
                                <LucideLayers className="text-primary" size={20} />
                                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Etapas y Planificación Técnica</h3>
                            </div>
                            <button 
                                onClick={() => setShowNewStageInput(true)}
                                className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                            >
                                <LucidePlus size={16} /> Nueva Etapa
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {showNewStageInput && (
                                <div className="flex gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-primary/30 animate-in slide-in-from-top-2">
                                    <input 
                                        autoFocus
                                        value={newStageName}
                                        onChange={(e) => setNewStageName(e.target.value)}
                                        placeholder="Ej: Planta Alta - Mampostería"
                                        className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-3 py-1 text-sm outline-none focus:border-primary"
                                    />
                                    <button onClick={handleAddStage} className="bg-primary text-white px-3 py-1 rounded text-sm font-bold">Guardar</button>
                                    <button onClick={() => setShowNewStageInput(false)} className="text-slate-500 px-2 py-1 text-sm">Cancelar</button>
                                </div>
                            )}

                            {project.stages?.length > 0 ? (
                                <div className="space-y-4">
                                    {project.stages.map((stage) => (
                                        <div key={stage.id} className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/40">
                                            <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                                                 onClick={() => setActiveStageId(activeStageId === stage.id ? null : stage.id)}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                                        stage.status === 'Completado' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                                                    }`}>
                                                        {stage.status === 'Completado' ? <LucideCheckCircle2 size={16} /> : <LucideClock size={16} />}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{stage.name}</h4>
                                                        <p className="text-[10px] text-slate-500 uppercase font-bold">{stage.status}</p>
                                                    </div>
                                                </div>
                                                <LucideChevronRight size={20} className={`text-slate-400 transition-transform ${activeStageId === stage.id ? 'rotate-90' : ''}`} />
                                            </div>

                                            {activeStageId === stage.id && (
                                                <div className="p-4 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20 space-y-6 animate-in fade-in slide-in-from-top-1">
                                                    
                                                    {/* Cómputos */}
                                                    <div>
                                                        <div className="flex justify-between items-center mb-3">
                                                            <h5 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                                                <LucidePackage size={14} /> Materiales Requeridos
                                                            </h5>
                                                            <button 
                                                                onClick={() => setShowCalculator(true)}
                                                                className="flex items-center gap-1 text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-bold hover:bg-primary/20 transition-colors"
                                                            >
                                                                <LucideCalculator size={12} /> Calcular
                                                            </button>
                                                        </div>

                                                        {stage.materialComputations.length > 0 ? (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                {stage.materialComputations.map((comp) => (
                                                                    <div key={comp.id} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                                                                        <div className="flex justify-between items-start mb-2">
                                                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{comp.type}</span>
                                                                            <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 font-medium">
                                                                                {comp.dimensions.length}x{comp.dimensions.height}m
                                                                            </span>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            {comp.results.map((res, i) => (
                                                                                <div key={i} className="flex justify-between text-[11px]">
                                                                                    <span className="text-slate-500">{res.name}</span>
                                                                                    <span className="font-bold">{res.quantity} {res.unit}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                                                                <p className="text-[10px] text-slate-400">Sin materiales calculados.</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Tareas de la Etapa */}
                                                    <div>
                                                        <div className="flex justify-between items-center mb-3">
                                                            <h5 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                                                <LucideClipboardList size={14} /> Tareas de Ejecución
                                                            </h5>
                                                            <button 
                                                                onClick={() => setShowTaskForm(true)}
                                                                className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full font-bold hover:bg-emerald-200 transition-colors"
                                                            >
                                                                <LucidePlus size={12} /> Nueva Tarea
                                                            </button>
                                                        </div>

                                                        {showTaskForm && (
                                                            <div className="mb-3 flex gap-2 animate-in slide-in-from-top-2">
                                                                <input 
                                                                    autoFocus
                                                                    value={newTaskTitle}
                                                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                                                    placeholder="Título de la tarea..."
                                                                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-3 py-1 text-xs outline-none focus:border-emerald-500"
                                                                />
                                                                <button onClick={handleAddTask} className="bg-emerald-500 text-white px-3 py-1 rounded text-xs font-bold">Añadir</button>
                                                            </div>
                                                        )}

                                                        <div className="space-y-2">
                                                            {stage.tasks.length > 0 ? (
                                                                stage.tasks.map((taskId) => {
                                                                    const t = getTaskById(taskId);
                                                                    return (
                                                                        <div key={taskId} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg group">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className={`w-2 h-2 rounded-full ${t.status === 'finalizada' ? 'bg-emerald-500' : 'bg-orange-400'}`}></div>
                                                                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{t.title}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                {t.assigned?.length > 0 ? (
                                                                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                                                                                        {t.assigned[0].avatar || 'U'}
                                                                                    </div>
                                                                                ) : (
                                                                                    <LucideUser size={14} className="text-slate-300" />
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })
                                                            ) : (
                                                                <div className="text-center py-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                                                                    <p className="text-[10px] text-slate-400">Sin tareas asignadas.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <LucideLayers size={40} className="mx-auto text-slate-200 mb-3" />
                                    <p className="text-sm text-slate-500">Define las etapas del proyecto para comenzar la planificación.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline Column (Original) */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">Línea de Tiempo de Hitos</h3>
                        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent dark:before:via-slate-800">
                            {project.milestones.map((m, idx) => (
                                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-surface-dark bg-slate-50 dark:bg-slate-900 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                        {m.status === 'completed' ? (
                                            <span className="material-icons text-emerald-500">check_circle</span>
                                        ) : m.status === 'active' ? (
                                            <span className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                            </span>
                                        ) : (
                                            <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                                        )}
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
                                        <div className="flex items-center justify-between space-x-2 mb-1">
                                            <div className="font-bold text-slate-900 dark:text-white">{m.name}</div>
                                            <time className="font-medium text-xs text-primary">{m.date}</time>
                                        </div>
                                        <div className="text-slate-500 text-xs">Responsable: Ing. Ana García</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Team and Resources */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Equipo del Proyecto</h3>
                        <div className="space-y-4">
                            {project.team.map((person, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {person.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{person.name}</p>
                                        <p className="text-xs text-slate-500">{person.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2 text-xs font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">
                            Gestionar Equipo
                        </button>
                    </div>

                    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Recursos Críticos</h3>
                        <div className="space-y-4">
                            {project.criticalResources.map((res, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-700 dark:text-slate-300">{res.name}</span>
                                        <span className={res.status === 'Crítico' ? 'text-red-500' : 'text-emerald-500'}>{res.stock}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                                        <div className={`h-1.5 rounded-full ${res.status === 'Crítico' ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: res.stock }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para Calculador */}
            {showCalculator && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-lg">
                        <MaterialCalculator 
                            onSave={handleSaveComputation} 
                            onCancel={() => setShowCalculator(false)} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetail;

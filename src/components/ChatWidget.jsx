import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bot, X, Send } from 'lucide-react';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [contextMessage, setContextMessage] = useState('');
    const location = useLocation();

    // Mapeo de rutas a nombres amigables para el contexto
    const routeMap = {
        '/': 'el Panel de Control (Dashboard)',
        '/projects': 'la lista de Proyectos',
        '/tasks': 'la gestión de Tareas',
        '/materials': 'el inventario de Materiales',
        '/equipment': 'el catálogo de Maquinaria y Equipos',
        '/finances': 'el módulo de Finanzas',
        '/reports': 'la sección de Reportes y Analíticas',
        '/configuration': 'la Configuración del sistema',
    };

    useEffect(() => {
        const sectionName = routeMap[location.pathname] || 'esta sección';
        setContextMessage(`¡Hola! Soy tu asistente de ConstruPro. Veo que estás revisando ${sectionName}. ¿En qué puedo ayudarte hoy?`);
    }, [location.pathname]);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Ventana de Chat */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="bg-primary p-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Asistente ConstruPro</h3>
                                <p className="text-[10px] text-white/70">En línea ahora</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Cuerpo del Chat */}
                    <div className="h-80 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-950/50">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Bot size={16} />
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-700">
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {contextMessage}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer/Input */}
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                        <div className="relative flex items-center">
                            <input 
                                type="text" 
                                placeholder="Escribe un mensaje..."
                                className="w-full pl-4 pr-12 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none dark:text-white"
                            />
                            <button className="absolute right-2 p-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Botón Flotante */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${
                    isOpen ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 rotate-90' : 'bg-primary text-white'
                }`}
            >
                {isOpen ? <X size={28} /> : <Bot size={28} />}
            </button>
        </div>
    );
};

export default ChatWidget;

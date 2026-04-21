import React, { useState, useEffect } from 'react';
import { LucideCalculator, LucidePlus, LucideTrash2, LucideChevronDown, LucideChevronUp } from 'lucide-react';

const RENDIMIENTOS = {
    mamposteria: {
        name: 'Mampostería (Ladrillo 18x19x39)',
        unit: 'm2',
        materials: [
            { name: 'Ladrillo Portante 18x19x39', ratio: 12.5, unit: 'unidades' },
            { name: 'Cemento Albañilería (25kg)', ratio: 0.5, unit: 'bolsas' },
            { name: 'Arena Gruesa', ratio: 0.02, unit: 'm3' }
        ]
    },
    revoque: {
        name: 'Revoque Grueso',
        unit: 'm2',
        materials: [
            { name: 'Cemento Albañilería (25kg)', ratio: 0.4, unit: 'bolsas' },
            { name: 'Arena Gruesa', ratio: 0.015, unit: 'm3' }
        ]
    },
    hormigon: {
        name: 'Hormigón H-21 (Vigas/Columnas)',
        unit: 'm3',
        materials: [
            { name: 'Cemento Portland (50kg)', ratio: 7.5, unit: 'bolsas' },
            { name: 'Arena Gruesa', ratio: 0.65, unit: 'm3' },
            { name: 'Piedra Partida 6-20', ratio: 0.65, unit: 'm3' }
        ]
    }
};

const MaterialCalculator = ({ onSave, onCancel }) => {
    const [category, setCategory] = useState('mamposteria');
    const [dimensions, setDimensions] = useState({ length: '', height: '', width: '' });
    const [results, setResults] = useState([]);

    useEffect(() => {
        calculate();
    }, [category, dimensions]);

    const calculate = () => {
        const { length, height, width } = dimensions;
        const config = RENDIMIENTOS[category];
        
        let quantity = 0;
        if (config.unit === 'm2') {
            quantity = (parseFloat(length) || 0) * (parseFloat(height) || 0);
        } else {
            quantity = (parseFloat(length) || 0) * (parseFloat(height) || 0) * (parseFloat(width) || 0);
        }

        if (quantity > 0) {
            const calculatedMaterials = config.materials.map(m => ({
                name: m.name,
                quantity: Math.ceil(quantity * m.ratio * 100) / 100,
                unit: m.unit,
                status: 'Pendiente'
            }));
            setResults(calculatedMaterials);
        } else {
            setResults([]);
        }
    };

    const handleSave = () => {
        if (results.length > 0) {
            onSave({
                type: RENDIMIENTOS[category].name,
                dimensions: { ...dimensions },
                area: results.length > 0 ? (dimensions.length * dimensions.height) : 0,
                results: results
            });
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                <div className="flex items-center gap-2 text-primary">
                    <LucideCalculator size={20} />
                    <h3 className="font-bold">Nuevo Cómputo de Materiales</h3>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Categoría */}
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Rubro / Tarea</label>
                    <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                        {Object.entries(RENDIMIENTOS).map(([key, value]) => (
                            <option key={key} value={key}>{value.name}</option>
                        ))}
                    </select>
                </div>

                {/* Dimensiones */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Largo (m)</label>
                        <input 
                            type="number" 
                            value={dimensions.length}
                            onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
                            placeholder="0.00"
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Alto (m)</label>
                        <input 
                            type="number" 
                            value={dimensions.height}
                            onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                            placeholder="0.00"
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-primary"
                        />
                    </div>
                    {RENDIMIENTOS[category].unit === 'm3' && (
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Ancho (m)</label>
                            <input 
                                type="number" 
                                value={dimensions.width}
                                onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
                                placeholder="0.00"
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-primary"
                            />
                        </div>
                    )}
                </div>

                {/* Resultados en tiempo real */}
                {results.length > 0 && (
                    <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/10">
                        <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                            Materiales Necesarios Estimados
                        </h4>
                        <div className="space-y-3">
                            {results.map((res, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">{res.name}</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{res.quantity} {res.unit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button 
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                    Cancelar
                </button>
                <button 
                    onClick={handleSave}
                    disabled={results.length === 0}
                    className="px-6 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Confirmar y Agregar
                </button>
            </div>
        </div>
    );
};

export default MaterialCalculator;

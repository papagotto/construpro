// TABLA: MATERIALES
export const materials = [
    {
        id: 1,
        name: 'Cemento Portland',
        sku: 'CEM-004',
        category: 'Cemento',
        categoryColor: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        stock: 1200,
        unit: 'sacos',
        progress: 80,
        progressColor: 'bg-emerald-500',
        location: 'Almacén B',
        image: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=800',
        specifications: [
            { label: 'Tipo', value: 'Portland Tipo I' },
            { label: 'Proveedor', value: 'Holcim' }
        ],
        usageHistory: [
            { date: '12 Feb 2024', project: 'Residencial Los Álamos', quantity: '200 sacos' }
        ],
        alert: 'Reordenar cuando baje de 200 sacos'
    },
    {
        id: 2,
        name: 'Varilla Corrugada 1/2"',
        sku: 'ACE-112',
        category: 'Acero',
        categoryColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        stock: 450,
        unit: 'piezas',
        progress: 45,
        progressColor: 'bg-amber-500',
        location: 'Patio de Metales',
        image: 'https://images.pexels.com/photos/159358/construction-site-build-construction-structure-159358.jpeg?auto=compress&cs=tinysrgb&w=800',
        specifications: [
            { label: 'Grado', value: '60' },
            { label: 'Longitud', value: '12 metros' }
        ],
        usageHistory: [
            { date: '10 Feb 2024', project: 'Torre Skyline', quantity: '100 piezas' }
        ],
        alert: 'Stock bajo - Reposición urgente'
    },
    {
        id: 3,
        name: 'Ladrillo Rojo Recocido',
        sku: 'LAD-200',
        category: 'Albañilería',
        categoryColor: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
        stock: 5000,
        unit: 'unidades',
        progress: 95,
        progressColor: 'bg-emerald-500',
        location: 'Almacén A',
        image: 'https://images.pexels.com/photos/1098982/pexels-photo-1098982.jpeg?auto=compress&cs=tinysrgb&w=800',
        specifications: [
            { label: 'Dimensiones', value: '7x14x28 cm' },
            { label: 'Resistencia', value: '100 kg/cm²' }
        ],
        usageHistory: [
            { date: '08 Feb 2024', project: 'Centro Comercial Sur', quantity: '1500 unidades' }
        ]
    },
    {
        id: 4,
        name: 'Arena de Río',
        sku: 'ARE-050',
        category: 'Agregados',
        categoryColor: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
        stock: 15,
        unit: 'm³',
        progress: 15,
        progressColor: 'bg-red-500',
        location: 'Silo Exterior 1',
        image: 'https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg?auto=compress&cs=tinysrgb&w=800',
        specifications: [
            { label: 'Granulometría', value: 'Fina' },
            { label: 'Humedad', value: '5%' }
        ],
        usageHistory: [
            { date: '11 Feb 2024', project: 'Mezcla General', quantity: '5 m³' }
        ],
        alert: 'Crítico: Menos de 20 m³ disponibles'
    }
];

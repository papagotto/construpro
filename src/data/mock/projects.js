// TABLA: PROYECTOS
export const detailedProjects = [
    {
        id: 1,
        code: 'PRJ-101',
        name: 'Residencial Los Álamos',
        client: 'Inmobiliaria Horizonte S.A.',
        stage: 'Estructura',
        stageColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        progress: 65,
        status: 'En curso',
        statusColor: 'bg-green-100 text-green-700',
        startDate: '12 Ene, 2024',
        endDate: '15 Dic, 2024',
        daysLeft: 124,
        budget: 450000,
        spent: 385000,
        pendingTasks: 18,
        milestones: [
            { id: 'm1', name: 'Cimentación', status: 'completed', date: '15 Mar, 2024' },
            { id: 'm2', name: 'Estructura', status: 'active', date: 'En curso' },
            { id: 'm3', name: 'Acabados', status: 'pending', date: '10 Oct, 2024' }
        ],
        team: [
            { id: 'u1', name: 'Ana García', role: 'Jefe de Obra', avatar: 'A' },
            { id: 'u2', name: 'Luis Torres', role: 'Arquitecto', avatar: 'L' }
        ],
        criticalResources: [
            { name: 'Cemento Portland', stock: '80%', status: 'Saludable' },
            { name: 'Acero Corrugado', stock: '35%', status: 'Crítico' }
        ],
        spentPercent: 85,
        spentStatus: 'warning',
        stages: [
            {
                id: 's1',
                name: 'Cimentación y Capa Aisladora',
                status: 'Completado',
                materialComputations: [],
                tasks: [3] // ID de la tarea 'Vaciado de losa cimentación'
            },
            {
                id: 's2',
                name: 'Mampostería Planta Baja',
                status: 'En curso',
                materialComputations: [
                    {
                        id: 'c1',
                        type: 'Mampostería',
                        dimensions: { length: 20, height: 3 },
                        area: 60,
                        results: [
                            { name: 'Ladrillo Portante 18x19x39', quantity: 750, unit: 'unidades', status: 'Pendiente' },
                            { name: 'Cemento Albañilería (25kg)', quantity: 30, unit: 'bolsas', status: 'Pendiente' },
                            { name: 'Arena Gruesa', quantity: 1.2, unit: 'm3', status: 'Pendiente' }
                        ]
                    }
                ],
                tasks: [2] // ID de la tarea 'Acarreo de material'
            }
        ]
    },
    {
        id: 2,
        code: 'PRJ-102',
        name: 'Torre Corporativa Delta',
        client: 'Grupo Financiero S.A.',
        stage: 'Cimentación',
        stageColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
        progress: 22,
        status: 'En Riesgo',
        statusColor: 'bg-amber-100 text-amber-700',
        startDate: '05 Mar, 2024',
        endDate: '20 Jul, 2025',
        daysLeft: 410,
        budget: 1200000,
        spent: 125000,
        pendingTasks: 42,
        milestones: [
            { id: 'm5', name: 'Excavación', status: 'completed', date: '20 May, 2024' }
        ],
        team: [
            { id: 'u4', name: 'Roberto M.', role: 'Jefe de Obra', avatar: 'R' }
        ],
        criticalResources: [],
        spentPercent: 10,
        spentStatus: 'normal',
        stages: []
    },
    {
        id: 3,
        code: 'PRJ-103',
        name: 'Remodelación Hotel Plaza',
        client: 'Inversiones Turísticas',
        stage: 'Acabados',
        stageColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        progress: 92,
        status: 'En curso',
        statusColor: 'bg-green-100 text-green-700',
        startDate: '15 Ago, 2023',
        endDate: '30 Abr, 2024',
        daysLeft: 12,
        budget: 85000,
        spent: 92400,
        pendingTasks: 5,
        milestones: [],
        team: [],
        criticalResources: [],
        spentPercent: 108,
        spentStatus: 'danger',
        stages: []
    },
    {
        id: 4,
        code: 'PRJ-SXXI',
        name: 'Aulas Siglo XXI - Villa María',
        client: 'Campus Universitario SXXI',
        stage: 'Obra Civil II',
        stageColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        progress: 35,
        status: 'En curso',
        statusColor: 'bg-green-100 text-green-700',
        startDate: '01 Feb, 2026',
        endDate: '15 Dic, 2026',
        daysLeft: 300,
        budget: 2500000,
        spent: 450000,
        pendingTasks: 24,
        milestones: [
            { id: 'm10', name: 'Mampostería PB', status: 'active', date: 'En curso' },
            { id: 'm11', name: 'Cubierta Losas', status: 'pending', date: 'Mayo 2026' }
        ],
        team: [
            { id: 'u5', name: 'Sofía Cantisani', role: 'Arq. Responsable', avatar: 'S' },
            { id: 'u6', name: 'Carlos Ruiz', role: 'Jefe de Obra', avatar: 'C' }
        ],
        criticalResources: [
            { name: 'Hercal 25kg', stock: '85%', status: 'Saludable' },
            { name: 'Ladrillo 18x19x39', stock: '20%', status: 'Crítico' }
        ],
        spentPercent: 18,
        spentStatus: 'normal',
        stages: [
            {
                id: 'sxxi-s1',
                name: 'Mampostería y Revoques',
                status: 'En curso',
                materialComputations: [
                    {
                        id: 'c101',
                        type: 'Mampostería Lucera',
                        dimensions: { length: 70.8, height: 1.2 },
                        area: 85,
                        results: [
                            { name: 'Bloques Cerámicos 18x19x39', quantity: 1190, unit: 'unidades', status: 'Pendiente' },
                            { name: 'Hercal (25kg)', quantity: 11, unit: 'bolsas', status: 'En Obra' },
                            { name: 'Arena Gruesa', quantity: 1.36, unit: 'm3', status: 'En Obra' }
                        ]
                    },
                    {
                        id: 'c102',
                        type: 'Revoque Grueso',
                        dimensions: { length: 85, height: 2 },
                        area: 170,
                        results: [
                            { name: 'Hercal (25kg)', quantity: 26, unit: 'bolsas', status: 'En Obra' },
                            { name: 'Arena Gruesa', quantity: 3.4, unit: 'm3', status: 'En Obra' },
                            { name: 'Hidrófugo (5L)', quantity: 3, unit: 'bidones', status: 'Pendiente' }
                        ]
                    }
                ],
                tasks: [10, 11]
            },
            {
                id: 'sxxi-s2',
                name: 'Cubierta e Impermeabilización',
                status: 'Pendiente',
                materialComputations: [
                    {
                        id: 'c103',
                        type: 'Cubierta 553m2',
                        dimensions: { length: 553, height: 1 },
                        area: 553,
                        results: [
                            { name: 'Sikalastic 560 (20kg)', quantity: 55, unit: 'baldes', status: 'Pendiente' },
                            { name: 'Membrana Geotextil', quantity: 65, unit: 'rollos', status: 'Pendiente' },
                            { name: 'Hormigón Alivianado H13', quantity: 75, unit: 'm3', status: 'Pendiente' }
                        ]
                    }
                ],
                tasks: [12]
            },
            {
                id: 'sxxi-s3',
                name: 'Instalaciones Sanitarias',
                status: 'Pendiente',
                materialComputations: [
                    {
                        id: 'c104',
                        type: 'Cloacas y Artefactos',
                        results: [
                            { name: 'Inodoro Bari Ferrum', quantity: 12, unit: 'unidades', status: 'Pendiente' },
                            { name: 'Bacha Arianna Ferrum', quantity: 12, unit: 'unidades', status: 'Pendiente' },
                            { name: 'Caño 110 Cloacas', quantity: 144, unit: 'ml', status: 'Pendiente' }
                        ]
                    }
                ],
                tasks: []
            }
        ]
    }
];

export const activeProjects = detailedProjects.slice(0, 2);

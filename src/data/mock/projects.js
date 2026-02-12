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
        spentStatus: 'warning'
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
        spentStatus: 'normal'
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
        spentStatus: 'danger'
    }
];

export const activeProjects = detailedProjects.slice(0, 2);

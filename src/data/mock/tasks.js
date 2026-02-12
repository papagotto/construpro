// TABLA: TAREAS
export const allTasks = [
    {
        id: 1,
        projectId: 2,
        projectCode: '#PRJ-102',
        title: 'Instalación de tuberías PVC - Nivel 2',
        status: 'pendiente',
        priority: 'Urgente',
        priorityColor: 'bg-red-100 text-red-600',
        date: 'Vencida (Oct 20)',
        dateColor: 'text-red-600',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm6aI2e6Fl7OsAtqpRhOu-J732EGJcXxzecN0uZ8EC-LZp6NISkSbK0PTyWFR-2VCn-1RqLWJGme7zmc6YwMvZRg6LQSx_H3d96bEkdccD2vWHC-WwP4QUXKKjJHRH8YXQ-WC1lA1pSXuF7r3JIcDOiCUoIK2cgt2mGvCRRVQu1-PK00GjlHtHxQzpggXFzXZJ5_T-zlWY_UusKOwMRWRZ-XM1WXxn6YnaV36Pl0MvgYZzUJ2wfDICF-DZKe5KrxHjPLanGz1e6GE',
        description: 'Instalación de la red sanitaria principal en el ala norte del segundo nivel.',
        checklist: [
            { text: 'Limpieza de áreas de unión', completed: true },
            { text: 'Presentación de tubería', completed: true },
            { text: 'Aplicación de soldadura PVC', completed: false }
        ],
        resources: [
            { name: 'Tubería PVC 4"', quantity: '12 metros' }
        ],
        assigned: [{ name: 'Ricardo M.', role: 'Plomero Jefe' }],
        log: []
    },
    {
        id: 2,
        projectId: 1,
        projectCode: '#PRJ-085',
        title: 'Acarreo de material de relleno',
        status: 'pendiente',
        priority: 'Media',
        priorityColor: 'bg-orange-100 text-orange-600',
        date: 'Oct 26',
        dateColor: 'text-slate-500',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCx7rkOI4sAXMs8CFoDjFOd55Vi9jYr9RigpHQM42aDaFPPWWYX3nYxCGAyPFq5xGGi2NHADL-qT9rufHYiYNLSWhU0kLVma23HphpBAfeXvsEqV7M-E6KbH4OMJcApUgklAjsxz_BSykdbF6U2SOK29egh6xaaMloqCD7qROCchyxmzrdoCjjoRW02sVP-I0oS6QXh8RT4LChK6juLgtyJmKPrY8MYA9At7cuEoyfDhJp3OhFmDXjeR6hY_FKB0WkZclhhhGvyiVg',
        description: 'Transporte de material de cantera para nivelación de terreno.',
        checklist: [],
        resources: [],
        assigned: [],
        log: []
    },
    {
        id: 3,
        projectId: 1,
        projectCode: '#PRJ-110',
        title: 'Vaciado de losa cimentación',
        subtitle: 'Sección Norte - Sector A',
        status: 'enProceso',
        priority: 'Urgente',
        priorityColor: 'bg-red-100 text-red-600',
        date: 'Día 3 de 5',
        dateColor: 'text-orange-600',
        description: "Vaciado masivo de concreto premezclado f'c=210kg/cm².",
        checklist: [
            { text: 'Armado de malla de acero', completed: true },
            { text: 'Instalación de pasamuros', completed: true }
        ],
        log: [
            { user: 'Carlos Ruiz', message: 'Malla de acero verificada.', time: 'Hoy, 08:30 AM' }
        ],
        resources: [
            { name: 'Cemento Portland', quantity: '40 bultos' }
        ],
        assigned: [
            { name: 'Carlos Ruiz', role: 'Capataz', avatar: 'C' }
        ]
    }
];

// Helper para agrupar por status (Vista Kanban)
export const kanbanTasks = {
    pendiente: allTasks.filter(t => t.status === 'pendiente'),
    enProceso: allTasks.filter(t => t.status === 'enProceso'),
    enRevision: allTasks.filter(t => t.status === 'enRevision'),
    finalizada: allTasks.filter(t => t.status === 'finalizada')
};

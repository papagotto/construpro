// CONFIGURACIÓN DE UI (Navegación, Reportes, Alertas)
export const navigation = [
    { name: 'Dashboard', href: '/', icon: 'dashboard', category: 'General' },
    { name: 'Proyectos', href: '/proyectos', icon: 'corporate_fare', category: 'General' },
    { name: 'Tareas', href: '/tareas', icon: 'checklist_rtl', category: 'General' },
    {
        name: 'Recursos',
        href: '/recursos',
        icon: 'inventory_2',
        category: 'Recursos',
        subItems: [
            { name: 'Materiales', href: '/recursos-materiales', icon: 'storage' },
            { name: 'Equipamiento', href: '/recursos-equipos', icon: 'precision_manufacturing' },
            { name: 'Personal', href: '/usuarios', icon: 'badge' }
        ]
    },
    { name: 'Finanzas', href: '/finanzas', icon: 'payments', category: 'Recursos' },
    { name: 'Reportes', href: '/reportes', icon: 'bar_chart', category: 'Recursos' },
    { name: 'Configuración', href: '/configuracion', icon: 'settings', category: 'Recursos' },
];

export const reports = {
    types: [
        { id: 'costos', title: 'Análisis de Costos', description: 'Presupuesto vs Gasto Real.', icon: 'payments', selected: true },
        { id: 'tareas', title: 'Progreso de Tareas', description: 'Cumplimiento de hitos.', icon: 'pending_actions' }
    ],
    metrics: [
        { phase: 'Cimentación', project: 'Torre Horizonte', budget: '$450,000', actual: '$425,500', variation: '-5.4%' }
    ]
};

export const recentActivity = [
    { id: 1, action: 'Cimentación terminada', context: 'Residencial Los Álamos • Hace 2h', icon: 'done', color: 'bg-green-500' },
    { id: 2, action: 'Factura aprobada #9022', context: 'Proyecto Y • Hace 4h', icon: 'receipt_long', color: 'bg-primary' }
];

export const alerts = [
    { id: 1, title: 'Lote de Acero #4452', description: 'Presupuesto excedido por 12.5%', project: 'Proyecto X' }
];

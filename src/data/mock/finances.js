// TABLA: TRANSACCIONES
export const transactions = [
    {
        id: 'TX-9022',
        date: '12 Feb, 2024',
        concept: 'Pago Lote Cemento Portland #442',
        projectId: 1,
        projectName: 'Residencial Los Álamos',
        category: 'Materiales',
        categoryColor: 'bg-slate-100 text-slate-600',
        amount: -15400.00,
        type: 'expense',
        status: 'Completado',
        statusColor: 'bg-emerald-50 text-emerald-600'
    },
    {
        id: 'TX-9023',
        date: '11 Feb, 2024',
        concept: 'Venta Lote Residencial - Adelanto 30%',
        projectId: 2,
        projectName: 'Torre Delta',
        category: 'Venta',
        categoryColor: 'bg-blue-50 text-blue-600',
        amount: 45000.00,
        type: 'income',
        status: 'Pendiente',
        statusColor: 'bg-orange-50 text-orange-600'
    }
];

// RESUMEN FINANCIERO (Vistas agregadas)
export const finances = {
    summary: [
        { label: 'Ingresos Totales', value: '$1.250.000,00', change: '+8.2%', trend: 'up', icon: 'payments' },
        { label: 'Costos Totales', value: '$840.000,00', change: '+2.4%', trend: 'neutral', icon: 'receipt_long' },
        { label: 'Margen Bruto', value: '32.8%', change: '+1.5%', trend: 'up', icon: 'pie_chart' }
    ],
    monthlyHistory: [
        { month: 'Ene', budget: 180000, actual: 165000 },
        { month: 'Feb', budget: 210000, actual: 225000 }
    ],
    movements: transactions
};

// TABLA: DATOS_PRESUPUESTO (Para gráficas)
export const budgetData = [
    { month: 'ENE', budget: 100, actual: 70 },
    { month: 'FEB', budget: 90, actual: 85 },
    { month: 'MAR', budget: 95, actual: 98 },
    { month: 'ABR', budget: 80, actual: 65 },
    { month: 'MAY', budget: 100, actual: 92 },
];

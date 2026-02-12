// TABLA: EQUIPAMIENTO
export const equipment = [
    {
        id: 1,
        name: 'Grúa Torre Potain MCT 85',
        code: 'EQ-2034-GT',
        status: 'En Uso',
        statusColor: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
        maintenanceDate: '15 Oct 2023',
        image: 'https://images.pexels.com/photos/1703314/pexels-photo-1703314.jpeg?auto=compress&cs=tinysrgb&w=800',
        hours: '2,800 hrs',
        location: 'Torre Skyline - Sector A',
        operators: ['Carlos Ruiz'],
        specs: [
            { label: 'Capacidad', value: '5 toneladas' },
            { label: 'Altura Máx', value: '40m' }
        ]
    },
    {
        id: 2,
        name: 'Excavadora Caterpillar 320',
        code: 'EQ-4412-EX',
        status: 'Disponible',
        statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
        maintenanceDate: '22 Nov 2023',
        image: 'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=800',
        hours: '1,250 hrs',
        location: 'Parque de Maquinaria Central',
        operators: ['Juan Pérez', 'Marcos Díaz'],
        specs: [
            { label: 'Potencia', value: '158 hp' },
            { label: 'Peso', value: '22,500 kg' }
        ]
    },
    {
        id: 3,
        name: 'Camión Hormigonera Mack Granite',
        code: 'EQ-9011-CH',
        status: 'Mantenimiento',
        statusColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        maintenanceDate: '10 Feb 2024',
        image: 'https://images.pexels.com/photos/2116719/pexels-photo-2116719.jpeg?auto=compress&cs=tinysrgb&w=800',
        hours: '4,500 hrs',
        location: 'Taller Norte',
        operators: ['Roberto Gómez'],
        specs: [
            { label: 'Capacidad', value: '8 m³' },
            { label: 'Tracción', value: '6x4' }
        ],
        isWarning: true
    },
    {
        id: 4,
        name: 'Generador Eléctrico JCB G100',
        code: 'EQ-1122-GE',
        status: 'En Uso',
        statusColor: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
        maintenanceDate: '05 Ene 2024',
        image: 'https://images.pexels.com/photos/38271/industrial-generator-electricity-power-38271.jpeg?auto=compress&cs=tinysrgb&w=800',
        hours: '850 hrs',
        location: 'Residencial Los Álamos',
        operators: ['Ana Martínez'],
        specs: [
            { label: 'Potencia', value: '100 kVA' },
            { label: 'Frecuencia', value: '50/60 Hz' }
        ]
    }
];

// TABLA: USUARIOS
export const userData = {
    id: 'usr_001',
    name: 'Juan Pérez',
    role: 'Gerente de Proyecto',
    email: 'juan.perez@construpro.com',
    phone: '+52 55 1234 5678',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEufOpV83LgABO235FpOad2wJ28qmWJl60mJVH43uwwnsO1jL6649F_ucKGh6FtLTWJmoMuosLfrtzceVwA6MRbBueHSxD3tQs4IRy1KTRfWCrrdTIalUY3999q84XKKUN5I70CgnWoluvfhLBOcQaee8Q_fNfROmhsoqedEyxX8Pk0C_sOU66CWuyuLp3Xkre5A_Yow6NWe_6w8UgOUpjLF6G-GNSfkgo3xyc-EGMO2bZfWyE4mOYCiC_Tj4iLsBb6iiagiQa1KM',
};

// TABLA: CONFIGURACION_USUARIO
export const settings = {
    profile: { ...userData },
    sections: [
        {
            id: 'general',
            title: 'General',
            icon: 'tune',
            items: [
                { label: 'Idioma', value: 'Español (México)' },
                { label: 'Zona Horaria', value: '(GMT-06:00) Mexico City' },
                { label: 'Moneda', value: 'MXN ($)' }
            ]
        },
        {
            id: 'notificaciones',
            title: 'Notificaciones',
            icon: 'notifications',
            items: [
                { label: 'Alertas de Presupuesto', type: 'toggle', enabled: true },
                { label: 'Actualización de Tareas', type: 'toggle', enabled: true },
                { label: 'Reportes Semanales', type: 'toggle', enabled: false }
            ]
        },
        {
            id: 'seguridad',
            title: 'Security',
            icon: 'security',
            items: [
                { label: 'Cambiar Contraseña', type: 'button' },
                { label: 'Autenticación en dos pasos', type: 'toggle', enabled: true },
                { label: 'Sesiones Activas', type: 'link' }
            ]
        }
    ]
};

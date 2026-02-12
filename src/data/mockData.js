/**
 * MOCK DATA CENTRALIZER
 * Este archivo centraliza los datos mock segmentados por entidad.
 * Simula el comportamiento de una API unificada.
 */

import { userData, settings } from './mock/users';
import { detailedProjects, activeProjects } from './mock/projects';
import { allTasks, kanbanTasks } from './mock/tasks';
import { materials } from './mock/material';
import { equipment } from './mock/equipment';
import { transactions, finances, budgetData } from './mock/finances';
import { navigation, reports, recentActivity, alerts } from './mock/ui';

// Re-exportamos todo para mantener compatibilidad con el frontend
export {
    userData,
    settings,
    detailedProjects,
    activeProjects,
    allTasks,
    kanbanTasks,
    materials,
    equipment,
    transactions,
    finances,
    budgetData,
    navigation,
    reports,
    recentActivity,
    alerts
};

// Estadísticas calculadas dinámicamente para el Dashboard
export const dashboardStats = [
    { 
        label: 'Proyectos Activos', 
        value: detailedProjects.filter(p => p.status === 'En curso').length.toString(), 
        icon: 'foundation' 
    },
    { 
        label: 'Tareas Pendientes', 
        value: allTasks.filter(t => t.status === 'pendiente').length.toString(), 
        icon: 'task_alt' 
    },
];

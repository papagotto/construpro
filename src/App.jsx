import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Auth Pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Dashboard Pages
import Home from './pages/dashboard/Home';
import Reports from './pages/dashboard/Reports';
import Finances from './pages/dashboard/Finances';

// Projects Pages
import Projects from './pages/projects/Projects';
import ProjectDetail from './pages/projects/ProjectDetail';

// Resources Pages
import Materials from './pages/resources/Materials';
import MaterialDetail from './pages/resources/MaterialDetail';
import Equipment from './pages/resources/Equipment';
import EquipmentDetail from './pages/resources/EquipmentDetail';
import Units from './pages/resources/Units';
import Users from './pages/resources/Users';

// Engineering Pages
import Engineering from './pages/engineering/Engineering';
import RubroDetail from './pages/engineering/RubroDetail';

// Tasks Pages
import Tasks from './pages/tasks/Tasks';
import TaskDetail from './pages/tasks/TaskDetail';

// Profile & Settings
import Profile from './pages/profile/Profile';
import Configuration from './pages/profile/Configuration';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Rutas Protegidas (Layout Principal) */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/" element={<Home />} />
            
            {/* Obras y Proyectos */}
            <Route path="/proyectos" element={<Projects />} />
            <Route path="/proyectos/:id" element={<ProjectDetail />} />
            
            {/* Recursos e Inventario */}
            <Route path="/recursos-materiales" element={<Materials />} />
            <Route path="/recursos-materiales/:id" element={<MaterialDetail />} />
            <Route path="/recursos-equipos" element={<Equipment />} />
            <Route path="/recursos-equipos/:id" element={<EquipmentDetail />} />
            <Route path="/recursos-unidades" element={<Units />} />
            <Route path="/recursos-personal" element={<Users />} />
            
            {/* Ingeniería y APU */}
            <Route path="/ingenieria" element={<Engineering />} />
            <Route path="/ingenieria/:id" element={<RubroDetail />} />
            
            {/* Gestión de Tareas */}
            <Route path="/tareas" element={<Tasks />} />
            <Route path="/tareas/:id" element={<TaskDetail />} />
            
            {/* Reportes y Finanzas */}
            <Route path="/reportes" element={<Reports />} />
            <Route path="/finanzas" element={<Finances />} />
            
            {/* Configuración y Perfil */}
            <Route path="/configuracion" element={<Configuration />} />
            <Route path="/perfil" element={<Profile />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={
            window.location.hash.includes('access_token') ? (
              <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-widest animate-pulse">Validando Invitación...</p>
                </div>
              </div>
            ) : (
              <Navigate to="/" replace />
            )
          } />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;

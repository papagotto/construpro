import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import Materials from './pages/Materials';
import MaterialDetail from './pages/MaterialDetail';
import Equipment from './pages/Equipment';
import EquipmentDetail from './pages/EquipmentDetail';
import Finances from './pages/Finances';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Configuration from './pages/Configuration';
import Profile from './pages/Profile';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Verificando Seguridad...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Ruta Pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas Protegidas bajo MainLayout */}
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route index element={<Home />} />
            <Route path="proyectos" element={<Projects />} />
            <Route path="proyectos/:id" element={<ProjectDetail />} />
            <Route path="tareas" element={<Tasks />} />
            <Route path="tareas/:id" element={<TaskDetail />} />
            <Route path="recursos-materiales" element={<Materials />} />
            <Route path="recursos-materiales/:id" element={<MaterialDetail />} />
            <Route path="recursos-equipos" element={<Equipment />} />
            <Route path="recursos-equipos/:id" element={<EquipmentDetail />} />
            <Route path="finanzas" element={<Finances />} />
            <Route path="usuarios" element={<Users />} />
            <Route path="reportes" element={<Reports />} />
            <Route path="configuracion" element={<Configuration />} />
            <Route path="perfil" element={<Profile />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;

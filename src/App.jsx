import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import Reports from './pages/Reports';
import Configuration from './pages/Configuration';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
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
          <Route path="reportes" element={<Reports />} />
          <Route path="configuracion" element={<Configuration />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

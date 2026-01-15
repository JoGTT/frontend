import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import NuevaHojaRuta from '../components/NuevaHojaRuta';
import ProtectedRoute from '../components/ProtectedRoute';
import RegistrosPage from '../pages/RegistrosPageClean';
import HistorialPage from '../pages/HistorialPage';
import NotificacionesPage from '../pages/NotificacionesPage';
import EnviarPage from '../pages/EnviarPage';
import GestionEnvios from '../pages/GestionEnvios';
import ProgresoPage from '../pages/ProgresoPage';
import DashboardHojaRuta from '../components/DashboardHojaRuta';
import DashboardWithTopNav from '../components/DashboardWithTopNav';
import ColorPalettePreview from '../components/ColorPalettePreview';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirección desde la raíz al dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Ruta de login */}
      <Route path="/login" element={<Login />} />
      
      {/* Rutas protegidas con TopNav Layout */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardWithTopNav>
              <Dashboard />
            </DashboardWithTopNav>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/nueva-hoja" 
        element={
          <ProtectedRoute>
            <DashboardWithTopNav>
              <NuevaHojaRuta />
            </DashboardWithTopNav>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/registros" 
        element={
          <ProtectedRoute>
            <DashboardWithTopNav>
              <RegistrosPage />
            </DashboardWithTopNav>
          </ProtectedRoute>
        } 
      />
      <Route
        path="/hoja/:id"
        element={
          <ProtectedRoute>
            <DashboardWithTopNav>
              <DashboardHojaRuta />
            </DashboardWithTopNav>
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/historial" 
        element={
          <ProtectedRoute>
            <DashboardWithTopNav>
              <HistorialPage />
            </DashboardWithTopNav>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/notificaciones" 
        element={
          <ProtectedRoute>
            <DashboardWithTopNav>
              <NotificacionesPage />
            </DashboardWithTopNav>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/enviar" 
        element={
          <ProtectedRoute>
            <DashboardWithTopNav>
              <EnviarPage />
            </DashboardWithTopNav>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/gestion-envios" 
        element={
          <ProtectedRoute>
            <DashboardWithTopNav>
              <GestionEnvios />
            </DashboardWithTopNav>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/progreso" 
        element={
          <ProtectedRoute>
            <DashboardWithTopNav>
              <ProgresoPage />
            </DashboardWithTopNav>
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta de Preview de Paletas (sin protección para poder verla sin login) */}
      <Route 
        path="/color-palette-preview" 
        element={<ColorPalettePreview />}
      />
    </Routes>
  );
};

export default AppRoutes;
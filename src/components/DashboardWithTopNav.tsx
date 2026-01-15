import React, { useState, useEffect } from 'react';
import TopNavBar from './TopNavBar';
import UserMenu from './UserMenu';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ModernDashboard from './ModernDashboard';
import NuevaHojaRuta from './NuevaHojaRuta';
import HojaRutaDetalleView from './HojaRutaDetalleView';

interface DashboardWithTopNavProps {
  children?: React.ReactNode;
}

const DashboardWithTopNav: React.FC<DashboardWithTopNavProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  // Sincronizar activeSection con la ruta actual
  useEffect(() => {
    const pathToSection: { [key: string]: string } = {
      '/dashboard': 'inicio',
      '/nueva-hoja': 'nueva-hoja',
      '/enviar': 'enviar',
      '/gestion-envios': 'gestion-envios',
      '/progreso': 'progreso',
      '/registros': 'registros',
      '/historial': 'historial',
      '/notificaciones': 'notificaciones',
    };
    
    const section = pathToSection[location.pathname] || 'inicio';
    setActiveSection(section);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setUserMenuOpen(false);

    // Navegar según la sección
    switch (sectionId) {
      case 'inicio':
        navigate('/dashboard');
        break;
      case 'nueva-hoja':
        navigate('/nueva-hoja');
        break;
      case 'enviar':
        navigate('/enviar');
        break;
      case 'gestion-envios':
        navigate('/gestion-envios');
        break;
      case 'progreso':
        navigate('/progreso');
        break;
      case 'registros':
        navigate('/registros');
        break;
      case 'historial':
        navigate('/historial');
        break;
      case 'notificaciones':
        navigate('/notificaciones');
        break;
      default:
        break;
    }
  };

  if (!user) {
    return <div className="p-4">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--color-morado-50)]">
      {/* Top Navigation Bar */}
      <TopNavBar
        user={user}
        onSelectSection={handleSelectSection}
        activeSection={activeSection}
        onUserMenu={() => setUserMenuOpen(!userMenuOpen)}
      />

      {/* Main Content - with padding for fixed TopNav */}
      <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-8 bg-[var(--color-morado-50)]">
        {children}
      </main>

      {/* User Menu Dropdown */}
      {userMenuOpen && (
        <UserMenu
          onClose={() => setUserMenuOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default DashboardWithTopNav;

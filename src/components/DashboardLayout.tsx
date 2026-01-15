import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import AnimatedSection from './AnimatedSection';
import UsuarioIcon from '../assets/usario';
import NotificationIcon from '../assets/notification';
import LupayIcon from '../assets/lupay';
import CerrarLogo from '../assets/cerrar';
import NuevaHojaRuta from './NuevaHojaRuta';
import RegistrosPage from '../pages/RegistrosPage';
import HistorialPage from '../pages/HistorialPage';
import NotificacionesPage from '../pages/NotificacionesPage';
import ModernDashboard from './ModernDashboard';
import HojaRutaDetalleView from './HojaRutaDetalleView';
import EnviarPage from '../pages/EnviarPage';
import GestionEnvios from '../pages/GestionEnvios';
import { useSearch } from '../contexts/SearchContext';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarFixed, setSidebarFixed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('inicio');
  const [selectedHoja, setSelectedHoja] = useState<any>(null); // Estado para hoja seleccionada
  const { query, setQuery } = useSearch();
  const { logout } = useAuth();

  const expanded = menuOpen || sidebarFixed;

  // sidebar widths in pixels for tailwind w-64 (256) and w-28 (112)
  const sidebarWidth = expanded ? 256 : 112;

  // Listener para navegación desde HojaRutaDetalle
  useEffect(() => {
    const handleNavigate = (event: CustomEvent) => {
      const { to } = event.detail;
      console.log('🎯 Evento de navegación recibido:', to);
      if (to === 'enviar') {
        setActiveSection('enviar');
        setSelectedHoja(null); // Limpiar hoja seleccionada
        console.log('✅ Navegado a sección enviar');
      }
    };

    window.addEventListener('navigate', handleNavigate as EventListener);
    
    return () => {
      window.removeEventListener('navigate', handleNavigate as EventListener);
    };
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  // Función para manejar cuando se selecciona una hoja desde registros
  const handleHojaSelected = (hoja: any) => {
    setSelectedHoja(hoja);
    setActiveSection('hoja-detalle');
  };

  // Función para volver a registros
  const handleBackToRegistros = () => {
    setSelectedHoja(null);
    setActiveSection('registros');
  };

  return (
  <div className="min-h-screen flex bg-[var(--color-fondo-casi-blanco)]">
      {/* Menú lateral elegante (componente separado) */}
      <Sidebar
        expanded={menuOpen || sidebarFixed}
        onEnter={() => setMenuOpen(true)}
        onLeave={() => setMenuOpen(false)}
        fixed={sidebarFixed}
        onFixToggle={() => setSidebarFixed(v => !v)}
        onSelectSection={(id: string) => setActiveSection(id)}
        activeSection={activeSection}
      />
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: sidebarWidth }}>
  {/* Header */}
  <header className="h-24 bg-[var(--color-fondo-blanco)] animate-fade-in">
    {/* central container matches main content width so header elements align with page content */}
    <div className="w-full max-w-6xl mx-auto px-4 h-full flex items-center">
    {/* left spacer removed — rely on normal layout so header and main content share the same centered container */}

      {/* Search bar centered */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full">
          <div className="relative">
            <div className="flex items-center bg-[var(--color-gris-100)] rounded-lg px-4 py-2 hover:border-[var(--color-gris-400)] transition-colors border-2 border-[var(--color-gris-700)]">
              <span className="text-[var(--color-gris-700)] mr-3 flex items-center">
                <LupayIcon width={20} height={20} fill="var(--color-gris-700)" />
              </span>

              <input
                type="text"
                placeholder="Buscar por H.R., referencia, ubicación, nombre, teléfono..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    // show registros in the central pane instead of navigating
                    setActiveSection('registros');
                  }
                }}
                className="flex-1 bg-transparent text-[var(--color-gris-900)] placeholder:text-[var(--color-gris-500)] focus:outline-none text-sm"
              />

              <div className="flex items-center gap-3 ml-4">
                <button className="p-2 rounded-md text-[var(--color-gris-700)] hover:bg-[var(--color-gris-200)] focus:outline-none transition-colors">
                  <NotificationIcon width={20} height={20} fill="var(--color-gris-700)" />
                </button>

                <div className="relative">
                  <button onClick={() => setUserMenuOpen(v => !v)} className="p-1 rounded-full bg-[var(--color-primary)] focus:outline-none hover:bg-[var(--color-primary-dark)] transition-colors">
                    <UsuarioIcon width={28} height={28} fill="white" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-[var(--color-fondo-blanco)] rounded-lg z-50">
                      <button onClick={handleLogout} className="w-full text-left px-4 py-3 hover:bg-[var(--color-gris-100)] text-[var(--color-gris-800)] flex items-center gap-2 transition-colors rounded-lg">
                        <CerrarLogo width={16} height={16} fill="currentColor" />
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
        {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />}
        {/* Zona central (contenido) */}
        <main className="flex-1 flex flex-col min-h-screen bg-[var(--color-fondo-casi-blanco)]">
          <div className="w-full max-w-6xl mx-auto mt-0 px-4 py-4 transform -translate-y-4">
            {/* Render central content with animations based on selected section */}
            <AnimatedSection sectionId={activeSection} direction="up">
              {activeSection === 'nueva-hoja' && <NuevaHojaRuta />}
              {activeSection === 'registros' && <RegistrosPage onHojaSelected={handleHojaSelected} />}
              {activeSection === 'hoja-detalle' && selectedHoja && (
                <HojaRutaDetalleView 
                  hoja={selectedHoja} 
                  onBack={handleBackToRegistros}
                />
              )}
              {activeSection === 'historial' && <HistorialPage />}
              {activeSection === 'notificaciones' && <NotificacionesPage />}
              {activeSection === 'enviar' && <EnviarPage />}
              {activeSection === 'gestion-envios' && <GestionEnvios />}
              {activeSection === 'inicio' && <ModernDashboard onNavigate={setActiveSection} />}
            </AnimatedSection>
          </div>
        </main>
        {/* Footer institucional */}
        <footer className="h-14 flex items-center justify-center bg-[var(--color-fondo-blanco)] text-sm text-[var(--color-gris-600)] font-medium animate-fade-in tracking-wide">
          Sistema SEDEGES La Paz &copy; 2025
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;

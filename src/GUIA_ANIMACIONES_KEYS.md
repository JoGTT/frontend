/**
 * GUÍA: Solucionar problema de animaciones en cambio de sección con Keys en React
 * 
 * PROBLEMA:
 * Cuando cambias de sección en React, los componentes a veces reutilizan el nodo del DOM
 * en lugar de crear uno nuevo. Esto evita que las animaciones de entrada se ejecuten.
 * 
 * SOLUCIÓN:
 * Usar la prop `key` con un ID único que cambie cuando cambias de sección.
 * Esto obliga a React a destruir el componente anterior y crear uno nuevo.
 */

// ANTES (Sin keys - animaciones no funcionan al cambiar sección):
export const DashboardLayoutBefore = () => {
  const [activeSection, setActiveSection] = useState('inicio');

  return (
    <main>
      {activeSection === 'historial' && <HistorialPage />}
      {activeSection === 'notificaciones' && <NotificacionesPage />}
      {activeSection === 'registros' && <RegistrosPage />}
    </main>
  );
};

// DESPUÉS (Con keys - animaciones funcionan correctamente):
export const DashboardLayoutAfter = () => {
  const [activeSection, setActiveSection] = useState('inicio');

  return (
    <main>
      {/* Usando la sección como key - obliga a React a remontaje el componente */}
      {activeSection === 'historial' && <HistorialPage key="historial" />}
      {activeSection === 'notificaciones' && <NotificacionesPage key="notificaciones" />}
      {activeSection === 'registros' && <RegistrosPage key="registros" />}
    </main>
  );
};

// APLICAR EN TUS COMPONENTES:
// En DashboardLayout.tsx, actualiza el main como sigue:

/*
<main className="flex-1 flex flex-col min-h-screen bg-[var(--color-fondo-casi-blanco)] animate-fade-in">
  <div className="w-full max-w-6xl mx-auto mt-0 px-4 py-4 transform -translate-y-4">
    {activeSection === 'nueva-hoja' && <NuevaHojaRuta key="nueva-hoja" />}
    {activeSection === 'registros' && <RegistrosPage key="registros" onHojaSelected={handleHojaSelected} />}
    {activeSection === 'hoja-detalle' && selectedHoja && (
      <HojaRutaDetalleView 
        key={`detalle-${selectedHoja.id}`}
        hoja={selectedHoja} 
        onBack={handleBackToRegistros}
      />
    )}
    {activeSection === 'historial' && <HistorialPage key="historial" />}
    {activeSection === 'notificaciones' && <NotificacionesPage key="notificaciones" />}
    {activeSection === 'enviar' && <EnviarPageReestructurado key="enviar" />}
    {activeSection === 'gestion-envios' && <GestionEnvios key="gestion-envios" />}
    {activeSection === 'inicio' && <ModernDashboard key="inicio" onNavigate={setActiveSection} />}
  </div>
</main>
*/

// ANIMACIONES CON FRAMER MOTION:
// Si quieres animaciones profesionales, usa Framer Motion:

import { motion } from 'framer-motion';

export const AnimatedSection = ({ children, section }: any) => {
  return (
    <motion.div
      key={section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

// USO:
/*
<main className="flex-1 flex flex-col min-h-screen bg-[var(--color-fondo-casi-blanco)]">
  <div className="w-full max-w-6xl mx-auto mt-0 px-4 py-4">
    <AnimatedSection section={activeSection}>
      {activeSection === 'nueva-hoja' && <NuevaHojaRuta />}
      {activeSection === 'registros' && <RegistrosPage onHojaSelected={handleHojaSelected} />}
      // ... resto de secciones
    </AnimatedSection>
  </div>
</main>
*/

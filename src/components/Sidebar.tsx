import React from "react";
import HamburgerMenu from "../assets/hamburgerMenu";
import sedegesLogo from "../assets/sedeges.png";
import UserIcon from "../assets/usario";
import AñadirIcon from "../assets/añadir";
import HistorialIcon from "../assets/historial";
import NotificacionIcon from "../assets/notification";
import EnviarIcon from "../assets/enviar";
import RegistrosIcon from "../assets/registros";

const Sidebar = ({ expanded, onEnter, onLeave, fixed, onFixToggle, onSelectSection, activeSection }: {
  expanded: boolean;
  onEnter: () => void;
  onLeave: () => void;
  fixed: boolean;
  onFixToggle: () => void;
  onSelectSection?: (id: string) => void;
  activeSection?: string;
}) => {
  // Función para generar el icono con color dinámico
  const renderIcon = (iconType: string, isActive: boolean) => {
    const color = isActive ? "#ffffff" : "#666666";
    const props = { width: 24, height: 24, fill: color };
    
    switch(iconType) {
      case 'inicio':
        return <UserIcon {...props} />;
      case 'nueva-hoja':
        return <AñadirIcon {...props} />;
      case 'enviar':
        return <EnviarIcon {...props} />;
      case 'gestion-envios':
        return <HistorialIcon {...props} />;
      case 'registros':
        return <RegistrosIcon {...props} />;
      case 'historial':
        return <HistorialIcon {...props} />;
      case 'notificaciones':
        return <NotificacionIcon {...props} />;
      default:
        return null;
    }
  };

  const menuItems = [
    { id: 'inicio', label: "Inicio" },
    { id: 'nueva-hoja', label: "Añadir" },
    { id: 'enviar', label: "Enviar" },
    { id: 'gestion-envios', label: "Gestión Envíos" },
    { id: 'registros', label: "Registros" },
    { id: 'historial', label: "Historial" },
    { id: 'notificaciones', label: "Notificaciones" },
  ];
  return (
    <aside
      className={`fixed left-0 top-0 h-screen flex flex-col bg-[var(--color-fondo-casi-blanco)] transition-all duration-300 z-40 ${
        expanded ? "w-64" : "w-20"
      }`}
    >
      {/* Inner wrapper with borders and rounded corners */}
      <div className={`h-full ${expanded ? 'p-4' : 'py-6 px-2'}`}>
        <div className={`h-full rounded-2xl flex flex-col transition-all duration-200 bg-[var(--color-fondo-blanco)] border border-[var(--color-gris-300)]`}>
          
          {/* Header con hamburger y logo */}
          <div className="flex items-center justify-center p-4 pb-2 relative">
            {/* Hamburger Menu - Centrado */}
            <button
              onClick={onFixToggle}
              className="p-2 hover:bg-[var(--color-gris-100)] rounded-lg transition-colors flex items-center justify-center"
              aria-label={expanded ? "Collapse menu" : "Expand menu"}
            >
              <HamburgerMenu 
                isOpen={expanded} 
                width={24} 
                height={24} 
                color="var(--color-gris-800)"
              />
            </button>
          </div>

          {/* Logo grande cuando está expandido */}
          {expanded && (
            <div className="flex items-center justify-center py-2 px-4">
              <img
                src={sedegesLogo}
                alt="SEDEGES"
                className="w-20 h-20 rounded-full object-contain"
              />
            </div>
          )}

          {/* Divider */}
          <div className="px-4 my-2">
            <hr className="border-t border-[var(--color-gris-300)]" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-2 px-3 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectSection && onSelectSection(item.id)}
                className="relative w-full text-left transition-all duration-200"
              >
                <div className={`flex items-center justify-center px-3 py-3 rounded-xl transition-all duration-200 ${
                  activeSection === item.id 
                    ? 'bg-[var(--color-primary)] text-white shadow-sm' 
                    : 'text-[var(--color-gris-700)] hover:bg-[var(--color-gris-100)]'
                }`}>
                  <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                    {renderIcon(item.id, activeSection === item.id)}
                  </span>
                  {expanded && (
                    <span className="ml-3 text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.label}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </nav>

          {/* Footer con divider */}
          <div className="px-4 pb-4 pt-2">
            <hr className="border-t border-[var(--color-gris-300)]" />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

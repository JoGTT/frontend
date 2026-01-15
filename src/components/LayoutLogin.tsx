import React, { useState } from 'react';
import XLogo from '../assets/X';
import SedegesLogo from './SedegesLogo';

const menuOptions = [
  { label: 'Inicio', value: 'inicio' },
  { label: 'Soporte', value: 'soporte' },
];

const LayoutLogin: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-esmeralda-600 via-punzo-100 to-punzo-600">
      <div className="flex flex-1">
        {/* Menú lateral */}
        <aside
          className={`relative transition-all duration-300 bg-white shadow-lg border-r border-esmeralda-100 ${menuOpen ? 'w-56' : 'w-16'} flex flex-col`}
        >
          <button
            className="absolute top-4 left-4 z-10 p-2 rounded-lg bg-esmeralda-50 hover:bg-esmeralda-100 transition-all"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <span className="block">
              {menuOpen ? <XLogo width={28} height={28} fill="var(--color-punzo-600)" /> : <span>☰</span>}
            </span>
          </button>
          <div className={`mt-20 flex-1 flex flex-col items-center ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
            <SedegesLogo width={60} height={60} className="mb-6" />
            {menuOptions.map((opt) => (
              <button key={opt.value} className="mb-4 px-4 py-2 rounded-lg text-esmeralda-700 font-semibold hover:bg-esmeralda-50 w-full text-left transition-all">
                {opt.label}
              </button>
            ))}
          </div>
        </aside>
        {/* Main content */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-20 flex items-center justify-end px-8 bg-white border-b border-esmeralda-100 shadow-sm">
            <div className="flex items-center gap-6 text-sm text-esmeralda-700 font-semibold">
              <span>Hora: 12:00</span>
              <span>Fecha: 27/10/2025</span>
              <button className="px-3 py-1 rounded bg-punzo-600 text-white font-bold hover:bg-punzo-700 transition-all">Cerrar sesión</button>
            </div>
          </header>
          {/* Content (login form or children) */}
          <section className="flex-1 flex items-center justify-center bg-esmeralda-50">
            {children}
          </section>
          {/* Notificaciones/alertas */}
          <section className="h-32 flex items-center justify-center bg-punzo-50 border-t border-esmeralda-100">
            <span className="text-punzo-700 font-semibold">Notificaciones / alertas</span>
          </section>
          {/* Footer */}
          <footer className="h-12 flex items-center justify-center bg-white border-t border-esmeralda-100 text-xs text-esmeralda-700 font-semibold">
            Sistema SEDEGES La Paz &copy; 2025
          </footer>
        </main>
      </div>
    </div>
  );
};

export default LayoutLogin;

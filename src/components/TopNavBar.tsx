import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import sedegesLogo from '../assets/sedeges.png';
import UserIcon from '../assets/usario';
import AñadirIcon from '../assets/añadir';
import HistorialIcon from '../assets/historial';
import NotificacionIcon from '../assets/notification';
import EnviarIcon from '../assets/enviar';
import RegistrosIcon from '../assets/registros';
import HamburgerMenu from '../assets/hamburgerMenu';
import LupayIcon from '../assets/lupay';
import { useSearch } from '../contexts/SearchContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

interface TopNavBarProps {
  user: any;
  onSelectSection?: (id: string) => void;
  activeSection?: string;
  onUserMenu: () => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ user, onSelectSection, activeSection, onUserMenu }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { query, setQuery } = useSearch();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [alerts, setAlerts] = useState<{ id: number; mensaje: string; fecha: string; dias: number | null }[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);
  const dropdownHover = useRef(false);

  useEffect(() => {
    const loadAlerts = async () => {
      if (!token) return;
      try {
        const res = await axios.get(API_ENDPOINTS.HOJAS_RUTA, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];

        const computeDiasRestantes = (hoja: any) => {
          const fechaObjetivo = hoja.fecha_limite || hoja.fecha_limite_cumplimiento || hoja.fecha_cumplimiento;
          if (!fechaObjetivo) return null;
          const limite = new Date(fechaObjetivo);
          if (Number.isNaN(limite.getTime())) return null;
          const hoy = new Date();
          const msPorDia = 1000 * 60 * 60 * 24;
          const diff = Math.ceil((limite.setHours(0, 0, 0, 0) - hoy.setHours(0, 0, 0, 0)) / msPorDia);
          return diff;
        };

        const formatFecha = (value?: string) => {
          if (!value) return 'sin fecha';
          const d = new Date(value);
          if (Number.isNaN(d.getTime())) return 'sin fecha';
          return d.toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' });
        };

        const alertsBuild: { id: number; mensaje: string; fecha: string; dias: number | null }[] = [];
        data.forEach((h: any, idx: number) => {
          const dias = computeDiasRestantes(h);
          const fechaObjetivo = h.fecha_limite || h.fecha_limite_cumplimiento || h.fecha_cumplimiento;
          if (dias === null) return;

          // Mostrar vencidos solo por 3 días posteriores
          if (dias < 0 && dias >= -3) {
            alertsBuild.push({
              id: alertsBuild.length + 1,
              mensaje: `H.R. ${h.numero_hr || h.id} venció el ${formatFecha(fechaObjetivo)} (${Math.abs(dias)} día(s) atrás).`,
              fecha: new Date().toISOString(),
              dias,
            });
          } else if (dias >= 0 && dias <= 2) {
            alertsBuild.push({
              id: alertsBuild.length + 1,
              mensaje: `H.R. ${h.numero_hr || h.id} se vence el ${formatFecha(fechaObjetivo)} (quedan ${dias} día(s)).`,
              fecha: new Date().toISOString(),
              dias,
            });
          }
        });

        alertsBuild.sort((a, b) => (a.dias ?? 999) - (b.dias ?? 999));
        setAlerts(alertsBuild.slice(0, 8));
      } catch (err) {
        setAlerts([]);
      }
    };

    loadAlerts();
    const interval = setInterval(loadAlerts, 120000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      setSearchError('');
      try {
        const res = await axios.get(API_ENDPOINTS.HOJAS_RUTA, {
          params: { query },
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        const data = Array.isArray(res.data) ? res.data : res.data.hojas || res.data.data || [];
        if (!cancelled) {
          setSearchResults(data.slice(0, 5));
          setShowDropdown(true);
        }
      } catch (err) {
        if (!cancelled) {
          setSearchError('No se pudo buscar');
          setSearchResults([]);
          setShowDropdown(true);
        }
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, token]);

  const openDropdown = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    setShowDropdown(true);
  };

  const scheduleClose = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!dropdownHover.current) {
        setShowDropdown(false);
      }
    }, 120);
  };

  const displayName = user?.nombre_completo || user?.nombre || user?.usuario || 'Usuario';

  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: 'UserIcon' },
    { id: 'nueva-hoja', label: 'Nueva HR', icon: 'AñadirIcon' },
    { id: 'registros', label: 'Registros', icon: 'RegistrosIcon' },
    { id: 'progreso', label: 'Progreso', icon: 'HistorialIcon' },
    { id: 'historial', label: 'Historial', icon: 'NotificacionIcon' },
  ];

  const renderIcon = (iconType: string, isActive: boolean) => {
    const color = isActive ? '#f5c565' : 'var(--color-gris-400)';
    const props = { width: 20, height: 20, fill: color };

    switch (iconType) {
      case 'UserIcon':
        return <UserIcon {...props} />;
      case 'AñadirIcon':
        return <AñadirIcon {...props} />;
      case 'EnviarIcon':
        return <EnviarIcon {...props} />;
      case 'RegistrosIcon':
        return <RegistrosIcon {...props} />;
      case 'HistorialIcon':
        return <HistorialIcon {...props} />;
      case 'NotificacionIcon':
        return <NotificacionIcon {...props} />;
      default:
        return null;
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 px-5 md:px-8 flex items-center backdrop-blur-xl bg-gradient-to-r from-[#0c0e13]/95 via-[#11131a]/95 to-[#0c0e13]/95 border-b border-[rgba(168,144,112,0.22)] shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 min-w-max group focus:outline-none"
        >
          <img
            src={sedegesLogo}
            alt="SEDEGES"
            className="w-11 h-11 rounded-full object-contain ring-2 ring-[#e9e9e4]/60 transition-transform group-hover:scale-[1.03]"
          />
          <div className="hidden sm:flex flex-col leading-tight text-left">
            <span className="text-[#f5f5f1] font-bold text-sm tracking-wide">SEDEGES</span>
            <span className="text-[#a7a7a0] text-xs">Sistema Hojas Ruta</span>
          </div>
        </button>

        <div className="hidden lg:flex flex-1 justify-center gap-2 ml-6">
          {menuItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectSection?.(item.id);
                  setMobileMenuOpen(false);
                }}
                className="relative px-4 py-2.5 rounded-full text-sm font-semibold text-[#d9d9d3] hover:text-amber-200 transition-all duration-300 overflow-hidden group bg-transparent"
              >
                <span className="flex items-center gap-2">
                  {renderIcon(item.icon, active)}
                  <span className={active ? 'text-amber-200' : ''}>{item.label}</span>
                </span>
                <span
                  className={`absolute right-3 bottom-1 h-[3px] rounded-full transition-all duration-300 ease-out ${
                    active
                      ? 'bg-[#f5c565] w-16 opacity-100'
                      : 'bg-[#6a5f52] w-2 opacity-70 group-hover:w-10 group-hover:bg-[#f5c565]'
                  }`}
                  style={{ transformOrigin: 'left center' }}
                />
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <div className="relative">
            <button
              onClick={() => setShowAlerts((v) => !v)}
              className="w-11 h-11 rounded-full bg-[#1e1f24] border border-[#2f3036] flex items-center justify-center hover:border-[#a89070] transition"
              aria-label="Alertas de vencimiento"
            >
              <NotificacionIcon width={20} height={20} fill="#d9d9d3" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-[#0c0e13] text-[10px] font-bold rounded-full px-2 py-[2px]">
                  {alerts.length}
                </span>
              )}
            </button>

            {showAlerts && (
              <div className="absolute right-0 mt-2 w-80 bg-[#111218] border border-[#2f3036] rounded-2xl shadow-2xl z-50 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-[#f1f1ec]">Vencimientos</div>
                  <button className="text-[11px] text-[#9c9c95] hover:text-amber-200" onClick={() => setShowAlerts(false)}>Cerrar</button>
                </div>
                {alerts.length === 0 ? (
                  <div className="text-xs text-[#8f8f8a] py-2">Sin alertas críticas</div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {alerts.map((a) => (
                      <div key={a.id} className="rounded-xl border border-[rgba(255,255,255,0.06)] px-3 py-2 bg-[#1a1c22]">
                        <div className="text-sm text-[#f1f1ec]">{a.mensaje}</div>
                        <div className="text-[11px] text-[#9c9c95]">{new Date(a.fecha).toLocaleDateString('es-BO')}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="hidden sm:flex relative w-72" onMouseLeave={scheduleClose}>
            <form className="w-full" onSubmit={(e) => e.preventDefault()}>
              <div className="flex items-center gap-2 w-full bg-[#1e1f24] border border-[#2f3036] rounded-full px-3 py-2.5 shadow-inner">
                <LupayIcon width={18} height={18} fill="#8f8f8a" className="shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar H.R., referencia..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => {
                    if (query) openDropdown();
                  }}
                  onBlur={scheduleClose}
                  className="flex-1 bg-transparent text-[#f1f1ec] placeholder:text-[#8f8f8a] text-sm focus:outline-none"
                />
              </div>
            </form>
            {showDropdown && (
              <div
                className="absolute top-12 right-0 left-0 bg-[#111218] border border-[#2f3036] rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto"
                onMouseEnter={() => {
                  dropdownHover.current = true;
                  openDropdown();
                }}
                onMouseLeave={() => {
                  dropdownHover.current = false;
                  scheduleClose();
                }}
              >
                {searchLoading && <div className="px-4 py-3 text-[#c9c9c2] text-sm">Buscando...</div>}
                {searchError && !searchLoading && <div className="px-4 py-3 text-[#e58c7d] text-sm">{searchError}</div>}
                {!searchLoading && !searchError && searchResults.length === 0 && (
                  <div className="px-4 py-3 text-[#8f8f8a] text-sm">Sin resultados</div>
                )}
                {!searchLoading &&
                  searchResults.map((item) => (
                    <div
                      key={item.id}
                      className="px-4 py-3 hover:bg-[#1d1f27] cursor-pointer flex items-start justify-between gap-3 border-b border-[#1f2026] last:border-none"
                      onClick={() => {
                        navigate(`/hoja/${item.id}`);
                        setShowDropdown(false);
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="text-[#f1f1ec] text-sm font-semibold">{item.numero_hr || 'H.R.'}</span>
                        <span className="text-[#c9c9c2] text-xs font-semibold uppercase tracking-wide">
                          {item.estado || item.estado_cumplimiento || '—'}
                        </span>
                        <span className="text-[#9c9c95] text-xs truncate max-w-[320px]">
                          {item.referencia || item.nombre_solicitante || ''}
                        </span>
                      </div>
                      <span className="text-[#a89070] text-xs font-semibold">Ver mini dash</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <button
            onClick={onUserMenu}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#1e1f24] border border-[#2f3036] hover:border-[#a89070] transition-colors"
          >
            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#a89070] to-[#6f6f6a] flex items-center justify-center text-white shadow-md">
              <UserIcon width={18} height={18} fill="white" />
            </span>
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[#f1f1ec] font-semibold text-xs">{displayName.split(' ')[0]}</span>
              <span className="text-[#9c9c95] text-xs">{user?.rol || 'Usuario'}</span>
            </div>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full bg-[#1e1f24] border border-[#2f3036] text-[#d9d9d3]"
            aria-label="Toggle menu"
          >
            <HamburgerMenu isOpen={mobileMenuOpen} width={22} height={22} color="#d9d9d3" />
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed top-20 left-0 right-0 bg-[#111218] border-b border-[#2f3036] z-40 lg:hidden shadow-2xl">
          <div className="flex flex-col gap-1 p-4 max-h-[calc(100vh-80px)] overflow-y-auto">
            {menuItems.map((item) => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectSection?.(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 w-full ${
                    active ? 'bg-[#2d2f38] text-amber-200' : 'text-[#d9d9d3] hover:bg-[#1d1f27]'
                  }`}
                >
                  {renderIcon(item.icon, active)}
                  <span className={active ? 'text-amber-200' : ''}>{item.label}</span>
                </button>
              );
            })}

            <div className="px-1 py-3 mt-1 border-t border-[#2f3036]">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="w-full flex items-center bg-[#1e1f24] border border-[#2f3036] rounded-full px-3 py-2 relative">
                  <LupayIcon width={16} height={16} fill="#8f8f8a" className="mr-2" />
                  <input
                    type="text"
                    placeholder="Buscar hoja..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 bg-transparent text-white placeholder:text-[#8f8f8a] text-sm focus:outline-none"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopNavBar;

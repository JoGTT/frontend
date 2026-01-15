import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useSearch } from '../contexts/SearchContext';
import { useNavigate } from 'react-router-dom';

interface HojaRuta {
  id: number;
  numero_hr: string;
  nombre_solicitante?: string;
  telefono_celular?: string;
  referencia: string;
  procedencia: string;
  fecha_documento?: string;
  fecha_ingreso: string;
  cite?: string;
  numero_fojas?: number;
  prioridad: string;
  estado: string;
  ubicacion_actual?: string;
  responsable_actual?: string;
}

interface RegistrosPageProps {
  onHojaSelected?: (hoja: HojaRuta) => void;
}

const RegistrosPage: React.FC<RegistrosPageProps> = ({ onHojaSelected }) => {
  const { token } = useAuth();
  const { query } = useSearch();
  const navigate = useNavigate();
  const [hojas, setHojas] = useState<HojaRuta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const prioridadBadge = (prioridad: string) => {
    const p = (prioridad || '').toLowerCase();
    const map: Record<string, { color: string; label: string }> = {
      urgente: { color: '#f78da7', label: 'Urgente' },
      prioritario: { color: '#7ab7ff', label: 'Prioritario' },
      rutinario: { color: '#7adfa1', label: 'Rutinario' },
      otros: { color: '#d1d1d6', label: 'Otros' }
    };

    const styles = map[p] || map.otros;

    return (
      <span className="inline-flex flex-col gap-1 text-xs font-semibold tracking-wide" style={{ color: styles.color }}>
        <span>{styles.label}</span>
        <span className="h-[2px] rounded-full" style={{ backgroundColor: styles.color, width: '38px' }}></span>
      </span>
    );
  };

  // Función para resaltar coincidencias de búsqueda
  const highlightMatch = (text: string | null, searchQuery: string) => {
    if (!text || !searchQuery) return text || '';
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <span key={index} className="bg-yellow-400 text-black px-1 rounded font-semibold">{part}</span> : 
        part
    );
  };

  // Verificar si la búsqueda coincide con un campo específico
  const isFieldMatch = (value: string | null, searchQuery: string) => {
    if (!value || !searchQuery) return false;
    return value.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const fetchHojas = async (search = '') => {
    setLoading(true);
    setError('');
    try {
      console.log('🔍 Buscando con query:', search);
      const res = await axios.get('http://localhost:3001/api/hojas-ruta', {
        params: search ? { query: search } : {},
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('📋 Resultados encontrados:', res.data.length);
      setHojas(res.data);
    } catch (err) {
      setError('Error al cargar hojas de ruta');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHojas(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const urgentes = hojas.filter((h) => (h.prioridad || '').toLowerCase().includes('urg'));
  const prioritarios = hojas.filter((h) => (h.prioridad || '').toLowerCase().includes('prior'));
  const rutinarios = hojas.filter((h) => (h.prioridad || '').toLowerCase().includes('ruti'));

  return (
    <div
      className="w-full min-h-screen px-4 sm:px-8 lg:px-12 py-8 bg-gradient-to-br from-[#0b1021] via-[#0f172a] to-[#0b0f1c]"
    >
      {loading ? (
        <div className="text-gray-300">Cargando...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : (
        <div
          className="rounded-3xl p-7 shadow-2xl border border-white/10 space-y-6"
          style={{ background: 'linear-gradient(145deg, rgba(20,23,32,0.9), rgba(12,13,18,0.94))' }}
        >
          {/* Hero */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs tracking-[0.16em] text-amber-200/80 uppercase">Dashboard</p>
              <h1 className="text-3xl font-extrabold text-amber-200 tracking-tight">Registros</h1>
              <div className="h-[3px] w-28 rounded-full bg-[linear-gradient(90deg,#f5c565,#7ab7ff)] mt-3"></div>
            </div>
            <div className="flex gap-3 flex-wrap">
              {[{ label: 'Urgentes', value: urgentes.length, color: '#f78da7' }, { label: 'Prioritarios', value: prioritarios.length, color: '#7ab7ff' }, { label: 'Rutinarios', value: rutinarios.length, color: '#7adfa1' }, { label: 'Total', value: hojas.length, color: '#caa76f' }].map((kpi) => (
                <div key={kpi.label} className="px-4 py-3 rounded-2xl border border-white/10 bg-white/5 min-w-[120px]">
                  <div className="text-xs text-white/60 uppercase tracking-[0.08em]">{kpi.label}</div>
                  <div className="text-2xl font-extrabold text-white">{kpi.value}</div>
                  <div className="h-[2px] w-12 rounded-full mt-2" style={{ background: kpi.color }}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Aviso de búsqueda */}
          {query && (
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <p className="text-sm text-white/80">Buscando: <span className="text-yellow-300 font-semibold">{query}</span></p>
                <p className="text-xs text-white/60">Campos: N° H.R., Referencia, Procedencia, Ubicación, Nombre, Teléfono</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white">{hojas.length}</div>
                <div className="text-xs text-white/60">resultados</div>
              </div>
            </div>
          )}

          {hojas.length === 0 ? (
            <div className="text-center py-12 text-white/70">Sin resultados</div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {hojas.map((hr) => (
                <div
                  key={hr.id}
                  className="rounded-2xl border border-white/10 bg-[rgba(18,20,28,0.9)] px-5 py-4 shadow-lg shadow-black/20 hover:border-white/20 transition"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-white/60">N° H.R.</p>
                        <p className="text-xl font-bold text-white">{hr.numero_hr}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-white/60">Referencia</p>
                        <p className="text-white font-semibold">{hr.referencia}</p>
                        <p className="text-xs text-white/50">{hr.procedencia}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-white/80">
                      <div>
                        <p className="text-xs text-white/50">Nombre</p>
                        <p>{hr.nombre_solicitante || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50">Teléfono</p>
                        <p>{hr.telefono_celular || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50">Fecha ingreso</p>
                        <p>{hr.fecha_ingreso?.slice(0, 10)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50">Estado</p>
                        <p className="capitalize">{hr.estado}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="inline-flex flex-col gap-1 text-xs font-semibold tracking-wide" style={{ color: prioridadBadge(hr.prioridad).props.style.color }}>
                        {prioridadBadge(hr.prioridad)}
                      </div>
                      <div className="inline-flex flex-col gap-1 text-xs font-semibold tracking-wide text-white/80">
                        <span>{hr.ubicacion_actual ? (hr.ubicacion_actual.toLowerCase().includes('sedeges') ? 'SEDEGES' : hr.ubicacion_actual.toUpperCase()) : 'Sin definir'}</span>
                        <span className="h-[2px] rounded-full" style={{ backgroundColor: '#caa76f', width: '48px' }}></span>
                      </div>
                      <button
                        onClick={() => {
                          if (onHojaSelected) {
                            onHojaSelected(hr);
                          } else {
                            navigate(`/hoja/${hr.id}`);
                          }
                        }}
                        className="text-white text-sm font-semibold relative group px-2"
                      >
                        <span>Ver Detalle</span>
                        <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-[linear-gradient(90deg,#7ab7ff,#caa76f)] opacity-80 group-hover:opacity-100 transition-opacity"></span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RegistrosPage;

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

interface RegistrosPageCleanProps {
  onHojaSelected?: (hoja: HojaRuta) => void;
}

const RegistrosPageClean: React.FC<RegistrosPageCleanProps> = ({ onHojaSelected }) => {
  const { token } = useAuth();
  const { query } = useSearch();
  const navigate = useNavigate();
  const [hojas, setHojas] = useState<HojaRuta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHojas = async (search = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:3001/api/hojas-ruta', {
        params: search ? { query: search } : {},
        headers: { Authorization: `Bearer ${token}` }
      });
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

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-10 py-8 bg-gradient-to-br from-[#0b1021] via-[#0f172a] to-[#0b0f1c] text-white">
      {loading ? (
        <div className="text-white/70">Cargando...</div>
      ) : error ? (
        <div className="text-red-300">{error}</div>
      ) : (
        <div className="rounded-2xl p-6 border border-white/10 bg-white/5 shadow-2xl shadow-black/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-amber-200/80">Dashboard</p>
              <h1 className="text-2xl font-bold text-amber-200">Registros</h1>
              <div className="h-[3px] w-24 rounded-full bg-[linear-gradient(90deg,#f5c565,#7ab7ff)] mt-2"></div>
            </div>
            <div className="text-right text-sm text-white/70">
              <div className="text-lg font-bold text-white">{hojas.length}</div>
              <div className="text-xs text-white/60">registros</div>
            </div>
          </div>

          {hojas.length === 0 ? (
            <div className="text-white/70">No se encontraron hojas de ruta.</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/20">
              <table className="w-full text-sm text-white/90">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-[0.08em] text-white/70">
                    <th className="p-3 text-left">N° H.R.</th>
                    <th className="p-3 text-left">Nombre</th>
                    <th className="p-3 text-left">Teléfono</th>
                    <th className="p-3 text-left">Referencia</th>
                    <th className="p-3 text-left">Procedencia</th>
                    <th className="p-3 text-left">Prioridad</th>
                    <th className="p-3 text-left">Ubicación Actual</th>
                    <th className="p-3 text-left">Estado</th>
                    <th className="p-3 text-left">Fecha Ingreso</th>
                    <th className="p-3 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {hojas.map((hr, idx) => (
                    <tr
                      key={hr.id}
                      className={`transition hover:bg-white/5 ${idx % 2 === 0 ? 'bg-white/0' : 'bg-white/2'} border-b border-white/10`}
                    >
                      <td className="p-3 font-mono text-white/90">{hr.numero_hr}</td>
                      <td className="p-3 text-white/90">{hr.nombre_solicitante || '-'}</td>
                      <td className="p-3 text-white/90">{hr.telefono_celular || '-'}</td>
                      <td className="p-3 text-white/90">{hr.referencia}</td>
                      <td className="p-3 text-white/90">{hr.procedencia}</td>
                      <td className="p-3 capitalize">
                        <span className="inline-flex flex-col gap-1 text-xs font-semibold tracking-wide" style={{ color: '#f5c565' }}>
                          <span>{(hr.prioridad || 'Otros').toUpperCase()}</span>
                          <span className="h-[2px] rounded-full" style={{ backgroundColor: '#f5c565', width: '38px' }}></span>
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border border-white/15 bg-white/5 text-white">
                          {hr.ubicacion_actual ? (hr.ubicacion_actual.toLowerCase().includes('sedeges') ? 'SEDEGES' : hr.ubicacion_actual.toUpperCase()) : 'Sin definir'}
                        </div>
                      </td>
                      <td className="p-3 capitalize text-white/80">{hr.estado}</td>
                      <td className="p-3 text-white/80">{hr.fecha_ingreso?.slice(0, 10)}</td>
                      <td className="p-3">
                        <button
                          onClick={() => {
                            if (onHojaSelected) {
                              onHojaSelected(hr);
                            } else {
                              navigate(`/hoja/${hr.id}`);
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 hover:shadow-lg transition"
                        >
                          Ver Detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RegistrosPageClean;

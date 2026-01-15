import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../config/api';
import VolverIcon from '../assets/anterior';

interface HojaRuta {
  id: number;
  numero_hr: string;
  nombre_solicitante: string;
  ubicacion_actual: string;
  estado_cumplimiento: string;
}

interface Destino {
  id: number | string;
  nombre: string;
  tipo: string;
}

interface CambioPendiente {
  id: string;
  hoja: HojaRuta;
  ubicacion_anterior: string;
  ubicacion_nueva: string;
  notas: string;
}

interface HistorialItem {
  id: number;
  desde: string;
  hacia: string;
  registrado_por: string;
  observaciones: string;
  fecha: string;
  numero_hr: string;
}

const ProgresoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  
  const [hojas, setHojas] = useState<HojaRuta[]>([]);
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  
  // Seleccion de hojas
  const [hojasSeleccionadas, setHojasSeleccionadas] = useState<HojaRuta[]>([]);
  
  // Formulario
  const [destinoActual, setDestinoActual] = useState('');
  const [notas, setNotas] = useState('');
  const [nuevoDestino, setNuevoDestino] = useState('');
  const [customDestinos, setCustomDestinos] = useState<string[]>([]);
  
  // Cambios pendientes (panel lateral)
  const [cambiosPendientes, setCambiosPendientes] = useState<CambioPendiente[]>([]);
  
  // Historial modal
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [hojaHistorial, setHojaHistorial] = useState<HojaRuta | null>(null);

  // Busqueda con debounce en servidor (como TopNav)
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (token) {
      cargarDatos();
    }
  }, [token]);

  useEffect(() => {
    const preselectId = (location.state as any)?.preselectHojaId;
    if (preselectId && hojas.length > 0) {
      const encontrada = hojas.find((h) => h.id === preselectId);
      if (encontrada) {
        setHojasSeleccionadas([encontrada]);
      }
    }
  }, [location.state, hojas]);

  // Busqueda en servidor cuando hay query
  useEffect(() => {
    if (!busqueda || busqueda.length < 2) {
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await axios.get(API_ENDPOINTS.HOJAS_RUTA, {
          params: { query: busqueda },
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        const data = Array.isArray(res.data) ? res.data : res.data.hojas || res.data.data || [];
        if (!cancelled) {
          setHojas(data);
        }
      } catch (err) {
        console.error('Error buscando:', err);
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [busqueda, token]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const hojesRes = await axios.get(API_ENDPOINTS.HOJAS_RUTA, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (hojesRes.data.success) {
        setHojas(hojesRes.data.hojas || []);
      }

      // Cargar locaciones
      const destinosAplanados: Destino[] = [];
      try {
        const res = await axios.get(API_ENDPOINTS.LOCACIONES);
        const payload = res.data?.flat || res.data?.locaciones || res.data || [];
        
        if (Array.isArray(payload)) {
          payload.forEach((d: any) => destinosAplanados.push({ ...d, tipo: d.tipo || 'centro_acogida' }));
        } else if (payload && typeof payload === 'object') {
          Object.keys(payload).forEach((cat) => {
            const items = payload[cat];
            if (Array.isArray(items)) {
              items.forEach((d: any) => destinosAplanados.push({ ...d, tipo: d.tipo || cat }));
            }
          });
        }
      } catch (err) {
        console.warn('No se pudieron obtener locaciones', err);
      }

      setDestinos(destinosAplanados);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  // Si no hay busqueda, mostrar todas las hojas cargadas
  const hojasFiltradas = hojas;

  const destinosOrdenados = useMemo(() => {
    const base = [...destinos];
    const tieneSedeges = base.some((d) => (d.nombre || '').toLowerCase().includes('sedeges'));
    if (!tieneSedeges) {
      base.unshift({ id: 'sedeges-default', nombre: 'SEDEGES - Sede Central', tipo: 'sede' });
    }
    const personalizados = customDestinos.map((nombre) => ({ id: `custom-${nombre}`, nombre, tipo: 'personalizado' }));
    return [...base, ...personalizados];
  }, [destinos, customDestinos]);

  const toggleSeleccionHoja = (hoja: HojaRuta) => {
    const existe = hojasSeleccionadas.find(h => h.id === hoja.id);
    if (existe) {
      setHojasSeleccionadas(hojasSeleccionadas.filter(h => h.id !== hoja.id));
    } else {
      setHojasSeleccionadas([...hojasSeleccionadas, hoja]);
    }
  };

  const agregarCambioPendiente = () => {
    if (hojasSeleccionadas.length === 0) {
      toast.warning('Selecciona al menos una hoja de ruta');
      return;
    }
    if (!destinoActual) {
      toast.warning('Selecciona la nueva ubicacion');
      return;
    }

    const nuevosCambios: CambioPendiente[] = hojasSeleccionadas.map(hoja => ({
      id: `${hoja.id}-${Date.now()}-${Math.random()}`,
      hoja,
      ubicacion_anterior: hoja.ubicacion_actual,
      ubicacion_nueva: destinoActual,
      notas: notas
    }));

    setCambiosPendientes([...cambiosPendientes, ...nuevosCambios]);
    setHojasSeleccionadas([]);
    setDestinoActual('');
    setNotas('');
    toast.info(`${nuevosCambios.length} cambio(s) agregado(s) a pendientes`);
  };

  const quitarCambioPendiente = (id: string) => {
    setCambiosPendientes(cambiosPendientes.filter(c => c.id !== id));
  };

  const confirmarTodosCambios = async () => {
    if (cambiosPendientes.length === 0) {
      toast.warning('No hay cambios pendientes para confirmar');
      return;
    }

    setGuardando(true);
    try {
      const hojasData = cambiosPendientes.map(cambio => ({
        hoja_ruta_id: cambio.hoja.id,
        ubicacion_anterior: cambio.ubicacion_anterior,
        ubicacion_actual: cambio.ubicacion_nueva,
        notas: cambio.notas
      }));

      const response = await axios.post(
        API_ENDPOINTS.PROGRESO_ADD_MULTIPLE,
        { hojas: hojasData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        toast.success(`${cambiosPendientes.length} progreso(s) registrado(s) correctamente`);
        setCambiosPendientes([]);
        cargarDatos();
      } else {
        const msg = response.data?.message || 'No se pudo registrar el progreso';
        const errores = response.data?.errores?.length ? ` Errores: ${response.data.errores.length}` : '';
        toast.error(msg + errores);
      }
    } catch (error) {
      console.error('Error:', error);
      const msg = (error as any)?.response?.data?.message || 'Error al registrar progresos';
      toast.error(msg);
    } finally {
      setGuardando(false);
    }
  };

  const agregarCustomDestino = (nombre: string) => {
    const limpio = nombre.trim();
    if (!limpio) return;
    if (!customDestinos.includes(limpio)) {
      setCustomDestinos([...customDestinos, limpio]);
    }
    setDestinoActual(limpio);
    setNuevoDestino('');
  };

  const verHistorial = async (hoja: HojaRuta) => {
    try {
      const response = await axios.get(
        API_ENDPOINTS.PROGRESO_HISTORIAL(hoja.id),
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setHistorial(response.data.historial || []);
        setHojaHistorial(hoja);
        setMostrarHistorial(true);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar historial');
    }
  };

  const eliminarRegistroHistorial = async (progresoId: number) => {
    if (!confirm('Eliminar este registro de progreso?')) return;
    
    try {
      await axios.delete(
        `${API_ENDPOINTS.PROGRESO_ADD}/${progresoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Registro eliminado');
      if (hojaHistorial) {
        verHistorial(hojaHistorial);
      }
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar registro');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1021] via-[#0f172a] to-[#0b0f1c]">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-white bg-gradient-to-br from-[#0b1021] via-[#0f172a] to-[#0b0f1c]">
      <style>{`
        @keyframes slideInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-slideInDown { animation: slideInDown 0.3s ease-out; }
        .animate-slideInUp { animation: slideInUp 0.3s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        input, textarea, select { background: rgba(255,255,255,0.03) !important; border: 1px solid rgba(255,255,255,0.08) !important; border-radius: 8px; padding: 10px 12px; transition: border 0.2s ease, box-shadow 0.2s ease; color: #fff; width: 100%; }
        select option { background: #0f172a; color: #f8fafc; }
        input::placeholder, textarea::placeholder { color: #64748b; }
        input:focus, textarea:focus, select:focus { outline: none !important; border: 1px solid #f5c565 !important; box-shadow: 0 0 0 2px rgba(245,197,101,0.15); }
        .list-item { border: 1px solid rgba(255,255,255,0.06); padding: 12px; border-radius: 10px; background: rgba(255,255,255,0.02); transition: all 0.2s; }
        .list-item:hover { border-color: rgba(245,197,101,0.4); }
        .list-item.selected { border-color: #f5c565; background: rgba(245,197,101,0.08); }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 animate-slideInDown">
          <button onClick={() => navigate('/dashboard')} className="flex items-center text-slate-300 hover:text-white font-medium">
            <VolverIcon width={18} height={18} className="mr-2" fill="currentColor" />
            Volver
          </button>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-amber-200/70">Flujo operativo</p>
            <h1 className="text-2xl font-bold text-white">Registro de Progreso</h1>
          </div>
          <div className="w-20"></div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Panel Izquierdo - Seleccion de hojas */}
          <div className="col-span-2 space-y-4 animate-slideInUp">
            {/* Busqueda */}
            <div>
              <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-2">Buscar Hojas de Ruta</label>
              <input
                type="text"
                placeholder="Numero HR, solicitante o ubicacion..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            {/* Lista de hojas */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Seleccionar Hojas</label>
                <span className="text-xs text-amber-200">{hojasSeleccionadas.length} seleccionada(s)</span>
              </div>
              <div className="max-h-52 overflow-y-auto bg-white/5 rounded-lg p-3 space-y-2 border border-white/10">
                {searchLoading ? (
                  <p className="text-slate-400 text-center py-4 text-sm">Buscando...</p>
                ) : hojasFiltradas.length === 0 ? (
                  <p className="text-slate-400 text-center py-4 text-sm">Sin resultados</p>
                ) : (
                  hojasFiltradas.map((hoja) => {
                    const seleccionada = hojasSeleccionadas.some(h => h.id === hoja.id);
                    return (
                      <div
                        key={hoja.id}
                        onClick={() => toggleSeleccionHoja(hoja)}
                        className={`list-item cursor-pointer flex justify-between items-center ${seleccionada ? 'selected' : ''}`}
                      >
                        <div>
                          <div className="font-bold text-sm text-white">{hoja.numero_hr}</div>
                          <div className="text-xs text-slate-400">{hoja.nombre_solicitante}</div>
                          <div className="text-xs text-amber-200/80 mt-1">{hoja.ubicacion_actual}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); verHistorial(hoja); }}
                            className="text-xs px-2 py-1 border border-slate-600 text-slate-300 hover:border-amber-300 hover:text-amber-200 rounded transition-all"
                          >
                            Historial
                          </button>
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${seleccionada ? 'border-amber-400 bg-amber-400' : 'border-slate-500'}`}>
                            {seleccionada && <span className="text-slate-900 text-xs font-bold">ok</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Formulario de nuevo progreso */}
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <h3 className="text-sm font-bold text-white mb-3 pb-2 border-b border-white/10">Agregar Progreso</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">Nueva Ubicacion</label>
                  <select value={destinoActual} onChange={(e) => setDestinoActual(e.target.value)}>
                    <option value="">Selecciona ubicacion...</option>
                    {destinosOrdenados.map((d) => (
                      <option key={d.id} value={d.nombre}>{d.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="O escribe ubicacion personalizada..."
                    value={nuevoDestino}
                    onChange={(e) => setNuevoDestino(e.target.value)}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => agregarCustomDestino(nuevoDestino)}
                    className="px-4 py-2 rounded-lg bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-all text-sm"
                  >
                    Agregar
                  </button>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">Notas (opcional)</label>
                  <textarea 
                    value={notas} 
                    onChange={(e) => setNotas(e.target.value)} 
                    rows={2} 
                    placeholder="Observaciones del movimiento..."
                  />
                </div>

                <button
                  type="button"
                  onClick={agregarCambioPendiente}
                  disabled={hojasSeleccionadas.length === 0 || !destinoActual}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-400 text-slate-900 font-bold rounded-lg transition-all"
                >
                  Agregar a Pendientes ({hojasSeleccionadas.length} hoja{hojasSeleccionadas.length !== 1 ? 's' : ''})
                </button>
              </div>
            </div>
          </div>

          {/* Panel Derecho - Cambios Pendientes */}
          <div className="animate-slideInUp">
            <div className="bg-white/5 rounded-lg border border-white/10 p-4 sticky top-6">
              <h3 className="text-sm font-bold text-amber-200 mb-3 pb-2 border-b border-amber-300/30">
                Cambios Pendientes
                {cambiosPendientes.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-amber-400 text-slate-900 rounded text-xs">{cambiosPendientes.length}</span>
                )}
              </h3>

              <div className="space-y-2 max-h-80 overflow-y-auto mb-4">
                {cambiosPendientes.length === 0 ? (
                  <p className="text-slate-500 text-center py-8 text-sm">
                    Sin cambios pendientes
                  </p>
                ) : (
                  cambiosPendientes.map((cambio) => (
                    <div key={cambio.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-xs text-white">{cambio.hoja.numero_hr}</span>
                        <button
                          onClick={() => quitarCambioPendiente(cambio.id)}
                          className="text-slate-500 hover:text-red-400 text-sm transition-colors"
                        >
                          x
                        </button>
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">De:</span>
                          <span className="text-slate-300">{cambio.ubicacion_anterior}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">A:</span>
                          <span className="text-amber-200 font-semibold">{cambio.ubicacion_nueva}</span>
                        </div>
                        {cambio.notas && (
                          <div className="text-slate-500 italic mt-1">{cambio.notas}</div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Boton Confirmar */}
              <button
                onClick={confirmarTodosCambios}
                disabled={cambiosPendientes.length === 0 || guardando}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white font-bold rounded-lg transition-all"
              >
                {guardando ? 'Guardando...' : `Confirmar ${cambiosPendientes.length} Cambio${cambiosPendientes.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Historial */}
        {mostrarHistorial && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-[#0d1426] border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col animate-slideInDown">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-bold text-white">Historial de Progreso</h3>
                  {hojaHistorial && (
                    <p className="text-sm text-amber-200">{hojaHistorial.numero_hr} - {hojaHistorial.nombre_solicitante}</p>
                  )}
                </div>
                <button
                  onClick={() => setMostrarHistorial(false)}
                  className="text-slate-400 hover:text-white text-xl px-2"
                >
                  x
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2">
                {historial.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">Sin registros de progreso</p>
                ) : (
                  historial.map((item, idx) => (
                    <div key={item.id} className="p-3 bg-white/5 rounded-lg border-l-2 border-amber-300/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs text-slate-500">{idx + 1}.</span>
                            <span className="text-sm text-slate-300">{item.desde}</span>
                            <span className="text-slate-600">--</span>
                            <span className="text-sm text-amber-200 font-semibold">{item.hacia}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>Por: {item.registrado_por}</span>
                            <span>{new Date(item.fecha).toLocaleString()}</span>
                          </div>
                          {item.observaciones && (
                            <p className="text-xs text-slate-400 mt-1 italic">{item.observaciones}</p>
                          )}
                        </div>
                        <button
                          onClick={() => eliminarRegistroHistorial(item.id)}
                          className="text-xs px-2 py-1 text-red-400 hover:bg-red-400/10 rounded transition-all"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => setMostrarHistorial(false)}
                className="mt-4 w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgresoPage;

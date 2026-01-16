import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import SendIcon from '../assets/send';
import CheckIcon from '../assets/Check';
import CirculoOnIcon from '../assets/circuloOn';
import CirculoOffIcon from '../assets/circuloOFF';
import HistorialIcon from '../assets/historial';

interface Envio {
  id: number;
  hoja_id?: number;
  destinatario_nombre: string;
  destinatario_email?: string;
  destinatario_telefono?: string;
  destino_id?: number;
  destino_nombre?: string;
  observaciones?: string;
  estado: string;
  fecha_envio?: string;
  fecha_recepcion?: string;
  created_at: string;
  numero_hr?: string;
  referencia?: string;
  usuario_nombre?: string;
}

const GestionEnvios: React.FC = () => {
  const { token } = useAuth();
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [expandedEnvio, setExpandedEnvio] = useState<number | null>(null);

  const estadosDisponibles = [
    { valor: 'registrado', nombre: 'Registrado', color: 'bg-[var(--color-gris-500)]', icon: CirculoOffIcon },
    { valor: 'enviado', nombre: 'Enviado', color: 'bg-[var(--color-primary)]', icon: SendIcon },
    { valor: 'entregado', nombre: 'Entregado', color: 'bg-[var(--color-success)]', icon: CheckIcon },
    { valor: 'cancelado', nombre: 'Cancelado', color: 'bg-[var(--color-error)]', icon: CirculoOnIcon }
  ];

  // Cargar envíos
  useEffect(() => {
    const fetchEnvios = async () => {
      if (!token) return;
      
      setLoading(true);
      try {
        const response = await axios.get(API_ENDPOINTS.ENVIAR, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEnvios(response.data.envios || []);
      } catch (err) {
        console.error('Error al cargar envíos:', err);
        setMessage('Error al cargar la lista de envíos');
      } finally {
        setLoading(false);
      }
    };

    fetchEnvios();
  }, [token]);

  // Actualizar estado de envío
  const actualizarEstado = async (envioId: number, nuevoEstado: string) => {
    if (!token) {
      setMessage('Error: No hay token de autenticación. Inicia sesión nuevamente.');
      return;
    }

    console.log('🔑 Token disponible:', token ? 'Sí' : 'No');
    console.log('📤 Actualizando envío:', envioId, 'a estado:', nuevoEstado);

    setUpdating(envioId);
    try {
      const payload: any = { estado: nuevoEstado };
      
      // Si se marca como recibido, agregar fecha de recepción
      if (nuevoEstado === 'recibido') {
        payload.fecha_entrega = new Date().toISOString();
      }

      console.log('📦 Payload a enviar:', payload);
      console.log('🌐 URL:', `http://localhost:3001/api/enviar/${envioId}/estado`);

      const response = await axios.put(
        `http://localhost:3001/api/enviar/${envioId}/estado`, 
        payload,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      console.log('✅ Respuesta del servidor:', response.data);

      if (response.data.success) {
        setMessage(`Envío marcado como ${nuevoEstado}`);
        
        // Actualizar la lista local
        setEnvios(prev => prev.map(envio => 
          envio.id === envioId 
            ? { ...envio, estado: nuevoEstado, fecha_recepcion: payload.fecha_entrega }
            : envio
        ));
      }
    } catch (err: any) {
      console.error('❌ Error completo:', err);
      console.error('❌ Respuesta del servidor:', err.response?.data);
      console.error('❌ Status:', err.response?.status);
      setMessage(err.response?.data?.error || 'Error al actualizar estado del envío');
    } finally {
      setUpdating(null);
    }
  };

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoInfo = (estado: string) => {
    return estadosDisponibles.find(e => e.valor === estado) || estadosDisponibles[0];
  };

  const enviosFiltrados = filtroEstado 
    ? envios.filter(e => e.estado === filtroEstado)
    : envios;

  return (
    <div className="p-8 text-[var(--color-gris-800)] min-h-screen bg-[var(--color-fondo-casi-blanco)]">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-[var(--color-primary)]">
            <HistorialIcon width={28} height={28} fill="white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[var(--color-gris-900)]">Gestión de Envíos</h1>
            <p className="text-[var(--color-gris-600)] text-lg">Administra y actualiza el estado de los envíos registrados</p>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mb-8 p-4 rounded-lg ${
          message.includes('Error') 
            ? 'bg-[var(--color-error)]/10 text-[var(--color-error)] border border-[var(--color-error)]/30' 
            : 'bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/30'
        }`}>
          <span className="font-medium">{message}</span>
        </div>
      )}

      {/* Filtros */}
      <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <label className="text-[var(--color-gris-700)] font-semibold">Filtrar por estado:</label>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="px-4 py-2 bg-[var(--color-gris-50)] rounded-lg text-[var(--color-gris-800)] font-medium"
        >
          <option value="">Todos los estados</option>
          {estadosDisponibles.map(estado => (
            <option key={estado.valor} value={estado.valor}>
              {estado.nombre}
            </option>
          ))}
        </select>
        <div className="text-[var(--color-gris-600)] font-medium">
          {enviosFiltrados.length} envío{enviosFiltrados.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="text-[var(--color-gris-500)] text-lg">Cargando envíos...</div>
        </div>
      )}

      {/* Lista de Envíos */}
      {!loading && (
        <div className="space-y-6">
          {enviosFiltrados.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-gris-500)]">
              {filtroEstado ? `No hay envíos con estado "${getEstadoInfo(filtroEstado).nombre}"` : 'No hay envíos registrados'}
            </div>
          ) : (
            enviosFiltrados.map((envio) => {
              const estadoInfo = getEstadoInfo(envio.estado);
              const IconComponent = estadoInfo.icon;
              
              return (
                <div key={envio.id} className="group bg-[var(--color-gris-50)] rounded-lg p-8 hover:bg-[var(--color-gris-100)] transition-colors cursor-pointer">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    {/* Información del Destinatario */}
                    <div>
                      <h4 className="font-bold text-[var(--color-gris-900)] mb-3">Destinatario</h4>
                      <div className="text-[var(--color-gris-800)] font-semibold">{envio.destinatario_nombre}</div>
                      {envio.destinatario_email && (
                        <div className="text-sm text-[var(--color-gris-600)] mt-1">{envio.destinatario_email}</div>
                      )}
                      {envio.destinatario_telefono && (
                        <div className="text-sm text-[var(--color-gris-600)] mt-1">{envio.destinatario_telefono}</div>
                      )}
                    </div>

                    {/* Información del Envío */}
                    <div>
                      <h4 className="font-bold text-[var(--color-gris-900)] mb-3">Detalles del Envío</h4>
                      {envio.destino_nombre && (
                        <div className="text-sm text-[var(--color-gris-700)] mb-2">
                          <strong>Destino:</strong> {envio.destino_nombre}
                        </div>
                      )}
                      {envio.numero_hr && (
                        <div className="text-sm text-[var(--color-gris-700)] mb-2">
                          <strong>H.R.:</strong> {envio.numero_hr}
                          {envio.referencia && ` - ${envio.referencia}`}
                        </div>
                      )}
                      <div className="text-sm text-[var(--color-gris-600)]">
                        <strong>Creado:</strong> {formatearFecha(envio.created_at)}
                      </div>
                    </div>

                    {/* Estado Actual */}
                    <div>
                      <h4 className="font-bold text-[var(--color-gris-900)] mb-3">Estado</h4>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold ${estadoInfo.color}`}>
                        <IconComponent width={18} height={18} fill="white" />
                        {estadoInfo.nombre}
                      </div>
                      {envio.fecha_envio && (
                        <div className="text-xs text-[var(--color-gris-600)] mt-3">
                          Enviado: {formatearFecha(envio.fecha_envio)}
                        </div>
                      )}
                      {envio.fecha_recepcion && (
                        <div className="text-xs text-[var(--color-gris-600)] mt-1">
                          Recibido: {formatearFecha(envio.fecha_recepcion)}
                        </div>
                      )}
                    </div>

                    {/* Acciones */}
                    <div>
                      <h4 className="font-bold text-[var(--color-gris-900)] mb-3">Acciones</h4>
                      <button
                        onClick={() => setExpandedEnvio(expandedEnvio === envio.id ? null : envio.id)}
                        className="flex items-center gap-2 text-[var(--color-gris-700)] font-semibold hover:text-[var(--color-primary)] transition-colors"
                      >
                        <span>Cambiar estado</span>
                        <span className={`transition-transform ${expandedEnvio === envio.id ? 'rotate-180' : ''}`}>▼</span>
                      </button>
                      
                      {expandedEnvio === envio.id && (
                        <div className="mt-4 space-y-2">
                          {estadosDisponibles
                            .filter(estado => estado.valor !== envio.estado)
                            .map(estado => {
                              const IconComp = estado.icon;
                              const isUpdating = updating === envio.id;
                              return (
                                <button
                                  key={estado.valor}
                                  onClick={() => {
                                    actualizarEstado(envio.id, estado.valor);
                                  }}
                                  disabled={isUpdating}
                                  className={`w-full p-3 text-sm font-semibold inline-flex items-center gap-2 justify-center transition-all ${
                                    isUpdating
                                      ? 'bg-[var(--color-gris-100)] text-[var(--color-gris-400)] cursor-not-allowed opacity-50'
                                      : 'bg-[var(--color-gris-50)] hover:bg-[var(--color-gris-100)] text-[var(--color-gris-900)]'
                                  }`}
                                >
                                  <IconComp width={16} height={16} fill={isUpdating ? 'var(--color-gris-400)' : 'var(--color-gris-700)'} />
                                  {isUpdating ? 'Actualizando...' : `Marcar como ${estado.nombre}`}
                                </button>
                              );
                            })
                          }
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Observaciones */}
                  {envio.observaciones && (
                    <div className="mt-6 pt-6">
                      <h5 className="font-bold text-[var(--color-gris-900)] mb-3">Observaciones</h5>
                      <div className="text-[var(--color-gris-700)] text-sm">{envio.observaciones}</div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default GestionEnvios;
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import HojaRutaPreview from './HojaRutaPreview';

import SendIcon from '../assets/send';
import CheckIcon from '../assets/Check';
import CirculoOnIcon from '../assets/circuloOn';
import CirculoOffIcon from '../assets/circuloOFF';
import GuardarOnIcon from '../assets/guardaron';
import HistorialIcon from '../assets/historial';
import DescargarIcon from '../assets/descargar';
import RelojIcon from '../assets/reloj';
import CronometroIcon from '../assets/cronometro';
import ArchivoIcon from '../assets/archivo';
import LupayIcon from '../assets/lupay';
import EditarIcon from '../assets/editar';
import PdfIcon from '../assets/pdf';
import ProgresoIcon from '../assets/tareas';
import VolverIcon from '../assets/anterior';

interface HojaRutaDetalleViewProps {
  hoja: any;
  onBack: () => void;
}

interface HistorialItem {
  id: number;
  desde: string;
  hacia: string;
  registrado_por?: string;
  username?: string;
  observaciones?: string;
  fecha: string;
}

const HojaRutaDetalleViewNuevo: React.FC<HojaRutaDetalleViewProps> = ({ hoja, onBack }) => {
  const navigate = useNavigate();
  const { token, canEdit, user } = useAuth();

  const [hojaCompleta, setHojaCompleta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [historialProgreso, setHistorialProgreso] = useState<HistorialItem[]>([]);
  const [historialError, setHistorialError] = useState('');
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  const [actualizandoEstado, setActualizandoEstado] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUbicacionModal, setShowUbicacionModal] = useState(false);
  const [showProgresoModal, setShowProgresoModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [showFinalizarModal, setShowFinalizarModal] = useState(false);

  const [formEdicion, setFormEdicion] = useState({
    numero_hr: '',
    nombre_solicitante: '',
    referencia: '',
    procedencia: '',
    prioridad: 'rutinario',
    fecha_limite: '',
    fecha_ingreso: '',
    cite: '',
    numero_fojas: '',
    observaciones: ''
  });

  const [destinosEditables, setDestinosEditables] = useState<string[]>([]);
  const [destinoNuevo, setDestinoNuevo] = useState('');

  const [passwordSeguro, setPasswordSeguro] = useState('');
  const [passwordFinalizar, setPasswordFinalizar] = useState('');
  const [verificandoPassword, setVerificandoPassword] = useState(false);
  const [eliminandoHR, setEliminandoHR] = useState(false);
  const [estadoObjetivo, setEstadoObjetivo] = useState<'finalizar' | 'reabrir'>('finalizar');
  const [progresoAEliminar, setProgresoAEliminar] = useState<number | null>(null);
  const [showConfirmProgreso, setShowConfirmProgreso] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHojaCompleta();
  }, [hoja?.id, token]);

  useEffect(() => {
    if (hojaCompleta?.id) {
      fetchHistorialProgreso();
    }
  }, [hojaCompleta?.id]);

  useEffect(() => {
    if (showProgresoModal) {
      fetchHistorialProgreso();
    }
  }, [showProgresoModal]);

  const formatDate = (value?: string | null) => {
    if (!value) return 'N/A';
    return new Date(value).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const fetchHojaCompleta = async () => {
    if (!hoja?.id) {
      setError('No se proporcionó un ID válido de hoja de ruta');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await axios.get(API_ENDPOINTS.HOJAS_RUTA_DETALLE(Number(hoja.id)), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const payload = res.data?.hoja || res.data?.data || res.data;
      setHojaCompleta(payload);
      setDestinosEditables(Array.isArray(payload?.destinos) ? payload.destinos : []);
      setFormEdicion({
        numero_hr: payload?.numero_hr || '',
        nombre_solicitante: payload?.nombre_solicitante || '',
        referencia: payload?.referencia || '',
        procedencia: payload?.procedencia || '',
        prioridad: payload?.prioridad || 'rutinario',
        fecha_limite: payload?.fecha_limite ? payload.fecha_limite.split('T')[0] : '',
        fecha_ingreso: payload?.fecha_ingreso ? payload.fecha_ingreso.split('T')[0] : '',
        cite: payload?.cite || '',
        numero_fojas: payload?.numero_fojas?.toString() || '',
        observaciones: payload?.observaciones || ''
      });
    } catch (err: any) {
      const mensaje = err?.response?.data?.message || 'No se pudo cargar la hoja de ruta';
      setError(mensaje);
      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistorialProgreso = async () => {
    if (!hojaCompleta?.id) return;
    try {
      setCargandoHistorial(true);
      setHistorialError('');
      const res = await axios.get(API_ENDPOINTS.PROGRESO_HISTORIAL(hojaCompleta.id), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const payload = res.data?.historial || res.data?.data || [];
      setHistorialProgreso(Array.isArray(payload) ? payload : []);
    } catch (err: any) {
      const mensaje = err?.response?.data?.message || 'No se pudo cargar el historial';
      setHistorialError(mensaje);
    } finally {
      setCargandoHistorial(false);
    }
  };

  const verificarPasswordSesion = async (password: string) => {
    if (!user?.username) {
      toast.error('No se pudo validar la sesión');
      return false;
    }
    if (!password) {
      toast.warning('Ingresa la contraseña');
      return false;
    }
    try {
      setVerificandoPassword(true);
      await axios.post(API_ENDPOINTS.AUTH_LOGIN, {
        username: user.username,
        password
      });
      return true;
    } catch (err) {
      toast.error('Contraseña incorrecta');
      return false;
    } finally {
      setVerificandoPassword(false);
    }
  };

  const handleDescargarPDF = async () => {
    const element = printRef.current;
    if (!element || !hojaCompleta) return;

    try {
      const widthPx = 794; // ancho A4 en px a 96dpi aprox
      const dataUrl = await domtoimage.toPng(element, {
        quality: 0.98,
        width: widthPx,
        height: element.scrollHeight,
        bgcolor: '#ffffff'
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (element.scrollHeight * pageWidth) / widthPx;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(dataUrl, 'PNG', 0, position, pageWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 0, position, pageWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save(`hoja-ruta-${hojaCompleta.numero_hr || hojaCompleta.id}.pdf`);
      toast.success('PDF listo');
    } catch (err) {
      console.error(err);
      toast.error('Error al generar PDF');
    }
  };

  const aplicarEstado = async (destino: 'finalizada' | 'en_proceso') => {
    if (!hojaCompleta) return;
    const estadoBackend = destino === 'finalizada' ? 'completado' : 'en_proceso';

    try {
      setActualizandoEstado(true);
      await axios.patch(`${API_ENDPOINTS.HOJAS_RUTA}/${hojaCompleta.id}/estado`, {
        estado: destino,
        estado_cumplimiento: estadoBackend
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setHojaCompleta({ ...hojaCompleta, estado: destino, estado_cumplimiento: estadoBackend });
      toast.success(`Estado actualizado a ${destino === 'finalizada' ? 'Finalizada' : 'En Proceso'}`);
    } catch (err: any) {
      const mensaje = err?.response?.data?.message || 'No se pudo actualizar el estado';
      toast.error(mensaje);
    } finally {
      setActualizandoEstado(false);
    }
  };

  const cambiarUbicacion = async (ubicacion: string, responsable: string) => {
    if (!ubicacion || !responsable || !hojaCompleta) {
      toast.warning('Completa ubicación y responsable');
      return;
    }
    try {
      setActualizandoEstado(true);
      await axios.patch(`${API_ENDPOINTS.HOJAS_RUTA}/${hojaCompleta.id}/ubicacion`, {
        ubicacion_actual: ubicacion,
        responsable_actual: responsable
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHojaCompleta({ ...hojaCompleta, ubicacion_actual: ubicacion, responsable_actual: responsable });
      toast.success('Ubicación actualizada');
      setShowUbicacionModal(false);
      fetchHistorialProgreso();
    } catch (err: any) {
      const mensaje = err?.response?.data?.message || 'No se pudo cambiar la ubicación';
      toast.error(mensaje);
    } finally {
      setActualizandoEstado(false);
    }
  };

  const prepararBorradoProgreso = (progresoId: number) => {
    setProgresoAEliminar(progresoId);
    setShowConfirmProgreso(true);
  };

  const borrarProgreso = async () => {
    if (!progresoAEliminar) return;
    try {
      const baseProgreso = API_ENDPOINTS.PROGRESO_ADD.replace('/agregar', '');
      await axios.delete(`${baseProgreso}/${progresoAEliminar}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Progreso eliminado');
      fetchHistorialProgreso();
    } catch (err: any) {
      const mensaje = err?.response?.data?.message || 'No se pudo eliminar el progreso';
      toast.error(mensaje);
    } finally {
      setShowConfirmProgreso(false);
      setProgresoAEliminar(null);
    }
  };

  const guardarEdicion = async () => {
    if (!hojaCompleta) return;
    try {
      await axios.put(`${API_ENDPOINTS.HOJAS_RUTA}/${hojaCompleta.id}`, {
        ...formEdicion,
        numero_fojas: formEdicion.numero_fojas ? Number(formEdicion.numero_fojas) : null,
        destinos: destinosEditables
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Hoja de ruta actualizada');
      setShowEditModal(false);
      fetchHojaCompleta();
    } catch (err: any) {
      const mensaje = err?.response?.data?.message || 'No se pudo guardar';
      toast.error(mensaje);
    }
  };

  const confirmarReapertura = async () => {
    if (!hojaCompleta) return;
    const ok = await verificarPasswordSesion(passwordFinalizar);
    if (!ok) return;
    const estadoBackend = 'en_proceso';
    try {
      setActualizandoEstado(true);
      await axios.patch(`${API_ENDPOINTS.HOJAS_RUTA}/${hojaCompleta.id}/estado`, {
        estado: 'en_proceso',
        estado_cumplimiento: estadoBackend
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHojaCompleta({ ...hojaCompleta, estado: 'en_proceso', estado_cumplimiento: estadoBackend });
      toast.success('Estado cambiado a En Proceso');
      setShowFinalizarModal(false);
      setPasswordFinalizar('');
    } catch (err: any) {
      const mensaje = err?.response?.data?.message || 'No se pudo cambiar estado';
      toast.error(mensaje);
    } finally {
      setActualizandoEstado(false);
    }
  };

  const confirmarFinalizar = async () => {
    await aplicarEstado('finalizada');
    setShowFinalizarModal(false);
  };

  const eliminarHojaRuta = async () => {
    if (!hojaCompleta) return;
    const ok = await verificarPasswordSesion(passwordSeguro);
    if (!ok) return;
    try {
      setEliminandoHR(true);
      await axios.delete(API_ENDPOINTS.HOJAS_RUTA_DETALLE(Number(hojaCompleta.id)), {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Hoja de ruta eliminada');
      setShowEliminarModal(false);
      onBack();
    } catch (err: any) {
      const mensaje = err?.response?.data?.message || 'El backend no permite eliminar esta hoja todavía';
      toast.error(mensaje);
    } finally {
      setEliminandoHR(false);
    }
  };

  const agregarDestino = () => {
    if (!destinoNuevo.trim()) return;
    setDestinosEditables([...destinosEditables, destinoNuevo.trim()]);
    setDestinoNuevo('');
  };

  const quitarDestino = (nombre: string) => {
    setDestinosEditables(destinosEditables.filter((d) => d !== nombre));
  };

  const irAProgreso = () => {
    if (!hojaCompleta) return;
    navigate('/progreso', {
      state: {
        preselectHojaId: hojaCompleta.id,
        preselectNumero: hojaCompleta.numero_hr,
        preselectNombre: hojaCompleta.nombre_solicitante,
        preselectUbicacion: hojaCompleta.ubicacion_actual
      }
    });
  };

  const ultimoMovimiento = historialProgreso[0];
  const ubicacionFinal = ultimoMovimiento?.hacia || hojaCompleta?.ubicacion_actual;
  const ultimaNota = ultimoMovimiento?.observaciones;
  const ultimaFecha = ultimoMovimiento?.fecha || hojaCompleta?.actualizado_en;
  const estadoEsFinalizada = (hojaCompleta?.estado || '').toLowerCase() === 'finalizada';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1021] via-[#0f172a] to-[#0b0f1c] text-white">
        <div className="text-lg tracking-wide">Cargando hoja de ruta...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0b1021] via-[#0f172a] to-[#0b0f1c] text-white flex flex-col items-center justify-center px-6">
        <p className="text-sm text-amber-200/80 mb-4">No pudimos cargar esta hoja de ruta</p>
        <div className="flex gap-3">
          <button onClick={onBack} className="px-4 py-2 rounded-full border border-white/20 hover:border-amber-300/60 text-sm transition-colors">Volver</button>
          <button onClick={fetchHojaCompleta} className="px-4 py-2 rounded-full bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 transition-colors">Reintentar</button>
        </div>
        <p className="mt-6 text-red-300 text-sm">{error}</p>
      </div>
    );
  }

  if (!hojaCompleta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1021] via-[#0f172a] to-[#0b0f1c] text-white">
        <div className="text-sm text-amber-200">Sin datos</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1021] via-[#0f172a] to-[#0b0f1c] text-white">
      <style>{`
        @keyframes cardPop { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes modalPop { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .card-fade { animation: cardPop 0.35s ease; }
        .modal-pop { animation: modalPop 0.3s ease; }
        .glass-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 18px; box-shadow: 0 15px 50px rgba(0,0,0,0.25); }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-7">
        <div className="flex items-start justify-between gap-4 card-fade">
          <div className="flex gap-4 items-start">
            <button onClick={onBack} className="px-4 py-2 rounded-full border border-white/20 hover:border-amber-300/60 text-sm text-amber-200 transition-colors">
              ← Volver a Registros
            </button>
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.18em] text-amber-200/70">Información general</p>
              <h1 className="text-4xl font-black leading-tight tracking-tight">{hojaCompleta.numero_hr}</h1>
              <p className="text-lg text-amber-200 font-semibold">{hojaCompleta.nombre_solicitante || hojaCompleta.referencia || 'Sin título'}</p>
              <div className="flex items-center gap-2 text-sm text-slate-100">
                <LupayIcon width={16} height={16} fill="#f5c565" />
                <span className="text-amber-200 font-semibold">Última ubicación:</span>
                <span>{ubicacionFinal || 'Sin ubicación registrada'}</span>
              </div>
              {ultimaNota && (
                <p className="text-xs text-slate-400">{ultimaNota}</p>
              )}
              <p className="text-[11px] text-slate-500">Actualizado {formatDate(ultimaFecha)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEstadoObjetivo(estadoEsFinalizada ? 'reabrir' : 'finalizar');
                setShowFinalizarModal(true);
              }}
              disabled={actualizandoEstado}
              className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 transition disabled:opacity-60"
            >
              {actualizandoEstado ? 'Guardando...' : estadoEsFinalizada ? 'Marcar En Proceso' : 'Marcar Finalizada'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 card-fade">
          {canEdit() && (
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/10 hover:border-amber-300/60 hover:bg-white/15 transition"
            >
              <EditarIcon width={18} height={18} fill="#f5c565" />
              <span className="text-sm font-semibold">Editar datos</span>
            </button>
          )}

          <button
            onClick={handleDescargarPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/10 hover:border-amber-300/60 hover:bg-white/15 transition"
          >
            <PdfIcon width={18} height={18} fill="#f5c565" />
            <span className="text-sm font-semibold">Descargar PDF</span>
          </button>

          <button
            onClick={irAProgreso}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/10 hover:border-amber-300/60 hover:bg-white/15 transition"
          >
            <ProgresoIcon width={18} height={18} fill="#f5c565" />
            <span className="text-sm font-semibold">Progreso</span>
          </button>

          <button
            onClick={() => setShowProgresoModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/10 hover:border-amber-300/60 hover:bg-white/15 transition"
          >
            <HistorialIcon width={18} height={18} fill="#f5c565" />
            <span className="text-sm font-semibold">Historial / Borrar</span>
          </button>

          <button
            onClick={() => setShowEliminarModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7b1113] border border-white/10 hover:border-amber-300/60 hover:bg-[#9a1619] transition text-white"
          >
            <VolverIcon width={16} height={16} fill="#f5c565" />
            <span className="text-sm font-semibold">Eliminar HR</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card card-fade">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-amber-200/70">Línea de tiempo</p>
                  <h3 className="text-xl font-bold">Movimientos y observaciones</h3>
                </div>
                <button
                  onClick={fetchHistorialProgreso}
                  className="text-xs px-3 py-1 rounded-full border border-amber-300/40 text-amber-200 hover:bg-amber-300/10 transition"
                >
                  Refrescar
                </button>
              </div>
              {cargandoHistorial ? (
                <div className="py-6 text-sm text-slate-300">Cargando historial...</div>
              ) : historialError ? (
                <div className="py-6 text-sm text-red-300">{historialError}</div>
              ) : historialProgreso.length === 0 ? (
                <div className="py-6 text-sm text-slate-400">Sin progreso registrado.</div>
              ) : (
                <div className="space-y-3">
                  {historialProgreso.slice(0, 8).map((item, idx) => (
                    <div key={item.id || idx} className="p-3 rounded-lg border border-white/10 bg-white/5">
                      <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                        <span>{formatDate(item.fecha)}</span>
                        <span className="text-amber-200/80">{item.registrado_por || item.username || 'Sistema'}</span>
                      </div>
                      <p className="text-sm font-semibold text-white">{item.desde ? `${item.desde} → ${item.hacia}` : item.hacia}</p>
                      <p className="text-xs text-amber-200 mt-1">{item.observaciones || 'Sin observaciones'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-card card-fade">
              <p className="text-[11px] uppercase tracking-[0.18em] text-amber-200/70 mb-2">Observaciones</p>
              <p className="text-sm leading-relaxed text-slate-100">{hojaCompleta.observaciones || 'Sin observaciones registradas.'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-card card-fade">
              <p className="text-[11px] uppercase tracking-[0.18em] text-amber-200/70 mb-2">Datos clave</p>
              <div className="space-y-2 text-sm text-slate-100">
                <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-300">Referencia</span><span className="font-semibold text-white ml-3 text-right">{hojaCompleta.referencia || 'Sin referencia'}</span></div>
                <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-300">Procedencia</span><span className="font-semibold text-white ml-3 text-right">{hojaCompleta.procedencia || 'No especificada'}</span></div>
                <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-300">Prioridad</span><span className="font-semibold text-white ml-3 text-right capitalize">{hojaCompleta.prioridad || 'normal'}</span></div>
                <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-300">Fecha límite</span><span className="font-semibold text-white ml-3 text-right">{hojaCompleta?.fecha_limite ? formatDate(hojaCompleta.fecha_limite) : 'No especificada'}</span></div>
                <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-300">Fecha ingreso</span><span className="font-semibold text-white ml-3 text-right">{hojaCompleta?.fecha_ingreso ? formatDate(hojaCompleta.fecha_ingreso) : 'Sin fecha'}</span></div>
                <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-300">CITE</span><span className="font-semibold text-white ml-3 text-right">{hojaCompleta.cite || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-slate-300">Fojas</span><span className="font-semibold text-white ml-3 text-right">{hojaCompleta.numero_fojas || 'Sin dato'}</span></div>
              </div>
            </div>

            <div className="glass-card card-fade">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-amber-200/70">Ubicación actual</p>
                <button
                  onClick={() => setShowUbicacionModal(true)}
                  className="text-xs px-3 py-1 rounded-full border border-amber-300/40 text-amber-200 hover:bg-amber-300/10 transition"
                  disabled={actualizandoEstado}
                >
                  {actualizandoEstado ? '...' : 'Cambiar'}
                </button>
              </div>
              <p className="text-lg font-semibold">{ubicacionFinal || 'Sin ubicación'}</p>
              <p className="text-sm text-slate-400">Responsable: {hojaCompleta.responsable_actual || 'No asignado'}</p>
              <p className="text-xs text-slate-500 mt-1">{estadoEsFinalizada ? 'Finalizada' : 'En proceso'}</p>
            </div>
          </div>
        </div>

        <div className="glass-card card-fade">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-amber-200/70">PDF</p>
              <h3 className="text-xl font-bold">Vista lista para imprimir</h3>
            </div>
            <button
              onClick={handleDescargarPDF}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-300/40 text-amber-200 hover:bg-amber-300/10 transition"
            >
              <DescargarIcon width={16} height={16} fill="#f5c565" />
              <span className="text-sm font-semibold">Descargar</span>
            </button>
          </div>
          <div
            className="rounded-xl overflow-hidden bg-white text-slate-900 shadow-2xl border border-white/10 mx-auto"
            style={{ width: '794px' }}
            ref={printRef}
          >
            {hojaCompleta && <HojaRutaPreview data={hojaCompleta} />}
          </div>
        </div>
      </div>

      {showProgresoModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d1324] text-white rounded-2xl shadow-2xl border border-white/10 max-w-3xl w-full p-6 modal-pop">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-amber-300/70">Progreso</p>
                <h3 className="text-xl font-bold">Historial y limpieza</h3>
                <p className="text-sm text-slate-200/80">Elimina registros incorrectos si hubo errores.</p>
              </div>
              <button onClick={() => setShowProgresoModal(false)} className="text-slate-300 hover:text-amber-200">✕</button>
            </div>

            {cargandoHistorial ? (
              <div className="py-4 text-sm text-slate-300">Cargando...</div>
            ) : historialProgreso.length === 0 ? (
              <div className="py-4 text-sm text-slate-300">Sin registros de progreso.</div>
            ) : (
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {historialProgreso.map((item) => (
                  <div key={item.id} className="p-3 border border-white/5 rounded-lg flex justify-between items-start bg-white/5">
                    <div className="text-sm">
                      <div className="flex gap-2 text-xs text-slate-300">
                        <span>{formatDate(item.fecha)}</span>
                        <span>•</span>
                        <span>{item.registrado_por || item.username || 'Sistema'}</span>
                      </div>
                      <p className="font-semibold text-white">{item.desde ? `${item.desde} → ${item.hacia}` : item.hacia}</p>
                      <p className="text-xs text-slate-200/80 mt-1">{item.observaciones || 'Sin observaciones'}</p>
                    </div>
                    <button
                      onClick={() => prepararBorradoProgreso(item.id)}
                      className="text-xs px-3 py-1 rounded-full border border-red-400/60 text-red-200 hover:bg-red-500/10 transition"
                    >
                      Borrar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showConfirmProgreso && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d1324] text-white rounded-2xl shadow-2xl border border-white/10 max-w-md w-full p-6 modal-pop">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-red-300/80">Confirmar</p>
                <h3 className="text-xl font-bold">Eliminar registro de progreso</h3>
                <p className="text-sm text-slate-200/80">Esta acción no se puede deshacer.</p>
              </div>
              <button onClick={() => { setShowConfirmProgreso(false); setProgresoAEliminar(null); }} className="text-slate-300 hover:text-amber-200">✕</button>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setShowConfirmProgreso(false); setProgresoAEliminar(null); }}
                className="px-4 py-2 rounded-lg border border-white/15 text-slate-200 hover:border-amber-300/60"
              >
                Cancelar
              </button>
              <button
                onClick={borrarProgreso}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-500"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {showUbicacionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d1324] text-white rounded-2xl shadow-2xl border border-white/10 max-w-xl w-full p-6 modal-pop">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-amber-300/70">Ubicación</p>
                <h3 className="text-xl font-bold">Actualizar ubicación actual</h3>
              </div>
              <button onClick={() => setShowUbicacionModal(false)} className="text-slate-300 hover:text-amber-200">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-amber-100">Nueva ubicación</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 border border-white/15 rounded-lg bg-white/5 text-white"
                  defaultValue={ubicacionFinal || ''}
                  id="ubicacionNueva"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-amber-100">Responsable</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 border border-white/15 rounded-lg bg-white/5 text-white"
                  defaultValue={hojaCompleta.responsable_actual || ''}
                  id="responsableNuevo"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowUbicacionModal(false)} className="px-4 py-2 rounded-lg border border-white/15 text-slate-200 hover:border-amber-300/60">Cancelar</button>
              <button
                onClick={() => {
                  const ubicacion = (document.getElementById('ubicacionNueva') as HTMLInputElement)?.value;
                  const responsable = (document.getElementById('responsableNuevo') as HTMLInputElement)?.value;
                  cambiarUbicacion(ubicacion, responsable);
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400"
                disabled={actualizandoEstado}
              >
                {actualizandoEstado ? 'Guardando...' : 'Actualizar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d1324] text-white rounded-2xl shadow-2xl border border-white/10 max-w-3xl w-full p-6 modal-pop">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-amber-300/70">Edición</p>
                <h3 className="text-xl font-bold">Editar hoja de ruta</h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-slate-300 hover:text-amber-200">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-amber-100">Número HR</label>
                <input value={formEdicion.numero_hr} onChange={(e) => setFormEdicion({ ...formEdicion, numero_hr: e.target.value })} className="w-full px-3 py-2 border border-white/15 rounded-lg bg-white/5 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-amber-100">Nombre</label>
                <input value={formEdicion.nombre_solicitante} onChange={(e) => setFormEdicion({ ...formEdicion, nombre_solicitante: e.target.value })} className="w-full px-3 py-2 border border-white/15 rounded-lg bg-white/5 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-amber-100">Referencia</label>
                <input value={formEdicion.referencia} onChange={(e) => setFormEdicion({ ...formEdicion, referencia: e.target.value })} className="w-full px-3 py-2 border border-white/15 rounded-lg bg-white/5 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-amber-100">Procedencia</label>
                <input value={formEdicion.procedencia} onChange={(e) => setFormEdicion({ ...formEdicion, procedencia: e.target.value })} className="w-full px-3 py-2 border border-white/15 rounded-lg bg-white/5 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-amber-100">Prioridad</label>
                <select value={formEdicion.prioridad} onChange={(e) => setFormEdicion({ ...formEdicion, prioridad: e.target.value })} className="w-full px-3 py-2 border border-white/15 rounded-lg bg-white/5 text-white">
                  <option value="rutinario">Rutinario</option>
                  <option value="prioritario">Prioritario</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-amber-100">Fecha límite</label>
                <input type="date" value={formEdicion.fecha_limite} onChange={(e) => setFormEdicion({ ...formEdicion, fecha_limite: e.target.value })} className="w-full px-3 py-2 border border-white/15 rounded-lg bg-white/5 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-amber-100">Fecha ingreso</label>
                <input type="date" value={formEdicion.fecha_ingreso} onChange={(e) => setFormEdicion({ ...formEdicion, fecha_ingreso: e.target.value })} className="w-full px-3 py-2 border border-white/15 rounded-lg bg-white/5 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-amber-100">CITE</label>
                <input value={formEdicion.cite} onChange={(e) => setFormEdicion({ ...formEdicion, cite: e.target.value })} className="w-full px-3 py-2 border border-white/15 rounded-lg bg-white/5 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-amber-100">Número de fojas</label>
                <input type="number" value={formEdicion.numero_fojas} onChange={(e) => setFormEdicion({ ...formEdicion, numero_fojas: e.target.value })} className="w-full px-3 py-2 border border-white/15 rounded-lg bg-white/5 text-white" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-amber-100">Observaciones</label>
                <textarea value={formEdicion.observaciones} onChange={(e) => setFormEdicion({ ...formEdicion, observaciones: e.target.value })} className="w-full px-3 py-2 border border-white/15 rounded-lg bg-white/5 text-white" rows={3} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-amber-100">Destinos / Instrucciones</label>
                <div className="flex gap-2">
                  <input
                    value={destinoNuevo}
                    onChange={(e) => setDestinoNuevo(e.target.value)}
                    placeholder="Añadir destino"
                    className="flex-1 px-3 py-2 border border-white/15 rounded-lg bg-white/5 text-white"
                  />
                  <button onClick={agregarDestino} className="px-3 py-2 rounded-lg bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400">Agregar</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {destinosEditables.length === 0 && <span className="text-xs text-slate-300">Sin destinos configurados</span>}
                  {destinosEditables.map((dest) => (
                    <span key={dest} className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-100 text-xs flex items-center gap-1 border border-amber-300/30">
                      {dest}
                      <button onClick={() => quitarDestino(dest)} className="text-red-200 font-bold">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-lg border border-white/15 text-slate-200 hover:border-amber-300/60">Cancelar</button>
              <button onClick={guardarEdicion} className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {showEliminarModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d1324] text-white rounded-2xl shadow-2xl border border-white/10 max-w-xl w-full p-6 modal-pop">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-red-300/80">Eliminar</p>
                <h3 className="text-xl font-bold text-red-200">Eliminar Hoja de Ruta</h3>
                <p className="text-sm text-slate-200/80">Escribe la contraseña del usuario <strong>{user?.username}</strong> para eliminar.</p>
              </div>
              <button onClick={() => setShowEliminarModal(false)} className="text-slate-300 hover:text-amber-200">✕</button>
            </div>
            <div className="space-y-3">
              <input
                type="password"
                value={passwordSeguro}
                onChange={(e) => setPasswordSeguro(e.target.value)}
                placeholder="Contraseña"
                className="w-full px-3 py-2 border border-white/15 rounded-lg bg-white/5 text-white"
              />
              <p className="text-xs text-slate-300">Esta acción es irreversible.</p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowEliminarModal(false)} className="px-4 py-2 rounded-lg border border-white/15 text-slate-200 hover:border-amber-300/60">Cancelar</button>
              <button
                onClick={eliminarHojaRuta}
                disabled={eliminandoHR || verificandoPassword}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-500 disabled:opacity-60"
              >
                {eliminandoHR ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showFinalizarModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d1324] text-white rounded-2xl shadow-2xl border border-white/10 max-w-xl w-full p-6 modal-pop">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-amber-300/70">Estado</p>
                <h3 className="text-xl font-bold">{estadoObjetivo === 'finalizar' ? 'Marcar como Finalizada' : 'Volver a En Proceso'}</h3>
                <p className="text-sm text-slate-200/80">
                  {estadoObjetivo === 'finalizar'
                    ? 'Al finalizar no se podrán añadir ni borrar progresos. Confirma que el expediente está cerrado.'
                    : 'Para reabrir se necesita la contraseña de la sesión actual.'}
                </p>
              </div>
              <button onClick={() => setShowFinalizarModal(false)} className="text-slate-300 hover:text-amber-200">✕</button>
            </div>

            {estadoObjetivo === 'reabrir' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-amber-100">Contraseña</label>
                <input
                  type="password"
                  value={passwordFinalizar}
                  onChange={(e) => setPasswordFinalizar(e.target.value)}
                  className="w-full px-3 py-2 border border-white/15 rounded-lg bg-white/5 text-white"
                  placeholder="Contraseña de la sesión"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowFinalizarModal(false)} className="px-4 py-2 rounded-lg border border-white/15 text-slate-200 hover:border-amber-300/60">Cancelar</button>
              <button
                onClick={estadoObjetivo === 'finalizar' ? confirmarFinalizar : confirmarReapertura}
                disabled={actualizandoEstado || verificandoPassword}
                className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 disabled:opacity-60"
              >
                {estadoObjetivo === 'finalizar' ? 'Finalizar' : 'Reabrir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HojaRutaDetalleViewNuevo;

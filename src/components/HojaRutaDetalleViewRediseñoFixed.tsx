import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import HojaRutaPreview from './HojaRutaPreview';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { toast } from 'react-toastify';

// Importar iconos SVG personalizados
import SendIcon from '../assets/send';
import CheckIcon from '../assets/Check';
import CirculoOnIcon from '../assets/circuloOn';
import CirculoOffIcon from '../assets/circuloOFF';
import GuardarOnIcon from '../assets/guardaron';
import DescargarIcon from '../assets/pdf';
import RelojIcon from '../assets/reloj';
import CronometroIcon from '../assets/cronometro';
import ArchivoIcon from '../assets/pdf';
import LupayIcon from '../assets/lupay';

interface HojaRutaDetalleViewProps {
  hoja: any;
  onBack: () => void;
}

const HojaRutaDetalleViewRediseño: React.FC<HojaRutaDetalleViewProps> = ({ hoja, onBack }) => {
  const { token } = useAuth();
  const [hojaCompleta, setHojaCompleta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actualizandoEstado, setActualizandoEstado] = useState(false);
  const [showUbicacionModal, setShowUbicacionModal] = useState(false);
  const [destinos, setDestinos] = useState<any[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  const estadosDisponibles = [
    { 
      valor: 'pendiente', 
      nombre: 'Pendiente', 
      color: 'bg-slate-500', 
      icon: CirculoOffIcon,
      descripcion: 'Documento recibido, esperando procesamiento'
    },
    { 
      valor: 'enviada', 
      nombre: 'Enviada', 
      color: 'bg-slate-700', 
      icon: SendIcon,
      descripcion: 'Documento enviado al área correspondiente'
    },
    { 
      valor: 'en_proceso', 
      nombre: 'En Proceso', 
      color: 'bg-blue-700', 
      icon: CirculoOnIcon,
      descripcion: 'Documento en proceso de trabajo'
    },
    { 
      valor: 'finalizada', 
      nombre: 'Finalizada', 
      color: 'bg-emerald-700', 
      icon: CheckIcon,
      descripcion: 'Proceso completado exitosamente'
    },
    { 
      valor: 'archivada', 
      nombre: 'Archivada', 
      color: 'bg-slate-600', 
      icon: ArchivoIcon,
      descripcion: 'Documento archivado permanentemente'
    }
  ];

  useEffect(() => {
    fetchHojaCompleta();
    fetchDestinos();
  }, [hoja?.id]);

  const fetchHojaCompleta = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/api/hojas-ruta/${hoja.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHojaCompleta(response.data);
    } catch (error) {
      console.error('Error al cargar hoja de ruta:', error);
      setError('Error al cargar los detalles de la hoja de ruta');
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/destinos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const destinosAplanados: any[] = [];
        Object.keys(response.data.destinos).forEach(categoria => {
          response.data.destinos[categoria].forEach((destino: any) => {
            destinosAplanados.push(destino);
          });
        });
        setDestinos(destinosAplanados);
      }
    } catch (error) {
      console.error('Error al cargar destinos:', error);
    }
  };

  const obtenerEstadoActual = () => {
    return estadosDisponibles.find(estado => estado.valor === hojaCompleta?.estado) || estadosDisponibles[0];
  };

  const cambiarEstado = async (nuevoEstado: string) => {
    if (!hojaCompleta || actualizandoEstado) return;
    
    setActualizandoEstado(true);
    try {
      await axios.patch(
        `http://localhost:3001/api/hojas-ruta/${hojaCompleta.id}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setHojaCompleta({ ...hojaCompleta, estado: nuevoEstado });
      toast.success(`Estado actualizado a: ${estadosDisponibles.find(e => e.valor === nuevoEstado)?.nombre}`);
      
    } catch (error: any) {
      console.error('Error al actualizar estado:', error);
      toast.error('Error al actualizar el estado');
    } finally {
      setActualizandoEstado(false);
    }
  };

  const cambiarUbicacion = async (nuevaUbicacion: string, responsable: string) => {
    if (!hojaCompleta) return;
    
    try {
      setActualizandoEstado(true);
      
      const response = await axios.patch(
        `http://localhost:3001/api/hojas-ruta/${hojaCompleta.id}/ubicacion`,
        { 
          ubicacion_actual: nuevaUbicacion,
          responsable_actual: responsable
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      setHojaCompleta({ 
        ...hojaCompleta, 
        ubicacion_actual: nuevaUbicacion, 
        responsable_actual: responsable 
      });
      
      toast.success(`Ubicación actualizada a: ${nuevaUbicacion}`);
      setShowUbicacionModal(false);
      
    } catch (error: any) {
      console.error('Error al cambiar ubicación:', error);
      toast.error('Error al cambiar ubicación');
    } finally {
      setActualizandoEstado(false);
    }
  };

  const handleDescargarPDF = async () => {
    if (!printRef.current) return;
    
    try {
      toast.info('Generando PDF...');
      const element = printRef.current;
      const dataUrl = await domtoimage.toPng(element, {
        quality: 0.95,
        width: element.scrollWidth,
        height: element.scrollHeight,
        bgcolor: '#ffffff'
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`hoja-ruta-${hojaCompleta.numero_hr}.pdf`);
      
      toast.success('PDF generado exitosamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      toast.error('Error al generar el PDF');
    }
  };

  const redirectToEnviar = () => {
    // Disparar evento para cambiar la sección activa
    window.dispatchEvent(new CustomEvent('navigateToSection', { 
      detail: { section: 'enviar', hojaId: hojaCompleta.id } 
    }));
  };

  const formatearFecha = (fecha: string) => {
    if (!fecha) return 'No especificada';
    try {
      return new Date(fecha).toLocaleDateString('es-ES');
    } catch {
      return 'No especificada';
    }
  };

  const calcularDiasTranscurridos = (fechaCreacion: string) => {
    if (!fechaCreacion) return 'N/A';
    try {
      const dias = Math.floor((new Date().getTime() - new Date(fechaCreacion).getTime()) / (1000 * 60 * 60 * 24));
      return dias;
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white text-lg">Cargando detalles...</div>
      </div>
    );
  }

  if (error || !hojaCompleta) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-red-400 text-lg">{error || 'Hoja de ruta no encontrada'}</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-6 text-white"
      style={{ background: 'var(--color-vino-oscuro)' }}
    >
      {/* Header con botón de regreso */}
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="mb-6 flex items-center gap-3 text-white/80 hover:text-white transition-colors"
        >
          <span className="text-2xl">←</span>
          <span className="text-lg font-medium">Volver a Registros</span>
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">H.R. {hojaCompleta.numero_hr}</h1>
            <p className="text-white/80 text-lg">{hojaCompleta.referencia}</p>
          </div>
          <div className="text-right text-white/60">
            <p>Creada: {formatearFecha(hojaCompleta.fecha_creacion)}</p>
            <p>Actualizada: {formatearFecha(hojaCompleta.fecha_actualizacion)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Columna Principal - Información y Estado */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Card de Estado Actual - Diseño Fijo */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Estado del Documento</h2>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white/70">Activo</span>
              </div>
            </div>

            {/* Estado Actual - DISEÑO FIJO */}
            <div className="bg-black/20 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-6 mb-4">
                <div className={`p-4 rounded-full ${obtenerEstadoActual().color} shadow-lg`}>
                  {React.createElement(obtenerEstadoActual().icon, { width: 32, height: 32, fill: "white" })}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    Estado Actual: {obtenerEstadoActual().nombre}
                  </h3>
                  <p className="text-white/70">{obtenerEstadoActual().descripcion}</p>
                </div>
              </div>

              {/* Ubicación Actual */}
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <LupayIcon width={20} height={20} fill="#60a5fa" />
                  <h4 className="font-medium text-white">Ubicación Actual</h4>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-white">{hojaCompleta.ubicacion_actual || 'No especificada'}</span>
                  </div>
                  <button
                    onClick={() => setShowUbicacionModal(true)}
                    className="text-blue-400 hover:text-blue-300 text-sm px-3 py-1 rounded-md bg-blue-500/20 transition-colors"
                  >
                    Cambiar
                  </button>
                </div>
                {hojaCompleta.responsable_actual && (
                  <p className="text-white/60 text-sm mt-2">
                    Responsable: {hojaCompleta.responsable_actual}
                  </p>
                )}
              </div>

              {/* Información del Tiempo */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white/60">Última Actualización</span>
                  <p className="text-white font-medium">
                    {formatearFecha(hojaCompleta.fecha_actualizacion)}
                  </p>
                </div>
                <div>
                  <span className="text-white/60">Días Transcurridos</span>
                  <p className="text-white font-medium">
                    {calcularDiasTranscurridos(hojaCompleta.fecha_creacion)}
                  </p>
                </div>
              </div>
            </div>

            {/* Acciones de Estado - POSICIONES FIJAS */}
            <div className="space-y-3">
              <h4 className="text-lg font-medium text-white mb-4">Cambiar Estado</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {estadosDisponibles.map((estado) => (
                  <button
                    key={estado.valor}
                    onClick={() => cambiarEstado(estado.valor)}
                    disabled={actualizandoEstado || estado.valor === hojaCompleta.estado}
                    className={`
                      relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200
                      ${estado.valor === hojaCompleta.estado 
                        ? `${estado.color} ring-2 ring-white/50 shadow-lg` 
                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }
                      ${actualizandoEstado ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    title={estado.descripcion}
                  >
                    <div className={`p-2 rounded-lg ${estado.valor === hojaCompleta.estado ? 'bg-white/20' : 'bg-white/10'}`}>
                      {React.createElement(estado.icon, { 
                        width: 20, 
                        height: 20, 
                        fill: estado.valor === hojaCompleta.estado ? "white" : "#94a3b8" 
                      })}
                    </div>
                    <span className={`text-xs font-medium ${
                      estado.valor === hojaCompleta.estado ? 'text-white' : 'text-white/70'
                    }`}>
                      {estado.nombre}
                    </span>
                    {estado.valor === hojaCompleta.estado && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card de Información del Documento */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <ArchivoIcon width={24} height={24} fill="#60a5fa" />
              Información del Documento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-white/70 text-sm">Número H.R.</label>
                  <p className="text-white font-medium text-lg">{hojaCompleta.numero_hr}</p>
                </div>
                <div>
                  <label className="text-white/70 text-sm">Referencia</label>
                  <p className="text-white">{hojaCompleta.referencia || 'Sin referencia'}</p>
                </div>
                <div>
                  <label className="text-white/70 text-sm">Procedencia</label>
                  <p className="text-white">{hojaCompleta.procedencia || 'No especificada'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-white/70 text-sm">Prioridad</label>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      hojaCompleta.prioridad === 'urgente' ? 'bg-red-500' :
                      hojaCompleta.prioridad === 'prioritario' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></div>
                    <p className="text-white capitalize">{hojaCompleta.prioridad || 'Normal'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-white/70 text-sm">Fecha Límite</label>
                  <p className="text-white">
                    {hojaCompleta.fecha_limite 
                      ? formatearFecha(hojaCompleta.fecha_limite)
                      : 'No especificada'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-white/70 text-sm">Número de Fojas</label>
                  <p className="text-white">{hojaCompleta.numero_fojas || 'No especificado'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Lateral - Acciones */}
        <div className="space-y-6">
          {/* Card de Acciones Rápidas */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Acciones</h3>
            <div className="space-y-3">
              <button 
                onClick={handleDescargarPDF}
                className="w-full flex items-center gap-3 p-3 bg-slate-600/80 hover:bg-slate-700 border border-slate-400/50 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <DescargarIcon width={20} height={20} fill="white" />
                <span>Descargar PDF</span>
              </button>
              <button 
                onClick={redirectToEnviar}
                className="w-full flex items-center gap-3 p-3 bg-emerald-600/80 hover:bg-emerald-700 border border-emerald-400/50 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <SendIcon width={20} height={20} fill="white" />
                <span>Enviar Documento</span>
              </button>
            </div>
          </div>

          {/* Card de Estadísticas */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Estadísticas</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Tiempo en Sistema</span>
                <span className="text-white font-medium">
                  {calcularDiasTranscurridos(hojaCompleta.fecha_creacion)} días
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Estado Actual</span>
                <span className="text-white font-medium capitalize">{obtenerEstadoActual().nombre}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Ubicación</span>
                <span className="text-white font-medium">{hojaCompleta?.ubicacion_actual || 'No especificada'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección para imprimir (oculta visualmente) */}
      <div ref={printRef} className="hidden print:block">
        <div className="bg-white p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">HOJA DE RUTA</h1>
            <p className="text-gray-600">H.R. {hojaCompleta.numero_hr}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Información General</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Referencia:</span> {hojaCompleta.referencia}</p>
                <p><span className="font-medium">Procedencia:</span> {hojaCompleta.procedencia}</p>
                <p><span className="font-medium">Estado:</span> {obtenerEstadoActual().nombre}</p>
                <p><span className="font-medium">Ubicación:</span> {hojaCompleta.ubicacion_actual}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Fechas</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Creada:</span> {formatearFecha(hojaCompleta.fecha_creacion)}</p>
                <p><span className="font-medium">Actualizada:</span> {formatearFecha(hojaCompleta.fecha_actualizacion)}</p>
                <p><span className="font-medium">Días transcurridos:</span> {calcularDiasTranscurridos(hojaCompleta.fecha_creacion)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para cambiar ubicación */}
      {showUbicacionModal && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cambiar Ubicación</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Destino
                </label>
                <select 
                  id="destino-select"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar destino...</option>
                  {destinos.map((destino) => (
                    <option key={destino.id} value={destino.nombre}>
                      {destino.nombre} - {destino.responsable}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsable
                </label>
                <input 
                  type="text"
                  id="responsable-input"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del responsable"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowUbicacionModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  const destinoSelect = document.getElementById('destino-select') as HTMLSelectElement;
                  const responsableInput = document.getElementById('responsable-input') as HTMLInputElement;
                  
                  if (destinoSelect.value && responsableInput.value) {
                    cambiarUbicacion(destinoSelect.value, responsableInput.value);
                  } else {
                    toast.error('Por favor, complete todos los campos');
                  }
                }}
                disabled={actualizandoEstado}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {actualizandoEstado ? 'Actualizando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default HojaRutaDetalleViewRediseño;
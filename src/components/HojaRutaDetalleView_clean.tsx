import React, { useState, useEffect, useRef } from 'react';
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
import HistorialIcon from '../assets/historial';
import DescargarIcon from '../assets/descargar';
import RelojIcon from '../assets/reloj';
import CronometroIcon from '../assets/cronometro';
import ArchivoIcon from '../assets/archivo';
import LupayIcon from '../assets/lupay';

interface HojaRutaDetalleViewProps {
  hoja: any;
  onBack: () => void;
}

const HojaRutaDetalleView: React.FC<HojaRutaDetalleViewProps> = ({ hoja, onBack }) => {
  const { token } = useAuth();
  const [hojaCompleta, setHojaCompleta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actualizandoEstado, setActualizandoEstado] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const destinosOptions = [
    'Para su conocimiento',
    'Preparar respuesta o informe', 
    'Analizar y emitir opinión',
    'Procesar de acuerdo a normas',
    'Dar curso si legalmente es procedente',
    'Elaborar Resolución',
    'Elaborar Contrato',
    'Archivar'
  ];

  const destinosDisponibles = [
    'Dirección General',
    'Subdirección General',
    'Jefe de Unidad',
    'Secretaría Departamental',
    'Departamento Legal',
    'Recursos Humanos',
    'Contabilidad',
    'Archivo Central',
    'Unidad de Sistemas',
    'Comunicación Social'
  ];

  const estadosDisponibles = [
    { 
      valor: 'pendiente', 
      nombre: 'Pendiente', 
      color: 'bg-amber-500 hover:bg-amber-600', 
      colorDark: 'bg-amber-600',
      textColor: 'text-amber-600',
      icon: CirculoOffIcon,
      descripcion: 'Documento recibido, esperando procesamiento'
    },
    { 
      valor: 'enviada', 
      nombre: 'Enviada', 
      color: 'bg-purple-500 hover:bg-purple-600', 
      colorDark: 'bg-purple-600',
      textColor: 'text-purple-600',
      icon: SendIcon,
      descripcion: 'Documento enviado al área correspondiente'
    },
    { 
      valor: 'en_proceso', 
      nombre: 'En Proceso', 
      color: 'bg-blue-500 hover:bg-blue-600', 
      colorDark: 'bg-blue-600',
      textColor: 'text-blue-600',
      icon: CirculoOnIcon,
      descripcion: 'Documento en proceso de trabajo'
    },
    { 
      valor: 'finalizada', 
      nombre: 'Finalizada', 
      color: 'bg-green-500 hover:bg-green-600', 
      colorDark: 'bg-green-600',
      textColor: 'text-green-600',
      icon: CheckIcon,
      descripcion: 'Proceso completado exitosamente'
    },
    { 
      valor: 'archivada', 
      nombre: 'Archivada', 
      color: 'bg-gray-500 hover:bg-gray-600', 
      colorDark: 'bg-gray-600',
      textColor: 'text-gray-600',
      icon: ArchivoIcon,
      descripcion: 'Documento archivado permanentemente'
    }
  ];

  useEffect(() => {
    fetchHojaCompleta();
  }, [hoja?.id]);

  const fetchHojaCompleta = async () => {
    if (!hoja?.id) {
      setError('No se proporcionó un ID válido de hoja de ruta');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`http://localhost:3001/api/hojas-ruta/${hoja.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setHojaCompleta(response.data.hoja);
      } else {
        setError('Error al obtener los datos de la hoja de ruta');
      }
    } catch (error: any) {
      console.error('Error al obtener hoja completa:', error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const obtenerEstadoActual = () => {
    const estadoActual = hojaCompleta?.estado || 'pendiente';
    return estadosDisponibles.find(estado => estado.valor === estadoActual) || estadosDisponibles[0];
  };

  const cambiarEstado = async (nuevoEstado: string) => {
    if (!hojaCompleta) return;
    
    try {
      console.log('🚀 === INICIO FRONTEND ===');
      console.log('📋 Estado inicial:', {
        hojaId: hojaCompleta.id,
        estadoActual: hojaCompleta.estado,
        nuevoEstado: nuevoEstado
      });

      setActualizandoEstado(true);
      
      const estadoBackend = nuevoEstado === 'finalizada' || nuevoEstado === 'archivada' 
        ? 'completado' 
        : nuevoEstado;

      console.log('🔄 Preparando solicitud:', {
        endpoint: `http://localhost:3001/api/hojas-ruta/${hojaCompleta.id}/estado`,
        payload: { estado: estadoBackend },
        headers: { Authorization: `Bearer ${token?.substring(0, 20)}...` }
      });

      const response = await axios.put(
        `http://localhost:3001/api/hojas-ruta/${hojaCompleta.id}/estado`,
        { estado: estadoBackend },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      console.log('✅ Respuesta exitosa del servidor:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      
      setHojaCompleta({ ...hojaCompleta, estado: nuevoEstado, estado_cumplimiento: estadoBackend });
      toast.success(`Estado actualizado a: ${estadosDisponibles.find(e => e.valor === nuevoEstado)?.nombre}`);
      
      window.dispatchEvent(new CustomEvent('estadoActualizado', { 
        detail: { hojaId: hojaCompleta.id, nuevoEstado: estadoBackend } 
      }));
      
      console.log('🎯 === FIN FRONTEND EXITOSO ===');
      
    } catch (error: any) {
      console.error('❌ === ERROR EN FRONTEND ===');
      console.error('🔍 Detalles del error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      
      const mensajeError = error.response?.data?.message || error.message || 'Error desconocido';
      toast.error(`Error al actualizar el estado: ${mensajeError}`);
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
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (element.scrollHeight * imgWidth) / element.scrollWidth;
      let heightLeft = imgHeight;

      if (imgHeight <= pageHeight) {
        pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        let position = 0;
        pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }
      
      const filename = `hoja-ruta-${hojaCompleta?.numero_hr || 'documento'}.pdf`;
      pdf.save(filename);
      toast.success('PDF descargado exitosamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      toast.error('Error al generar el PDF');
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="bg-vino hover:bg-vino-oscuro text-white px-4 py-2 rounded-lg">
            ← Volver a Registros
          </button>
          <h1 className="text-2xl font-bold text-white">Cargando detalles...</h1>
        </div>
        <div className="bg-[rgba(0,0,0,0.18)] rounded-2xl p-8 text-center">
          <div className="flex items-center gap-2 text-white/60">
            <LupayIcon width={16} height={16} fill="currentColor" />
            <span>Cargando información de la hoja de ruta...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="bg-vino hover:bg-vino-oscuro text-white px-4 py-2 rounded-lg">
            ← Volver a Registros
          </button>
          <h1 className="text-2xl font-bold text-white">Error al cargar</h1>
        </div>
        <div className="bg-[rgba(0,0,0,0.18)] rounded-2xl p-8 text-center">
          <div className="text-red-400">{error}</div>
          <button onClick={fetchHojaCompleta} className="mt-4 bg-vino text-white px-4 py-2 rounded-lg">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="bg-vino hover:bg-vino-oscuro text-white px-4 py-2 rounded-lg shadow-lg">
            ← Volver a Registros
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Detalle de Hoja de Ruta</h1>
            <p className="text-white/80 text-sm">{hojaCompleta?.numero_hr} - {hojaCompleta?.referencia || 'Sin referencia'}</p>
          </div>
        </div>
        
        <button onClick={handleDescargarPDF} className="bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <DescargarIcon width={20} height={20} fill="white" />
          <div className="flex flex-col items-start">
            <span className="font-semibold text-sm">Descargar PDF</span>
            <span className="text-xs opacity-90">Generar archivo</span>
          </div>
        </button>
      </div>

      {/* SECCIÓN DE SEGUIMIENTO PROFESIONAL */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8 shadow-2xl">
        {/* Header del Estado Actual */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className={`p-4 rounded-2xl ${obtenerEstadoActual().colorDark} shadow-lg`}>
              {React.createElement(obtenerEstadoActual().icon, { width: 40, height: 40, fill: "white" })}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">Estado Actual:</h2>
                <span className={`px-4 py-2 rounded-xl text-sm font-semibold text-white ${obtenerEstadoActual().colorDark} shadow-md`}>
                  {obtenerEstadoActual().nombre}
                </span>
              </div>
              <p className="text-white/80 text-sm mb-1">{obtenerEstadoActual().descripcion}</p>
              <div className="flex items-center gap-4 text-xs text-white/60">
                {obtenerEstadoActual().valor === 'pendiente' && (
                  <span className="flex items-center gap-2">
                    <RelojIcon width={16} height={16} fill="currentColor" />
                    Esperando atención
                  </span>
                )}
                {obtenerEstadoActual().valor === 'en_proceso' && (
                  <span className="flex items-center gap-2">
                    <CronometroIcon width={16} height={16} fill="currentColor" />
                    En desarrollo
                  </span>
                )}
                {(obtenerEstadoActual().valor === 'finalizada' || obtenerEstadoActual().valor === 'archivada') && (
                  <span className="flex items-center gap-2">
                    <GuardarOnIcon width={16} height={16} fill="currentColor" />
                    Proceso completado
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Historial rápido */}
          <div className="flex items-center gap-2 text-white/70">
            <HistorialIcon width={20} height={20} fill="currentColor" />
            <span className="text-sm">
              Actualizado {hojaCompleta?.fecha_modificacion ? new Date(hojaCompleta.fecha_modificacion).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>

        {/* Grid de acciones rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {estadosDisponibles.map((estado) => (
            <button
              key={estado.valor}
              onClick={() => cambiarEstado(estado.valor)}
              disabled={actualizandoEstado || hojaCompleta?.estado === estado.valor}
              className={`
                ${estado.color} 
                ${hojaCompleta?.estado === estado.valor 
                  ? 'ring-4 ring-white/30 shadow-2xl scale-105' 
                  : 'hover:scale-105 hover:shadow-xl'
                }
                disabled:opacity-60 disabled:cursor-not-allowed
                text-white font-medium px-4 py-3 rounded-xl 
                transition-all duration-300 
                flex flex-col items-center gap-2
                text-sm
              `}
              title={estado.descripcion}
            >
              {React.createElement(estado.icon, { 
                width: 24, 
                height: 24, 
                fill: "white",
                className: hojaCompleta?.estado === estado.valor ? 'animate-pulse' : ''
              })}
              <span>{estado.nombre}</span>
              {hojaCompleta?.estado === estado.valor && (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Información adicional del documento */}
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <ArchivoIcon width={18} height={18} fill="currentColor" />
            Información del Documento
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-white/70">Número HR:</span>
              <p className="text-white font-medium">{hojaCompleta?.numero_hr}</p>
            </div>
            <div>
              <span className="text-white/70">Referencia:</span>
              <p className="text-white">{hojaCompleta?.referencia || 'Sin referencia'}</p>
            </div>
            <div>
              <span className="text-white/70">Fecha Límite:</span>
              <p className="text-white">{hojaCompleta?.fecha_limite ? new Date(hojaCompleta.fecha_limite).toLocaleDateString() : 'No especificada'}</p>
            </div>
            <div>
              <span className="text-white/70">Prioridad:</span>
              <p className="text-white capitalize">{hojaCompleta?.prioridad || 'Normal'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vista previa para PDF */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" ref={printRef}>
        <div className="p-0">
          {hojaCompleta && <HojaRutaPreview data={hojaCompleta} />}
        </div>
      </div>
    </div>
  );
};

export default HojaRutaDetalleView;
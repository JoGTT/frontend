import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from './ToastNotifications';

interface HojaRuta {
  id: number;
  numero_hr: string;
  referencia: string;
  procedencia: string;
  estado: string;
  estado_cumplimiento: string;
  fecha_ingreso: string;
  fecha_limite?: string;
  ubicacion_actual: string;
  responsable_actual: string;
  observaciones?: string;
}

interface Props {
  onBack: () => void;
}

const HojaRutaDetalleView: React.FC<Props> = ({ onBack }) => {
  const { id } = useParams<{ id: string }>();
  const [hojaCompleta, setHojaCompleta] = useState<HojaRuta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchHojaCompleta();
  }, [id]);

  const fetchHojaCompleta = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/hojasRuta/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setHojaCompleta(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching hoja ruta:', err);
      setError('Error al cargar los detalles de la hoja de ruta');
      toast.error('Error al cargar la hoja de ruta');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const content = document.getElementById('pdf-content');
      if (!content) {
        toast.error('Contenido no disponible para PDF');
        return;
      }

      const canvas = await html2canvas(content);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
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
          <button 
            onClick={onBack} 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            ← Volver
          </button>
          <h1 className="text-2xl font-bold text-white">Cargando...</h1>
        </div>
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400">Cargando información de la hoja de ruta...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={onBack} 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            ← Volver
          </button>
          <h1 className="text-2xl font-bold text-white">Error</h1>
        </div>
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={fetchHojaCompleta} 
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!hojaCompleta) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={onBack} 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            ← Volver
          </button>
          <h1 className="text-2xl font-bold text-white">No encontrado</h1>
        </div>
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400">No se encontró la hoja de ruta solicitada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            ← Volver
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Detalle de Hoja de Ruta</h1>
            <p className="text-gray-400 text-sm">
              {hojaCompleta.numero_hr} - {hojaCompleta.referencia}
            </p>
          </div>
        </div>
        <button 
          onClick={handleGeneratePDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          📄 Descargar PDF
        </button>
      </div>

      {/* Main Content */}
      <div id="pdf-content" className="space-y-6">
        {/* Información General */}
        <div className="bg-gray-800 rounded-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-4">Información General</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm">Número H.R.</label>
              <p className="font-semibold">{hojaCompleta.numero_hr}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Referencia</label>
              <p className="font-semibold">{hojaCompleta.referencia}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Procedencia</label>
              <p className="font-semibold">{hojaCompleta.procedencia}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Fecha Ingreso</label>
              <p className="font-semibold">
                {new Date(hojaCompleta.fecha_ingreso).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Estado */}
        <div className="bg-gray-800 rounded-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-4">Estado</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm">Estado</label>
              <p className="font-semibold capitalize">{hojaCompleta.estado}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Cumplimiento</label>
              <p className="font-semibold capitalize">{hojaCompleta.estado_cumplimiento}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Ubicación Actual</label>
              <p className="font-semibold">{hojaCompleta.ubicacion_actual}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Responsable</label>
              <p className="font-semibold">{hojaCompleta.responsable_actual}</p>
            </div>
          </div>
        </div>

        {/* Observaciones */}
        {hojaCompleta.observaciones && (
          <div className="bg-gray-800 rounded-lg p-6 text-white">
            <h2 className="text-xl font-bold mb-4">Observaciones</h2>
            <p className="text-gray-300">{hojaCompleta.observaciones}</p>
          </div>
        )}

        {/* Fecha Límite */}
        {hojaCompleta.fecha_limite && (
          <div className="bg-gray-800 rounded-lg p-6 text-white">
            <h2 className="text-xl font-bold mb-4">Fecha Límite</h2>
            <p className="font-semibold">
              {new Date(hojaCompleta.fecha_limite).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HojaRutaDetalleView;

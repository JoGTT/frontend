import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EnviarIcon from '../assets/enviar';
import SendIcon from '../assets/send';
import ArchivoIcon from '../assets/archivo';
import { useAuth } from '../contexts/AuthContext';

interface HojaRuta {
  id: number;
  numero_hr: string;
  referencia?: string;
  procedencia?: string;
}

const EnviarPage: React.FC = () => {
  const { token } = useAuth();
  const [hojas, setHojas] = useState<HojaRuta[]>([]);
  const [hojaId, setHojaId] = useState<number | ''>('');
  const [destinatario, setDestinatario] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchHojas = async () => {
      if (!token) return;
      
      try {
        console.log('📋 Cargando hojas de ruta...');
        const res = await axios.get('http://localhost:3001/api/hojas-ruta', { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setHojas(res.data || []);
        console.log('✅ Hojas cargadas:', res.data?.length || 0);
      } catch (err) {
        console.error('❌ Error al cargar hojas:', err);
        setMessage('Error al cargar hojas de ruta');
        setMessageType('error');
      }
    };
    
    fetchHojas();
  }, [token]);

  const resetForm = () => {
    setHojaId('');
    setDestinatario('');
    setObservaciones('');
    setFiles(null);
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setMessage('Debes iniciar sesión para enviar documentos');
      setMessageType('error');
      return;
    }

    if (!destinatario.trim()) {
      setMessage('El campo destinatario es obligatorio');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      console.log('📤 Enviando datos...');
      
      // Preparar metadatos de archivos
      const instrucciones = files ? Array.from(files).map(f => ({
        name: f.name,
        size: f.size,
        type: f.type,
        lastModified: f.lastModified
      })) : [];

      const payload = {
        hoja_id: hojaId || null,
        destinatario: destinatario.trim(),
        observaciones: observaciones.trim() || null,
        instrucciones
      };

      console.log('📦 Payload:', payload);

      const res = await axios.post('http://localhost:3001/api/enviar', payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 201) {
        console.log('✅ Envío exitoso:', res.data);
        setMessage(res.data?.mensaje || 'Envío registrado correctamente');
        setMessageType('success');
        resetForm();
      }
    } catch (err: any) {
      console.error('❌ Error al enviar:', err);
      const status = err?.response?.status;
      const errorData = err?.response?.data;
      
      if (status === 501) {
        setMessage('Error: La tabla de envíos no existe en la base de datos');
      } else if (status === 400) {
        setMessage(errorData?.error || 'Datos inválidos');
      } else if (status === 401) {
        setMessage('Sesión expirada. Vuelve a iniciar sesión');
      } else {
        setMessage(errorData?.error || 'Error al procesar el envío');
      }
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const fileCount = files ? files.length : 0;
  const totalSize = files ? Array.from(files).reduce((acc, f) => acc + f.size, 0) : 0;
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 text-[var(--color-gris-800)] min-h-screen bg-[var(--color-fondo-casi-blanco)] border border-[var(--color-gris-300)]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 flex items-center justify-center bg-[rgba(255,255,255,0.03)] rounded-md">
          <EnviarIcon width={24} height={24} fill="white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Enviar Documentos</h2>
          <p className="text-white/70 text-sm">Registra envíos y adjunta la información necesaria</p>
        </div>
      </div>

      {/* Mensaje de estado */}
      {message && (
        <div className={`p-3 mb-4 rounded-sm text-sm ${messageType === 'success' ? 'bg-green-600/20 text-green-100 border border-green-500/20' : 'bg-red-600/20 text-red-100 border border-red-500/20'}`}>
          {message}
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Seleccionar hoja */}
          <label className="flex flex-col">
            <span className="text-sm text-white/80 mb-2">Hoja de ruta (opcional)</span>
            <select 
              value={hojaId} 
              onChange={e => setHojaId(e.target.value === '' ? '' : Number(e.target.value))} 
              className="p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-sm text-white focus:bg-[rgba(255,255,255,0.04)] focus:border-[rgba(255,255,255,0.12)]"
            >
              <option value="" className="bg-gray-800">-- Sin vincular --</option>
              {hojas.map(h => (
                <option key={h.id} value={h.id} className="bg-gray-800">
                  H.R. {h.numero_hr} — {h.referencia || h.procedencia || 'Sin referencia'}
                </option>
              ))}
            </select>
          </label>

          {/* Destinatario */}
          <label className="flex flex-col">
            <span className="text-sm text-white/80 mb-2">Destinatario *</span>
            <input 
              type="text"
              value={destinatario} 
              onChange={e => setDestinatario(e.target.value)} 
              className="p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-sm text-white placeholder-white/40 focus:bg-[rgba(255,255,255,0.04)] focus:border-[rgba(255,255,255,0.12)]" 
              placeholder="Nombre, email o institución"
              required
            />
          </label>

          {/* Archivos */}
          <label className="flex flex-col">
            <span className="text-sm text-white/80 mb-2">Archivos adjuntos</span>
            <input 
              type="file" 
              multiple 
              onChange={e => setFiles(e.target.files)} 
              className="p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-sm text-white text-sm"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '0.125rem',
                color: 'white'
              }}
            />
            {fileCount > 0 && (
              <p className="text-xs text-white/60 mt-1">
                <ArchivoIcon width={12} height={12} fill="currentColor" className="inline mr-1" />
                {fileCount} archivo{fileCount > 1 ? 's' : ''} • {formatSize(totalSize)}
              </p>
            )}
          </label>
        </div>

        {/* Observaciones */}
        <label className="flex flex-col">
          <span className="text-sm text-white/80 mb-2">Observaciones adicionales</span>
          <textarea 
            value={observaciones} 
            onChange={e => setObservaciones(e.target.value)} 
            className="p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-sm text-white placeholder-white/40 focus:bg-[rgba(255,255,255,0.04)] focus:border-[rgba(255,255,255,0.12)] resize-none"
            rows={4}
            placeholder="Información adicional sobre el envío..."
          />
        </label>

        {/* Botones de acción */}
        <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.06)]">
          <div className="text-xs text-white/60">
            * Campos obligatorios
          </div>
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="px-4 py-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-sm text-white/80 hover:bg-[rgba(255,255,255,0.04)] disabled:opacity-50"
            >
              Limpiar
            </button>
            <button 
              disabled={loading || !destinatario.trim()} 
              type="submit" 
              style={{ background: loading ? 'rgba(0,0,0,0.2)' : 'var(--color-esmeralda)' }}
              className="px-6 py-2 rounded-sm text-white inline-flex items-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <SendIcon width={16} height={16} fill="white" />
              {loading ? 'Registrando...' : 'Registrar envío'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EnviarPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import SendIcon from '../assets/send';
import ArchivoIcon from '../assets/archivo';
import DocumentosIcon from '../assets/documentos';
import EnviarIcon from '../assets/enviar';

interface Hoja {
  id: number;
  numero_hr: string;
  referencia?: string;
  procedencia?: string;
}

interface Destino {
  id: number;
  nombre: string;
  descripcion?: string;
}

const EnviarPageReestructurado: React.FC = () => {
  const { token } = useAuth();
  const [hojas, setHojas] = useState<Hoja[]>([]);
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState('');
  
  // Campos del formulario
  const [destinatarioNombre, setDestinatarioNombre] = useState('');
  const [destinatarioCorreo, setDestinatarioCorreo] = useState('');
  const [destinatarioNumero, setDestinatarioNumero] = useState('');
  const [destinoId, setDestinoId] = useState<number | ''>('');
  const [hojaId, setHojaId] = useState<number | ''>('');
  
  // UI states
  const [hojaSearch, setHojaSearch] = useState('');
  const [showHojaDropdown, setShowHojaDropdown] = useState(false);
  const [comentarios, setComentarios] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);

  // Cargar hojas y destinos disponibles
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      setLoadingData(true);
      try {
        // Cargar hojas de ruta
        const hojasResponse = await axios.get('http://localhost:3001/api/hojas-ruta', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHojas(hojasResponse.data || []);

        // Cargar destinos
        const destinosResponse = await axios.get('http://localhost:3001/api/enviar/destinos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDestinos(destinosResponse.data.destinos || []);
        
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setMessage('Error al cargar datos iniciales');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!destinatarioNombre.trim()) {
      setMessage('El nombre del destinatario es obligatorio');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const archivos = files ? Array.from(files).map(f => ({
        name: f.name,
        size: f.size,
        type: f.type,
        lastModified: f.lastModified
      })) : [];

      const payload = {
        hoja_id: hojaId || null,
        destinatario_nombre: destinatarioNombre.trim(),
        destinatario_correo: destinatarioCorreo.trim() || null,
        destinatario_numero: destinatarioNumero.trim() || null,
        destino_id: destinoId || null,
        comentarios: comentarios.trim() || null,
        archivos
      };

      const response = await axios.post('http://localhost:3001/api/enviar', payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        setMessage('Envío registrado exitosamente');
        // Limpiar formulario
        setDestinatarioNombre('');
        setDestinatarioCorreo('');
        setDestinatarioNumero('');
        setDestinoId('');
        setHojaId('');
        setHojaSearch('');
        setShowHojaDropdown(false);
        setComentarios('');
        setFiles(null);
      }
    } catch (err: any) {
      console.error('Error al enviar:', err);
      const errorData = err?.response?.data;
      setMessage(errorData?.error || 'Error al procesar el envío');
    } finally {
      setLoading(false);
    }
  };

  const limpiarFormulario = () => {
    setDestinatarioNombre('');
    setDestinatarioCorreo('');
    setDestinatarioNumero('');
    setDestinoId('');
    setHojaId('');
    setHojaSearch('');
    setShowHojaDropdown(false);
    setComentarios('');
    setFiles(null);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-morado-50)] via-white to-[var(--color-morado-100)] p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-16 h-16 flex items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] shadow-lg"
          >
            <SendIcon width={32} height={32} fill="white" />
          </motion.div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
              Enviar Documentos
            </h1>
            <p className="text-[var(--color-gris-600)] mt-1 text-lg">
              Registra y gestiona el envío de hojas de ruta a sus destinos
            </p>
          </div>
        </motion.div>

        {/* Loading Indicator */}
        {loadingData && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-blue-50 border-2 border-blue-200 text-blue-700 flex items-center gap-3"
          >
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-semibold">Cargando datos...</span>
          </motion.div>
        )}

        {/* Form Card */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-[var(--color-morado-200)]"
        >
          <div className="p-8 space-y-8">
            
            {/* Destinatario Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b-2 border-[var(--color-morado-200)]">
                <div className="w-1 h-8 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full"></div>
                <h2 className="text-2xl font-bold text-[var(--color-gris-900)]">
                  Información del Destinatario
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Nombre */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <label className="text-sm font-bold text-[var(--color-gris-700)]">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={destinatarioNombre}
                    onChange={(e) => setDestinatarioNombre(e.target.value)}
                    placeholder="Ej: Juan Pérez García"
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-morado-200)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all duration-300 bg-[var(--color-morado-50)] text-[var(--color-gris-900)] placeholder-[var(--color-gris-500)] font-medium"
                  />
                </motion.div>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <label className="text-sm font-bold text-[var(--color-gris-700)]">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={destinatarioCorreo}
                    onChange={(e) => setDestinatarioCorreo(e.target.value)}
                    placeholder="correo@sedeges.gob.bo"
                    className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-morado-200)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all duration-300 bg-[var(--color-morado-50)] text-[var(--color-gris-900)] placeholder-[var(--color-gris-500)] font-medium"
                  />
                </motion.div>

                {/* Teléfono */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <label className="text-sm font-bold text-[var(--color-gris-700)]">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={destinatarioNumero}
                    onChange={(e) => setDestinatarioNumero(e.target.value)}
                    placeholder="70 123456 o 2 2123456"
                    className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-morado-200)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all duration-300 bg-[var(--color-morado-50)] text-[var(--color-gris-900)] placeholder-[var(--color-gris-500)] font-medium"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Envío Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-6 pt-6 border-t-2 border-[var(--color-morado-200)]"
            >
              <div className="flex items-center gap-3 pb-4">
                <div className="w-1 h-8 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full"></div>
                <h2 className="text-2xl font-bold text-[var(--color-gris-900)]">
                  Información del Envío
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Destino */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <label className="text-sm font-bold text-[var(--color-gris-700)]">
                    Destino Institucional
                  </label>
                  <select
                    value={destinoId}
                    onChange={(e) => setDestinoId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-morado-200)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all duration-300 bg-[var(--color-morado-50)] text-[var(--color-gris-900)] font-medium"
                  >
                    <option value="">-- Seleccionar destino --</option>
                    {destinos.map(d => (
                      <option key={d.id} value={d.id}>{d.nombre}</option>
                    ))}
                  </select>
                  {destinoId && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-[var(--color-success)] font-semibold">
                      ✓ {destinos.find(d => d.id === destinoId)?.nombre}
                    </motion.div>
                  )}
                </motion.div>

                {/* Hoja de Ruta */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3 relative"
                >
                  <label className="text-sm font-bold text-[var(--color-gris-700)]">
                    Hoja de Ruta (Opcional)
                  </label>
                  <input
                    type="text"
                    value={hojaSearch}
                    onChange={(e) => {
                      setHojaSearch(e.target.value);
                      setShowHojaDropdown(true);
                    }}
                    onFocus={() => setShowHojaDropdown(true)}
                    placeholder="Buscar por número o referencia..."
                    className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-morado-200)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all duration-300 bg-[var(--color-morado-50)] text-[var(--color-gris-900)] placeholder-[var(--color-gris-500)] font-medium"
                  />
                  
                  {showHojaDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[var(--color-morado-200)] rounded-lg shadow-xl max-h-64 overflow-y-auto z-10"
                    >
                      {hojas.filter(h =>
                        hojaSearch === '' ||
                        h.numero_hr.toLowerCase().includes(hojaSearch.toLowerCase()) ||
                        (h.referencia && h.referencia.toLowerCase().includes(hojaSearch.toLowerCase()))
                      ).length > 0 ? (
                        hojas.filter(h =>
                          hojaSearch === '' ||
                          h.numero_hr.toLowerCase().includes(hojaSearch.toLowerCase()) ||
                          (h.referencia && h.referencia.toLowerCase().includes(hojaSearch.toLowerCase()))
                        ).map((h, idx) => (
                          <motion.button
                            key={h.id}
                            type="button"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => {
                              setHojaId(h.id);
                              setHojaSearch('');
                              setShowHojaDropdown(false);
                            }}
                            className="w-full text-left px-4 py-3 border-b border-[var(--color-morado-100)] last:border-b-0 hover:bg-[var(--color-morado-50)] transition-colors duration-200"
                          >
                            <div className="font-bold text-[var(--color-gris-900)]">{h.numero_hr}</div>
                            {h.referencia && (
                              <div className="text-sm text-[var(--color-gris-600)]">{h.referencia}</div>
                            )}
                          </motion.button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-center text-[var(--color-gris-600)]">
                          No hay hojas disponibles
                        </div>
                      )}
                    </motion.div>
                  )}
                  
                  {hojaId && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-[var(--color-success)] font-semibold">
                      ✓ H.R. {hojas.find(h => h.id === hojaId)?.numero_hr}
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Comments */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-3 pt-6 border-t-2 border-[var(--color-morado-200)]"
            >
              <label className="text-sm font-bold text-[var(--color-gris-700)]">
                Observaciones
              </label>
              <textarea
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                placeholder="Agregar observaciones o instrucciones especiales para el envío..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-morado-200)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all duration-300 bg-[var(--color-morado-50)] text-[var(--color-gris-900)] placeholder-[var(--color-gris-500)] font-medium resize-none"
              />
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-end gap-4 pt-8"
            >
              <motion.button
                type="button"
                onClick={limpiarFormulario}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-lg border-2 border-[var(--color-gris-300)] text-[var(--color-gris-700)] font-bold hover:bg-[var(--color-gris-100)] transition-all duration-300"
              >
                Limpiar
              </motion.button>

              <motion.button
                type="submit"
                disabled={loading || !destinatarioNombre.trim()}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <SendIcon width={20} height={20} fill="white" />
                    Registrar Envío
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default EnviarPageReestructurado;
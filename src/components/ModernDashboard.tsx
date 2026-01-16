import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// SVG icons
import PrioridadIcon from '../assets/prioridad';
import RelojIcon from '../assets/reloj';
import ArchivoIcon from '../assets/archivo';

interface Props {
  onNavigate?: (section: string) => void;
}

interface HojaRutaReciente {
  id: number;
  numero_hr: string;
  referencia: string;
  procedencia: string;
  fecha_ingreso: string;
  prioridad: string;
}

interface Estadisticas {
  total: number;
  pendientes: number;
  en_proceso: number;
  completadas: number;
  vencidas: number;
}

interface Notificacion {
  id: number;
  mensaje: string;
  fecha: string;
  leida: boolean;
  tipo?: 'creada' | 'actualizada';
}

const ModernDashboard: React.FC<Props> = ({ onNavigate }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [hojas, setHojas] = useState<any[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    total: 0,
    pendientes: 0,
    en_proceso: 0,
    completadas: 0,
    vencidas: 0,
  });
  const [hojasRecientes, setHojasRecientes] = useState<HojaRutaReciente[]>([]);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalItems, setModalItems] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchDashboardData = async (silent = false) => {
    if (!token) return;
    if (!silent) setLoading(true);

    try {
      const response = await axios.get(API_ENDPOINTS.HOJAS_RUTA, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(response.data) ? response.data : response.data?.data || [];

      const computeDiasRestantes = (hoja: any) => {
        if (hoja.dias_para_vencimiento !== undefined && hoja.dias_para_vencimiento !== null) {
          const n = Number(hoja.dias_para_vencimiento);
          return Number.isNaN(n) ? null : n;
        }

        const fechaObjetivo = hoja.fecha_limite || hoja.fecha_limite_cumplimiento || hoja.fecha_cumplimiento;
        if (!fechaObjetivo) return null;

        const limite = new Date(fechaObjetivo);
        if (Number.isNaN(limite.getTime())) return null;

        const hoy = new Date();
        const msPorDia = 1000 * 60 * 60 * 24;
        const diff = Math.ceil((limite.setHours(0, 0, 0, 0) - hoy.setHours(0, 0, 0, 0)) / msPorDia);
        return diff;
      };

      const formatFechaCorta = (value?: string | null) => {
        if (!value) return 'sin fecha límite';
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return 'sin fecha límite';
        return d.toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' });
      };

      const enriched = data.map((h: any) => ({
        ...h,
        dias_restantes: computeDiasRestantes(h),
        fecha_objetivo: h.fecha_limite || h.fecha_limite_cumplimiento || h.fecha_cumplimiento,
      }));

      const stats = {
        total: enriched.length,
        pendientes: enriched.filter((h: any) => h.estado_cumplimiento === 'pendiente' || !h.estado_cumplimiento).length,
        en_proceso: enriched.filter((h: any) => h.estado_cumplimiento === 'en_proceso').length,
        completadas: enriched.filter(
          (h: any) => h.estado_cumplimiento === 'completado' || h.estado === 'archivada' || h.estado === 'finalizada'
        ).length,
        vencidas: enriched.filter((h: any) => (h.dias_restantes ?? 1) < 0).length,
      };

      setHojas(enriched);
      setEstadisticas(stats);
      setHojasRecientes(
        enriched
          .filter((h: any) => h.estado !== 'archivada' && h.estado !== 'finalizada')
          .slice(0, 8)
      );
      setUltimaActualizacion(new Date());

      const historial: Notificacion[] = [];
      enriched.forEach((h) => {
        if (h.fecha_ingreso) {
          historial.push({
            id: historial.length + 1,
            mensaje: `H.R. ${h.numero_hr || h.id} fue creada el ${formatFechaCorta(h.fecha_ingreso)}.` ,
            fecha: h.fecha_ingreso,
            leida: false,
            tipo: 'creada',
          });
        }
        if (h.actualizado_en && h.actualizado_en !== h.fecha_ingreso) {
          historial.push({
            id: historial.length + 1,
            mensaje: `H.R. ${h.numero_hr || h.id} se modificó el ${formatFechaCorta(h.actualizado_en)}.` ,
            fecha: h.actualizado_en,
            leida: false,
            tipo: 'actualizada',
          });
        }
      });

      historial.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      setNotificaciones(historial.slice(0, 10));
    } catch (err) {
      if (!silent) {
        setNotificaciones([
          {
            id: 1,
            mensaje: 'Error al cargar el historial.',
            fecha: new Date().toISOString(),
            leida: false,
          },
        ]);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(false);
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => fetchDashboardData(true), 120000);
    return () => clearInterval(interval);
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1116]">
        <div className="text-center text-[#cfcfc7]">
          <div className="animate-spin w-8 h-8 border-2 border-[#a89070] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm">Cargando panel ejecutivo...</p>
        </div>
      </div>
    );
  }

  const activas = hojas.filter((h: any) => Number(h.dias_restantes ?? 9999) >= 0);
  const criticos = activas.filter((h: any) => Number(h.dias_restantes ?? 99) <= 2);
  const proximos = activas.filter((h: any) => Number(h.dias_restantes ?? 99) >= 3 && Number(h.dias_restantes ?? 99) <= 7);
  const futuros = activas.filter((h: any) => Number(h.dias_restantes ?? 99) > 7);

  const prioridadCounts = hojas.reduce(
    (acc, hoja) => {
      const prioridad = (hoja.prioridad || '').toLowerCase();

      if (prioridad.includes('urg')) {
        acc.urgente += 1;
      } else if (prioridad.includes('prior') || prioridad.includes('media')) {
        acc.prioritario += 1;
      } else if (prioridad.includes('ruti') || prioridad.includes('baja')) {
        acc.rutinario += 1;
      }

      return acc;
    },
    { urgente: 0, prioritario: 0, rutinario: 0 }
  );

  const prioridadCards = [
    { label: 'Urgente', value: prioridadCounts.urgente, icon: <PrioridadIcon width={20} height={20} fill="#e7e2d6" />, tone: '#ff8f8f' },
    { label: 'Prioritario', value: prioridadCounts.prioritario, icon: <RelojIcon width={20} height={20} fill="#e7e2d6" />, tone: '#6fb7ff' },
    { label: 'Rutinario', value: prioridadCounts.rutinario, icon: <ArchivoIcon width={20} height={20} fill="#e7e2d6" />, tone: '#7adfa1' },
  ];

  const abrirModal = (titulo: string, items: any[]) => {
    setModalTitle(titulo);
    setModalItems(items);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen text-[#e8e8e3] bg-gradient-to-br from-[#0b1021] via-[#0f172a] to-[#0b0f1c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {/* Seguimiento por vencimiento */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-3xl font-bold text-amber-200 tracking-tight">Seguimiento</h1>
            <div className="h-[3px] w-24 rounded-full bg-[linear-gradient(90deg,#f5c565,#7adfa1)]"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[ 
              { label: 'Critico (<=2 dias)', items: criticos, tone: '#ff8f8f', icon: <PrioridadIcon width={22} height={22} fill="#e7e2d6" /> },
              { label: 'Normal (3-7 dias)', items: proximos, tone: '#ffc773', icon: <RelojIcon width={22} height={22} fill="#e7e2d6" /> },
              { label: 'En progreso (>7 dias)', items: futuros, tone: '#7adfa1', icon: <ArchivoIcon width={22} height={22} fill="#e7e2d6" /> },
            ].map((bucket) => (
              <div
                key={bucket.label}
                className="relative rounded-2xl border border-[rgba(255,255,255,0.05)] bg-transparent px-5 py-4 cursor-pointer"
                onClick={() => abrirModal(bucket.label, bucket.items)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 text-sm text-[#dcdcd6]">
                    <span className="w-9 h-9 rounded-full bg-transparent border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
                      {bucket.icon}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold">{bucket.label}</span>
                      <span className="text-xs text-[#9ea0a9]">{bucket.items.length} hoja(s)</span>
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold" style={{ color: bucket.tone }}>
                    {bucket.items.length}
                  </div>
                </div>
                <div className="space-y-2">
                  {bucket.items.slice(0, 3).map((hoja) => (
                    <div key={hoja.id} className="flex items-center justify-between text-sm text-[#e7e2d6] border border-[rgba(255,255,255,0.06)] rounded-xl px-3 py-2 bg-transparent">
                      <div className="truncate">
                        <span className="font-semibold mr-2">H.R. {hoja.numero_hr}</span>
                        <span className="text-[#a9a9a3] truncate">{hoja.referencia || 'Sin referencia'}</span>
                      </div>
                      <span className="text-xs font-semibold" style={{ color: bucket.tone }}>
                        {hoja.dias_restantes == null ? '—' : `${hoja.dias_restantes} días`}
                      </span>
                    </div>
                  ))}
                  {bucket.items.length === 0 && (
                    <div className="text-xs text-[#8f8f8a]">Sin elementos en esta categoría</div>
                  )}
                </div>
                <span
                  className="absolute right-5 bottom-1 h-[3px] rounded-full"
                  style={{ background: bucket.tone, width: Math.min(140, 24 + bucket.items.length * 14) }}
                ></span>
              </div>
            ))}
          </div>
        </div>

        {/* Prioridades */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-semibold text-amber-200 tracking-tight">Prioridades</h2>
            <div className="h-[3px] w-16 rounded-full bg-[linear-gradient(90deg,#6fb7ff,#f5c565)]"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {prioridadCards.map((card) => (
              <div
                key={card.label}
                className="relative rounded-2xl border border-[rgba(255,255,255,0.05)] bg-transparent px-4 py-4 cursor-pointer"
                onClick={() => {
                  const items = hojas.filter((h) => {
                    const prioridad = (h.prioridad || '').toLowerCase();
                    if (card.label === 'Urgente') return prioridad.includes('urg');
                    if (card.label === 'Prioritario') return prioridad.includes('prior') || prioridad.includes('media');
                    if (card.label === 'Rutinario') return prioridad.includes('ruti') || prioridad.includes('baja');
                    return false;
                  });
                  abrirModal(card.label, items);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-transparent border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
                      {card.icon}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.08em] text-[#9ea0a9]">{card.label}</p>
                      <p className="text-2xl font-extrabold" style={{ color: card.tone }}>{card.value}</p>
                    </div>
                  </div>
                </div>
                <span
                  className="absolute right-4 bottom-1 h-[3px] rounded-full"
                  style={{ background: card.tone, width: Math.max(28, Math.min(140, 20 + card.value * 8)) }}
                ></span>
              </div>
            ))}
          </div>
        </div>

        {/* Listas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Documentos recientes */}
          <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-transparent">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.06)]">
              <h3 className="text-lg font-semibold text-white">Documentos recientes</h3>
              <button onClick={() => onNavigate?.('registros')} className="text-sm text-[#cfcfc7] hover:text-[#a89070] transition">
                Ver todos
              </button>
            </div>
            {hojasRecientes.length > 0 ? (
              <div className="divide-y divide-[rgba(255,255,255,0.06)]">
                {hojasRecientes.map((hoja) => (
                  <div key={hoja.id} className="px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition cursor-pointer">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-[#f1f1ec] mb-1">H.R. {hoja.numero_hr}</div>
                        <div className="text-xs text-[#a9a9a3] truncate">{hoja.referencia || 'Sin referencia'}</div>
                        <div className="text-[11px] text-[#8b8b86] mt-1">{hoja.procedencia}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="inline-block px-3 py-1 text-[11px] font-semibold rounded-full border border-[rgba(255,255,255,0.08)] text-[#e7e2d6]">
                          {hoja.prioridad}
                        </div>
                        <div className="text-[11px] text-[#8b8b86] mt-2">
                          {new Date(hoja.fecha_ingreso).toLocaleDateString('es-BO')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-5 py-10 text-center text-[#9ea0a9] text-sm">No hay documentos recientes</div>
            )}
          </div>

          {/* Historial */}
          <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-transparent">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.06)]">
              <h3 className="text-lg font-semibold text-white">Historial</h3>
              <button onClick={() => onNavigate?.('notificaciones')} className="text-sm text-[#cfcfc7] hover:text-[#a89070] transition">
                Ver todas
              </button>
            </div>
            {notificaciones.length > 0 ? (
              <div className="divide-y divide-[rgba(255,255,255,0.06)]">
                {notificaciones.slice(0, 5).map((notif) => (
                  <div key={notif.id} className="px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition cursor-pointer">
                    <div className="text-sm text-[#f1f1ec] mb-1">{notif.mensaje}</div>
                    <div className="text-[11px] text-[#8b8b86]">{new Date(notif.fecha).toLocaleDateString('es-BO')}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-5 py-10 text-center text-[#9ea0a9] text-sm">Sin historial reciente</div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 text-xs text-[#8b8b86] flex items-center justify-between border-t border-[rgba(255,255,255,0.06)]">
          <span>Panel Ejecutivo - SEDEGES La Paz</span>
          <span>
            {ultimaActualizacion
              ? ultimaActualizacion.toLocaleDateString('es-BO', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: 'short',
                })
              : new Date().toLocaleDateString('es-BO')}
          </span>
        </div>
      </div>
      <ModalHojas
        open={modalOpen}
        title={modalTitle}
        items={modalItems}
        onClose={() => setModalOpen(false)}
        onView={(id) => {
          setModalOpen(false);
          navigate(`/hoja/${id}`);
        }}
      />
    </div>
  );
};

const ModalHojas: React.FC<{ open: boolean; title: string; items: any[]; onClose: () => void; onView: (id: number) => void }> = ({ open, title, items, onClose, onView }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-3xl rounded-2xl bg-[#0f1116] border border-[rgba(255,255,255,0.08)] shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.06)]">
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-[#9ea0a9]">Hojas de ruta</p>
            <h4 className="text-xl font-bold text-white">{title}</h4>
          </div>
          <button onClick={onClose} className="text-sm text-[#cfcfc7] hover:text-white">Cerrar</button>
        </div>
        <div className="max-h-[60vh] overflow-auto divide-y divide-[rgba(255,255,255,0.06)]">
          {items.length === 0 ? (
            <div className="px-5 py-6 text-sm text-[#9ea0a9]">No hay hojas en esta categoria.</div>
          ) : (
            items.map((hoja) => (
              <div key={hoja.id} className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-[rgba(255,255,255,0.03)]">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">H.R. {hoja.numero_hr || hoja.id}</div>
                  <div className="text-xs text-[#a9a9a3] truncate">{hoja.referencia || 'Sin referencia'}</div>
                  <div className="text-[11px] text-[#8b8b86] mt-1">{hoja.procedencia || hoja.destinatario || 'Sin procedencia'}</div>
                </div>
                <div className="text-right text-xs text-[#cfcfc7] flex-shrink-0">
                  {hoja.dias_restantes == null ? 'sin fecha' : `${hoja.dias_restantes} dias`}
                </div>
                <button
                  onClick={() => onView(hoja.id)}
                  className="px-3 py-2 text-xs font-semibold rounded-full bg-[#7adfa1] text-[#0b1021] hover:bg-[#9bf0bd]"
                >
                  Ver hoja
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;

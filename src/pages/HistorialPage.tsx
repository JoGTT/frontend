import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import HistorialIcon from '../assets/historial';

type EventoTipo = 'creada' | 'actualizada' | 'borrada' | 'progreso' | 'vence' | 'vencida' | 'otro';

interface EventoHistorial {
  id: number;
  tipo: EventoTipo;
  numero_hr: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  leida?: boolean;
}

const HistorialPage: React.FC = () => {
  const { token } = useAuth();
  const [eventos, setEventos] = useState<EventoHistorial[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarEventos = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3001/api/historial/eventos', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      const ahora = new Date();

      const normalizados: EventoHistorial[] = data.map((ev: any, idx: number) => {
        const tipo: EventoTipo = ev.tipo || 'otro';
        return {
          id: ev.id || idx + 1,
          tipo,
          numero_hr: ev.numero_hr || ev.hr || '',
          titulo: ev.titulo || `H.R. ${ev.numero_hr || ev.hr || 'sin dato'}`,
          descripcion: ev.descripcion || ev.detalle || 'Sin descripcion',
          fecha: ev.fecha || ev.fecha_actividad || ahora.toISOString(),
          leida: !!ev.leida
        };
      });

      const filtrados = normalizados.filter((ev) => {
        if (ev.tipo !== 'vencida') return true;
        const dias = Math.floor((ahora.getTime() - new Date(ev.fecha).getTime()) / (1000 * 60 * 60 * 24));
        return dias <= 3;
      });

      filtrados.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      setEventos(filtrados);
    } catch (err) {
      const ahoraISO = new Date().toISOString();
      const mock: EventoHistorial[] = [
        {
          id: 1,
          tipo: 'creada',
          numero_hr: 'HR-2025-001',
          titulo: 'Nueva hoja creada',
          descripcion: 'Se creo la hoja con prioridad alta.',
          fecha: ahoraISO,
          leida: false
        },
        {
          id: 2,
          tipo: 'vence',
          numero_hr: 'HR-2025-003',
          titulo: 'Proxima a vencer',
          descripcion: 'Vence en 2 dias.',
          fecha: ahoraISO,
          leida: false
        },
        {
          id: 3,
          tipo: 'actualizada',
          numero_hr: 'HR-2025-005',
          titulo: 'Actualizacion de datos',
          descripcion: 'Se edito la referencia y procedencia.',
          fecha: ahoraISO,
          leida: true
        }
      ];
      setEventos(mock);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, [token]);

  const eventos30 = useMemo(() => {
    const ahora = Date.now();
    const msDia = 1000 * 60 * 60 * 24;
    return eventos.filter((e) => {
      const diffDias = Math.floor((ahora - new Date(e.fecha).getTime()) / msDia);
      return diffDias >= 0 && diffDias <= 30;
    });
  }, [eventos]);

  const ultAgregados = useMemo(() => eventos30.filter((e) => e.tipo === 'creada').slice(0, 10), [eventos30]);
  const ultProgresos = useMemo(() => eventos30.filter((e) => e.tipo === 'progreso').slice(0, 10), [eventos30]);
  const ultAjustados = useMemo(() => eventos30.filter((e) => e.tipo === 'actualizada').slice(0, 10), [eventos30]);

  const formatFechaCorta = (fechaISO: string) => {
    return new Date(fechaISO).toLocaleDateString('es-BO', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="min-h-screen text-[#f5f5f1] bg-transparent">
      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="mb-6 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#f5c565] via-[#cfa45a] to-[#8b5cf6] flex items-center justify-center shadow-lg ring-2 ring-[rgba(245,197,101,0.35)]">
              <HistorialIcon width={22} height={22} fill="#0b0f1c" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-wide text-[#f5e9d7]">Centro de Historial</h1>
              <p className="text-sm text-[#cfd3e0]">Resumen de últimas acciones</p>
            </div>
          </div>
          <p className="text-xs text-[#aeb4c5]">Mostrando últimos 30 días.</p>
        </div>

        {loading ? (
          <div className="p-6 text-[#cdd1dc] bg-[rgba(15,17,25,0.95)] border border-[#242836] rounded-2xl">Cargando historial...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[
            { titulo: 'Ultimos agregados', data: ultAgregados, color: '#22c55e' },
            { titulo: 'Ultimos progresos', data: ultProgresos, color: '#f5c565' },
            { titulo: 'Ultimos ajustados', data: ultAjustados, color: '#60a5fa' }
          ].map((bloque) => (
            <div key={bloque.titulo} className="bg-[rgba(15,17,25,0.95)] border border-[#242836] rounded-2xl shadow px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold" style={{ color: bloque.color }}>{bloque.titulo}</div>
                <span className="text-[11px] text-[#8f96a8]">30 dias</span>
              </div>
              {bloque.data.length === 0 ? (
                <p className="text-xs text-[#8f96a8]">Sin registros recientes.</p>
              ) : (
                <div className="space-y-3">
                  {bloque.data.map((ev) => (
                    <div key={ev.id} className="rounded-xl border border-[#1f2233] bg-[#11131a] px-3 py-3">
                      <div className="flex items-center justify-between text-sm font-semibold" style={{ color: bloque.color }}>
                        <span>{ev.titulo}</span>
                        <span className="text-[11px] text-[#aeb4c5]">{formatFechaCorta(ev.fecha)}</span>
                      </div>
                      <p className="text-xs text-[#cdd1dc] mt-1">{ev.descripcion}</p>
                      <div className="text-[11px] text-[#8f96a8] mt-1">H.R. {ev.numero_hr}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};

export default HistorialPage;

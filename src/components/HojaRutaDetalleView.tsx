import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import HojaRutaPreview from './HojaRutaPreview';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../config/api';

// Importar iconos SVG personalizados
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

  const ultimoMovimiento = historialProgreso[0];
  const ubicacionFinal = ultimoMovimiento?.hacia || hojaCompleta?.ubicacion_actual;
  const ultimaNota = ultimoMovimiento?.observaciones;
  const ultimaFecha = ultimoMovimiento?.fecha || hojaCompleta?.actualizado_en;
  const estadoEsFinalizada = (hojaCompleta?.estado || '').toLowerCase() === 'finalizada';
  const siguienteEstado = estadoEsFinalizada ? 'en_proceso' : 'finalizada';

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
              onClick={() => cambiarEstado(siguienteEstado)}
              disabled={actualizandoEstado}
              className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 transition disabled:opacity-60"
            >
              {actualizandoEstado ? 'Guardando...' : estadoEsFinalizada ? 'Volver a En Proceso' : 'Marcar Finalizada'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 card-fade">
          {canEdit() && (
            <button
              onClick={() => setShowEditCompleteModal(true)}
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
            <DescargarIcon width={18} height={18} fill="#f5c565" />
            <span className="text-sm font-semibold">Descargar PDF</span>
          </button>

          <button
            onClick={irAProgreso}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/10 hover:border-amber-300/60 hover:bg-white/15 transition"
          >
            <CronometroIcon width={18} height={18} fill="#f5c565" />
            <span className="text-sm font-semibold">Progreso</span>
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
                  {historialProgreso.slice(0, 8).map((item: any, idx: number) => (
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
                  {actualizandoEstado ? '...': 'Cambiar'}
                </button>
              </div>
              <p className="text-lg font-semibold">{ubicacionFinal || 'Sin ubicación'}</p>
              <p className="text-sm text-slate-400">Responsable: {hojaCompleta.responsable_actual || 'No asignado'}</p>
              <p className="text-xs text-slate-500 mt-1">{obtenerEstadoActual().descripcion}</p>
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
          <div className="rounded-xl overflow-hidden bg-transparent" ref={printRef}>
            {hojaCompleta && <HojaRutaPreview data={hojaCompleta} />}
          </div>
        </div>
      </div>

      {/* Modal de Cambio de Ubicación - Diseño Mejorado */}
        setFormData(newFormData);
        setDatosLoaded(true);
      }
    }, [hojaCompleta]);

    // Función para alternar modo edición de un campo
    const toggleEditField = (fieldName: string) => {
      setCamposEditando(prev => ({
        ...prev,
        [fieldName]: !prev[fieldName]
      }));
    };

    // Función para editar todos los campos
    const toggleEditAllFields = () => {
      const allFields = [
        'numero_hr', 'nombre_solicitante', 'telefono_celular', 'referencia', 
        'procedencia', 'fecha_limite', 'fecha_ingreso', 'cite', 'numero_fojas', 
        'prioridad', 'estado', 'observaciones'
      ];
      const allEditing = allFields.every(field => camposEditando[field]);
      
      const newState: {[key: string]: boolean} = {};
      allFields.forEach(field => {
        newState[field] = !allEditing;
      });
      setCamposEditando(newState);
    };

    // Componente para campo editable
    const EditableField = ({ 
      label, 
      fieldName, 
      value, 
      type = 'text', 
      required = false, 
      isTextarea = false,
      selectOptions = null 
    }: {
      label: string;
      fieldName: string;
      value: string;
      type?: string;
      required?: boolean;
      isTextarea?: boolean;
      selectOptions?: {value: string, label: string}[] | null;
    }) => {
      const isEditing = camposEditando[fieldName];
      
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            {canEdit() && (
              <button
                onClick={() => toggleEditField(fieldName)}
                className={`p-1 rounded-md transition-colors ${
                  isEditing 
                    ? 'bg-[var(--color-success)]/20 text-[var(--color-success)] hover:bg-[var(--color-success)]/30' 
                    : 'bg-[var(--color-gris-100)] text-[var(--color-gris-500)] hover:bg-[var(--color-gris-200)]'
                }`}
                title={isEditing ? 'Guardar campo' : 'Editar campo'}
              >
              {isEditing ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <EditarIcon width={14} height={14} fill="currentColor" />
              )}
              </button>
            )}
          </div>
          
          {(isEditing && canEdit()) ? (
            // Modo edición
            <>
              {selectOptions ? (
                <select
                  value={value}
                  onChange={(e) => setFormData(prev => ({ ...prev, [fieldName]: e.target.value }))}
                  className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                >
                  {selectOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : isTextarea ? (
                <textarea
                  value={value}
                  onChange={(e) => setFormData(prev => ({ ...prev, [fieldName]: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                  placeholder={`Ingrese ${label.toLowerCase()}...`}
                />
              ) : (
                <input
                  type={type}
                  value={value}
                  onChange={(e) => setFormData(prev => ({ ...prev, [fieldName]: e.target.value }))}
                  className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                  placeholder={`Ingrese ${label.toLowerCase()}...`}
                />
              )}
            </>
          ) : (
            // Modo solo lectura
            <div className="w-full px-3 py-2 bg-[#F7F7F7] border border-[#CCCCCC] min-h-[42px] flex items-center">
              <span className={`${value ? 'text-[#1A1A1A]' : 'text-[#CCCCCC] italic'}`}>
                {value || `Sin ${label.toLowerCase()}`}
              </span>
            </div>
          )}
        </div>
      );
    };

    const handleSave = () => {
      console.log('💾 Guardando datos del formulario:', formData);
      console.log('📋 Datos originales de la hoja:', hojaCompleta);
      
      // Validaciones básicas
      if (!formData.numero_hr.trim()) {
        toast.error('El número de H.R. es requerido');
        return;
      }
      if (!formData.referencia.trim()) {
        toast.error('La referencia es requerida');
        return;
      }
      if (!formData.procedencia.trim()) {
        toast.error('La procedencia es requerida');
        return;
      }

      // Convertir numero_fojas a número si tiene valor, sino null
      const dataToSave = {
        ...formData,
        numero_fojas: formData.numero_fojas ? parseInt(formData.numero_fojas) : null
      };

      console.log('📤 Datos finales a enviar:', dataToSave);
      guardarEdicionCompleta(dataToSave);
    };

    return createPortal(
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3">
                  <EditarIcon width={24} height={24} fill="#555555" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#1A1A1A]">Editar Hoja de Ruta</h2>
                  <p className="text-[#888888] text-sm">
                    Modifica los datos principales del documento: {hojaCompleta?.numero_hr}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditCompleteModal(false)}
                className="text-[#888888] hover:text-[#555555] transition-colors p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Indicador de datos cargados */}
            {hojaCompleta && datosLoaded ? (
              <div className="bg-[#F7F7F7] p-3 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#555555]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium">
                      Editando hoja: <span className="font-bold">{hojaCompleta.numero_hr}</span>
                      {hojaCompleta.referencia && (
                        <span className="text-[#555555] ml-2">
                          - {hojaCompleta.referencia.substring(0, 50)}
                          {hojaCompleta.referencia.length > 50 ? '...' : ''}
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={toggleEditAllFields}
                    className="flex items-center gap-2 px-3 py-1 bg-[#555555] text-white text-xs hover:bg-[#444444] transition-colors"
                  >
                    <EditarIcon width={12} height={12} fill="white" />
                    Editar Todo
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#F7F7F7] p-4 mb-6">
                <div className="flex items-center gap-3 text-[#555555]">
                  <div className="w-5 h-5 border-2 border-[#555555] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-medium">Cargando datos de la hoja de ruta...</p>
                </div>
              </div>
            )}

            {/* Formulario con campos editables */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${!datosLoaded ? 'opacity-50 pointer-events-none' : ''}`}>
              {/* Información Básica */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1A1A1A] border-b border-[#CCCCCC] pb-2">
                  📋 Información Básica
                </h3>
                
                <EditableField
                  label="Número H.R."
                  fieldName="numero_hr"
                  value={formData.numero_hr}
                  required={true}
                />

                <EditableField
                  label="Nombre del Solicitante"
                  fieldName="nombre_solicitante"
                  value={formData.nombre_solicitante}
                  required={true}
                />

                <EditableField
                  label="Teléfono Celular"
                  fieldName="telefono_celular"
                  value={formData.telefono_celular}
                  type="tel"
                />

                <EditableField
                  label="Procedencia"
                  fieldName="procedencia"
                  value={formData.procedencia}
                  required={true}
                />

                <div className="grid grid-cols-2 gap-3">
                  <EditableField
                    label="Prioridad"
                    fieldName="prioridad"
                    value={formData.prioridad}
                    selectOptions={[
                      { value: 'urgente', label: 'Urgente' },
                      { value: 'prioritario', label: 'Prioritario' },
                      { value: 'rutinario', label: 'Rutinario' },
                      { value: 'otros', label: 'Otros' }
                    ]}
                  />
                  
                  <EditableField
                    label="Estado"
                    fieldName="estado"
                    value={formData.estado}
                    selectOptions={[
                      { value: 'pendiente', label: 'Pendiente' },
                      { value: 'enviada', label: 'Enviada' },
                      { value: 'en_proceso', label: 'En Proceso' },
                      { value: 'finalizada', label: 'Finalizada' },
                      { value: 'archivada', label: 'Archivada' }
                    ]}
                  />
                </div>
              </div>

              {/* Detalles del Documento */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1A1A1A] border-b border-[#CCCCCC] pb-2">
                  📄 Detalles del Documento
                </h3>
                
                <EditableField
                  label="Cite"
                  fieldName="cite"
                  value={formData.cite}
                />

                <EditableField
                  label="Número de Fojas"
                  fieldName="numero_fojas"
                  value={formData.numero_fojas}
                  type="number"
                />

                <div className="grid grid-cols-2 gap-3">
                  <EditableField
                    label="Fecha de Ingreso"
                    fieldName="fecha_ingreso"
                    value={formData.fecha_ingreso}
                    type="date"
                  />
                  
                  <EditableField
                    label="Fecha Límite"
                    fieldName="fecha_limite"
                    value={formData.fecha_limite}
                    type="date"
                  />
                </div>

                <EditableField
                  label="Observaciones"
                  fieldName="observaciones"
                  value={formData.observaciones}
                  isTextarea={true}
                />
              </div>

              {/* Referencia - Campo amplio */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-[#1A1A1A] border-b border-[#CCCCCC] pb-2 mb-4">
                  📝 Contenido del Documento
                </h3>
                
                <EditableField
                  label="Referencia"
                  fieldName="referencia"
                  value={formData.referencia}
                  required={true}
                  isTextarea={true}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-[#CCCCCC]">
              <button
                onClick={() => setShowEditCompleteModal(false)}
                className="px-6 py-2 border border-[#CCCCCC] text-[#555555] hover:bg-[#F7F7F7] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={actualizandoEstado || !datosLoaded}
                className="px-6 py-2 bg-[#555555] text-white hover:bg-[#444444] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {actualizandoEstado ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <EditarIcon width={16} height={16} fill="white" />
                    Guardar Cambios ({hojaCompleta?.numero_hr})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  // Componente Modal de Edición
  const ModalEdicionSeccion = () => {
    const [formData, setFormData] = useState({
      fechaRecepcion: '',
      destino: '',
      destinoPersonalizado: '',
      instrucciones: [] as string[],
      instruccionesAdicionales: ''
    });

    const [mostrarDestinoPersonalizado, setMostrarDestinoPersonalizado] = useState(false);

    console.log('🔧 ModalEdicionSeccion renderizado:', {
      editingSection,
      totalDestinos: destinos.length,
      loadingDestinos,
      destinosArray: destinos.slice(0, 2)
    });

    // TEMPORAL: Mostrar todos los destinos sin filtrar para debug
    const destinosParaSeleccion = destinos; // destinos.filter(d => {
    //   if (editingSection === 0) {
    //     // Para envío principal, incluir centros, direcciones y otros
    //     return ['centro_acogida', 'direccion', 'otro'].includes(d.tipo);
    //   } else {
    //     // Para recepciones, solo centros de acogida
    //     return d.tipo === 'centro_acogida';
    //   }
    // });

    console.log('🔍 Filtrado destinos:', {
      totalDestinos: destinos.length,
      editingSection,
      destinosFiltrados: destinosParaSeleccion.length,
      tiposDisponibles: destinos.map(d => d.tipo).filter((v, i, a) => a.indexOf(v) === i),
      destinosParaSeleccion: destinosParaSeleccion.slice(0, 3)
    });

    console.log('🏗️ Renderizando opciones:', destinosParaSeleccion.length, 'destinos');

    const handleInstruccionToggle = (instruccion: string) => {
      setFormData(prev => ({
        ...prev,
        instrucciones: prev.instrucciones.includes(instruccion)
          ? prev.instrucciones.filter(i => i !== instruccion)
          : [...prev.instrucciones, instruccion]
      }));
    };

    return createPortal(
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#1A1A1A]">
                Editar {editingSection === 0 ? 'Envío Principal' : `Recepción ${editingSection}`}
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-[#888888] hover:text-[#555555] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Fecha de Recepción (solo para secciones 1, 2, 3) */}
              {editingSection > 0 && (
                <div>
                  <label className="block text-sm font-medium text-[#444444] mb-2">
                    Fecha de Recepción
                  </label>
                  <input
                    type="date"
                    value={formData.fechaRecepcion}
                    onChange={(e) => setFormData(prev => ({ ...prev, fechaRecepcion: e.target.value }))}
                    className="w-full px-3 py-2 border border-[#CCCCCC] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                </div>
              )}

              {/* Destino */}
              <div>
                <label className="block text-sm font-medium text-[#444444] mb-2">
                  Destino
                </label>
                <select
                  value={formData.destino}
                  onChange={(e) => {
                    const valor = e.target.value;
                    console.log('📝 Cambio de destino:', valor);
                    setFormData(prev => ({ ...prev, destino: valor }));
                    setMostrarDestinoPersonalizado(valor === 'personalizado');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loadingDestinos}
                >
                  <option value="">Seleccionar destino...</option>
                  {destinosParaSeleccion.length === 0 && <option disabled>⚠️ No hay destinos disponibles</option>}
                  {destinosParaSeleccion.map(destino => (
                    <option key={destino.id} value={destino.nombre}>
                      {destino.nombre}
                    </option>
                  ))}
                  <option value="personalizado">🖊️ Escribir otro destino...</option>
                </select>
                
                {/* Campo para destino personalizado */}
                {mostrarDestinoPersonalizado && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Destino Personalizado
                    </label>
                    <input
                      type="text"
                      value={formData.destinoPersonalizado}
                      onChange={(e) => setFormData(prev => ({ ...prev, destinoPersonalizado: e.target.value }))}
                      placeholder="Escribir destino personalizado..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              {/* Instrucciones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Instrucciones
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {tiposInstruccion.map((instruccion: string) => (
                    <label key={instruccion} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={formData.instrucciones.includes(instruccion)}
                        onChange={() => handleInstruccionToggle(instruccion)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{instruccion}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Instrucciones Adicionales */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instrucciones Adicionales
                </label>
                <textarea
                  value={formData.instruccionesAdicionales}
                  onChange={(e) => setFormData(prev => ({ ...prev, instruccionesAdicionales: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Instrucciones adicionales..."
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const destinoFinal = mostrarDestinoPersonalizado ? formData.destinoPersonalizado : formData.destino;
                  const datosParaGuardar = {
                    ...formData,
                    destino: destinoFinal
                  };
                  guardarEdicionSeccion(datosParaGuardar);
                }}
                disabled={actualizandoEstado}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {actualizandoEstado ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
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
      
      console.log('🔍 Obteniendo detalles de hoja de ruta:', {
        hojaId: hoja.id,
        url: `http://localhost:3001/api/hojas-ruta/${hoja.id}`,
        hasToken: !!token
      });
      
      const response = await axios.get(`http://localhost:3001/api/hojas-ruta/${hoja.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('📋 Respuesta del servidor:', {
        status: response.status,
        success: response.data.success,
        hasHoja: !!response.data.hoja,
        data: response.data
      });

      if (response.data.success) {
        setHojaCompleta(response.data.hoja);
      } else {
        setError(`Error del servidor: ${response.data.message || 'Error al obtener los datos de la hoja de ruta'}`);
      }
    } catch (error: any) {
      console.error('❌ Error al obtener hoja completa:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      
      const mensajeError = error.response?.data?.message || error.message || 'Error desconocido';
      setError(`Error al cargar los datos: ${mensajeError}`);
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
      
      // Mapear estados del frontend a estados válidos del backend
      const mapaEstadoBackend: { [key: string]: string } = {
        'pendiente': 'pendiente',
        'enviada': 'en_proceso',
        'en_proceso': 'en_proceso', 
        'finalizada': 'completado',
        'archivada': 'completado'
      };
      
      const estadoBackend = mapaEstadoBackend[nuevoEstado] || 'pendiente';

      console.log('🔄 Preparando solicitud:', {
        endpoint: `http://localhost:3001/api/hojas-ruta/${hojaCompleta.id}/estado`,
        nuevoEstado_frontend: nuevoEstado,
        estadoBackend_mapeado: estadoBackend,
        payload: { estado_cumplimiento: estadoBackend, estado: nuevoEstado },
        headers: { Authorization: `Bearer ${token?.substring(0, 20)}...` }
      });

      const response = await axios.patch(
        `http://localhost:3001/api/hojas-ruta/${hojaCompleta.id}/estado`,
        { 
          estado_cumplimiento: estadoBackend,
          estado: nuevoEstado
        },
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

  // Cambiar ubicación del documento
  const cambiarUbicacion = async (nuevaUbicacion: string, responsable: string) => {
    if (!hojaCompleta) return;
    
    try {
      setActualizandoEstado(true);
      
      console.log('🏢 CAMBIANDO UBICACIÓN:', {
        ubicacionActual: hojaCompleta.ubicacion_actual,
        nuevaUbicacion: nuevaUbicacion,
        responsable: responsable,
        hojaId: hojaCompleta.id
      });
      
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
      
      console.log('✅ RESPUESTA DEL BACKEND:', response.data);
      
      setHojaCompleta({ 
        ...hojaCompleta, 
        ubicacion_actual: nuevaUbicacion, 
        responsable_actual: responsable 
      });
      
      toast.success(`Ubicación actualizada a: ${nuevaUbicacion}`);
      
    } catch (error: any) {
      console.error('❌ Error al cambiar ubicación:', error);
      const mensajeError = error.response?.data?.message || error.message || 'Error desconocido';
      toast.error(`Error al cambiar ubicación: ${mensajeError}`);
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
        
        <div className="flex items-center gap-4">
          {/* Editar Hoja Completa - Solo para usuarios con permisos de edición */}
          {canEdit() && (
            <button 
              onClick={() => setShowEditCompleteModal(true)}
              className="bg-[#555555] hover:bg-[#444444] text-white px-4 py-2 flex items-center gap-2 transition-all duration-200"
            >
              <EditarIcon width={18} height={18} fill="white" />
              <span className="font-medium text-sm">Editar Hoja</span>
            </button>
          )}
          
          {/* Mensaje informativo para usuarios sin permisos */}
          {!canEdit() && (
            <div className="bg-[#F7F7F7] text-[#444444] px-4 py-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-sm">
                Solo lectura - Usuario: {user?.rol || 'Desconocido'}
              </span>
            </div>
          )}
          
          {/* Descargar PDF */}
          <button 
            onClick={handleDescargarPDF}
            className="bg-[#555555] hover:bg-[#444444] text-white px-4 py-2 flex items-center gap-2 transition-all duration-200"
          >
            <DescargarIcon width={18} height={18} fill="white" />
            <span className="font-medium text-sm">Descargar PDF</span>
          </button>
          
          {/* Enviar Documento */}
          <button 
            onClick={() => {
              console.log('🚀 Navegando a enviar documento');
              window.dispatchEvent(new CustomEvent('navigate', { detail: { to: 'enviar' } }));
            }}
            className="bg-[#555555] hover:bg-[#444444] text-white px-4 py-2 flex items-center gap-2 transition-all duration-200"
          >
            <SendIcon width={18} height={18} fill="white" />
            <span className="font-medium text-sm">Enviar Documento</span>
          </button>
        </div>
      </div>

      {/* SECCIÓN DE SEGUIMIENTO PROFESIONAL */}
      <div className="bg-[#F7F7F7] p-6 mb-8">
        {/* Header del Estado Actual - Más Destacado */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className={`p-6 ${obtenerEstadoActual().colorDark}`}>
              {React.createElement(obtenerEstadoActual().icon, { width: 48, height: 48, fill: "white" })}
            </div>
            <div>
              <div className="flex items-center gap-4 mb-3">
                <h2 className="text-3xl font-bold text-[#1A1A1A]">Estado Actual:</h2>
                <span className={`px-6 py-3 text-lg font-bold text-white ${obtenerEstadoActual().colorDark}`}>
                  {obtenerEstadoActual().nombre}
                </span>
              </div>
              
              {/* UBICACIÓN ACTUAL - DISEÑO PROFESIONAL */}
              <div className="bg-white p-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2">
                      <LupayIcon width={18} height={18} fill="#555555" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#444444]">Ubicación Actual</h3>
                  </div>
                  <button
                    onClick={() => setShowUbicacionModal(true)}
                    className="text-xs bg-[#555555] hover:bg-[#444444] text-white px-3 py-1.5 transition-colors duration-200 flex items-center gap-1"
                    disabled={actualizandoEstado}
                  >
                    <LupayIcon width={12} height={12} fill="currentColor" />
                    {actualizandoEstado ? 'Actualizando...' : 'Cambiar'}
                  </button>
                </div>
                <div className="ml-11">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      hojaCompleta?.ubicacion_actual 
                        ? (hojaCompleta.ubicacion_actual.toLowerCase().includes('sedeges') 
                           ? 'bg-[#555555]' 
                           : 'bg-[#555555]')
                        : 'bg-[#CCCCCC]'
                    }`}></div>
                    <p className="text-lg font-medium text-[#1A1A1A]">
                      {hojaCompleta?.ubicacion_actual || 'Sin ubicación definida'}
                    </p>
                  </div>
                  {hojaCompleta?.responsable_actual && (
                    <p className="text-[#888888] text-sm mt-1 ml-5">
                      Responsable: {hojaCompleta.responsable_actual}
                    </p>
                  )}
                </div>
              </div>
              
              <p className="text-[#555555] text-base mb-2">{obtenerEstadoActual().descripcion}</p>
              <div className="flex items-center gap-4 text-sm text-[#888888]">
                {obtenerEstadoActual().valor === 'pendiente' && (
                  <span className="flex items-center gap-2">
                    <RelojIcon width={16} height={16} fill="currentColor" />
                    Esperando atención
                  </span>
                )}
                {obtenerEstadoActual().valor === 'enviada' && (
                  <span className="flex items-center gap-2">
                    <SendIcon width={16} height={16} fill="currentColor" />
                    Documento enviado
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

          {/* Historial y cambio de estado fijo */}
          <div className="flex flex-col items-end gap-4 text-[#888888]">
            <div className="flex items-center gap-2">
              <HistorialIcon width={20} height={20} fill="#555555" />
              <span className="text-sm">
                Actualizado {hojaCompleta?.fecha_modificacion ? new Date(hojaCompleta.fecha_modificacion).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            
            {/* Menú desplegable para cambio de estado - FIJO */}
            <div className="bg-[#F7F7F7] p-4 min-w-[200px]">
              <label className="block text-xs font-medium text-[#555555] mb-2">
                Cambiar Estado
              </label>
              <select
                value={hojaCompleta?.estado || 'pendiente'}
                onChange={(e) => {
                  if (e.target.value !== hojaCompleta?.estado) {
                    cambiarEstado(e.target.value);
                  }
                }}
                disabled={actualizandoEstado}
                className="w-full px-3 py-2 bg-white border border-[#CCCCCC] text-[#444444] text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:opacity-50"
              >
                {estadosDisponibles.map((estado) => (
                  <option key={estado.valor} value={estado.valor} className="bg-white text-[#444444]">
                    {estado.nombre}
                  </option>
                ))}
              </select>
              
              {actualizandoEstado && (
                <div className="flex items-center gap-2 mt-2 text-xs text-[#555555]">
                  <div className="w-3 h-3 border border-[#555555] border-t-transparent rounded-full animate-spin"></div>
                  Actualizando estado...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Información adicional del documento */}
        <div className="bg-white p-4">
          <h3 className="text-[#1A1A1A] font-medium mb-3 flex items-center gap-2">
            <ArchivoIcon width={18} height={18} fill="#555555" />
            Información del Documento
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-[#888888]">Número HR:</span>
              <p className="text-[#1A1A1A] font-medium">{hojaCompleta?.numero_hr}</p>
            </div>
            <div>
              <span className="text-[#888888]">Referencia:</span>
              <p className="text-[#1A1A1A]">{hojaCompleta?.referencia || 'Sin referencia'}</p>
            </div>
            <div>
              <span className="text-[#888888]">Fecha Límite:</span>
              <p className="text-[#1A1A1A]">{hojaCompleta?.fecha_limite ? new Date(hojaCompleta.fecha_limite).toLocaleDateString() : 'No especificada'}</p>
            </div>
            <div>
              <span className="text-[#888888]">Prioridad:</span>
              <p className="text-[#1A1A1A] capitalize">{hojaCompleta?.prioridad || 'Normal'}</p>
            </div>
          </div>
        </div>

        {/* Secciones Editables de Envío y Recepción */}
        <div className="bg-white p-4 mt-6">
          <h3 className="text-[#1A1A1A] font-medium mb-4 flex items-center gap-2">
            <SendIcon width={18} height={18} fill="#555555" />
            Gestión de Envíos y Recepciones
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sección Principal */}
            <div className="bg-[#F7F7F7] p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[#1A1A1A] font-medium text-sm">Envío Principal</h4>
                <button
                  onClick={() => abrirModalEdicion(0)}
                  className="text-[#555555] hover:text-[#444444] transition-colors"
                  title="Editar envío principal"
                >
                  <LupayIcon width={16} height={16} />
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[#888888]">Fecha:</span>
                  <p className="text-[#1A1A1A]">{hojaCompleta?.fecha_creacion ? new Date(hojaCompleta.fecha_creacion).toLocaleDateString() : 'No registrada'}</p>
                </div>
                <div>
                  <span className="text-[#888888]">Destino:</span>
                  <p className="text-[#1A1A1A]">{hojaCompleta?.destino || 'No especificado'}</p>
                </div>
                <div>
                  <span className="text-[#888888]">Instrucciones:</span>
                  <p className="text-[#1A1A1A]">{hojaCompleta?.destinos?.join(', ') || 'Ninguna'}</p>
                </div>
              </div>
            </div>

            {/* Secciones Adicionales 1, 2, 3 */}
            {[1, 2, 3].map(seccion => (
              <div key={seccion} className="bg-[#F7F7F7] p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[#1A1A1A] font-medium text-sm">Recepción {seccion}</h4>
                  <button
                    onClick={() => abrirModalEdicion(seccion)}
                    className="text-[#555555] hover:text-[#444444] transition-colors"
                    title={`Editar recepción ${seccion}`}
                  >
                    <LupayIcon width={16} height={16} />
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[#888888]">Fecha:</span>
                    <p className="text-[#1A1A1A]">{hojaCompleta?.[`fecha_recepcion_${seccion}`] || 'No registrada'}</p>
                  </div>
                  <div>
                    <span className="text-[#888888]">Destino:</span>
                    <p className="text-[#1A1A1A]">{hojaCompleta?.[`destino_${seccion}`] || 'No especificado'}</p>
                  </div>
                  <div>
                    <span className="text-[#888888]">Instrucciones:</span>
                    <p className="text-[#1A1A1A]">{hojaCompleta?.[`destinos_${seccion}`]?.join(', ') || 'Ninguna'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vista previa para PDF */}
      <div className="bg-white overflow-hidden" ref={printRef}>
        <div className="p-0">
          {hojaCompleta && <HojaRutaPreview data={hojaCompleta} />}
        </div>
      </div>

      {/* Modal de Cambio de Ubicación - Diseño Mejorado */}
      {showUbicacionModal && createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 transform transition-all duration-300 scale-100">
            {/* Header del Modal */}
            <div className="bg-linear-to-r from-slate-700 to-slate-800 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                    <LupayIcon width={24} height={24} fill="white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Cambiar Ubicación del Documento</h2>
                    <p className="text-slate-200 text-sm">Actualizar la ubicación actual y responsable</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUbicacionModal(false)}
                  className="text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6">
              {/* Información Actual */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                <h3 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                  Ubicación Actual
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Ubicación:</span>
                    <p className="font-medium text-slate-800">{hojaCompleta?.ubicacion_actual || 'No definida'}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Responsable:</span>
                    <p className="font-medium text-slate-800">{hojaCompleta?.responsable_actual || 'No asignado'}</p>
                  </div>
                </div>
              </div>

              {/* Formulario de Nueva Ubicación */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    📍 Nueva Ubicación
                  </label>
                  <select
                    id="nuevaUbicacion"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-slate-500/20 focus:border-slate-500 transition-all bg-white text-slate-800 font-medium"
                    defaultValue=""
                  >
                    <option value="" className="text-slate-500">-- Seleccionar nueva ubicación --</option>
                    <optgroup label="🏢 Ubicaciones Principales" className="font-medium">
                      <option value="SEDEGES - Sede Central" className="text-slate-800">SEDEGES - Sede Central</option>
                      <option value="ARCHIVO GENERAL" className="text-slate-800">Archivo General</option>
                      <option value="ENTIDAD EXTERNA" className="text-slate-800">Entidad Externa</option>
                    </optgroup>
                    <optgroup label="🏠 Centros de Acogida" className="font-medium">
                      {destinos.filter(d => d.tipo === 'centro_acogida').map((destino) => (
                        <option key={destino.id} value={destino.nombre} className="text-slate-800">
                          {destino.nombre}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🏛️ Direcciones Administrativas" className="font-medium">
                      {destinos.filter(d => d.tipo === 'direccion').map((destino) => (
                        <option key={destino.id} value={destino.nombre} className="text-slate-800">
                          {destino.nombre}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    👤 Responsable
                  </label>
                  <input
                    type="text"
                    id="responsable"
                    placeholder="Nombre del nuevo responsable"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-slate-500/20 focus:border-slate-500 transition-all bg-white text-slate-800 font-medium"
                  />
                  <p className="text-xs text-slate-500 mt-1">Ingresa el nombre completo del responsable</p>
                </div>
              </div>
              
              {/* Botones de Acción */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setShowUbicacionModal(false)}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    const selectElement = document.getElementById('nuevaUbicacion') as HTMLSelectElement;
                    const responsableElement = document.getElementById('responsable') as HTMLInputElement;
                    
                    if (selectElement?.value && responsableElement?.value) {
                      cambiarUbicacion(selectElement.value, responsableElement.value);
                      setShowUbicacionModal(false);
                    } else {
                      toast.error('Por favor seleccione una ubicación y responsable');
                    }
                  }}
                  disabled={actualizandoEstado}
                  className="px-6 py-3 bg-linear-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {actualizandoEstado ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <LupayIcon width={16} height={16} fill="white" />
                      Confirmar Cambio
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal de Edición */}
      {showEditModal && <ModalEdicionSeccion />}
      
      {/* Modal de Edición Completa */}
      {showEditCompleteModal && <ModalEdicionCompleta />}
    </div>
  );
};

export default HojaRutaDetalleView;

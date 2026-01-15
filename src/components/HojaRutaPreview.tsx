import React from 'react';
import SedegesLogo from './SedegesLogo';

interface HojaRutaPreviewProps {
  data: any;
}

const destinosOptions = [
  'Para su conocimiento',
  'Analizar y emitir opinión',
  'Dar curso si legalmente es procedente',
  'Proceder de acuerdo a normas',
  'Preparar respuesta o informe',
  'Elaborar Resolución',
  'Elaborar Contrato',
  'Concertar reunión',
  'Asistir a reunión, invitación en mi representación',
  'Archivar'
];

const destinosSeccionesAdicionalesOptions = [
  'Para su conocimiento',
  'Preparar respuesta o informe',
  'Analizar y emitir opinión',
  'Procesar de acuerdo a normas',
  'Dar curso si legalmente es procedente',
  'Elaborar Resolución',
  'Elaborar Contrato',
  'Archivar'
];

const HojaRutaPreview: React.FC<HojaRutaPreviewProps> = ({ data }) => {
  // data puede venir de formData (creación) o de la BD (detalle)
  // Normalizar campos para que existan todos
  const hoja = {
    numero_hr: data.numero_hr || '',
    referencia: data.referencia || '',
    prioridad: data.prioridad || '',
    procedencia: data.procedencia || '',
    nombre_solicitante: data.nombre_solicitante || '',
    telefono_celular: data.telefono_celular || '',
    fecha_documento: data.fecha_documento || '',
    fecha_ingreso: data.fecha_ingreso || '',
    cite: data.cite || '',
    numero_fojas: data.numero_fojas || '',
    destino_principal: data.destino_principal || '',
    destinos: data.destinos || [],
    instrucciones_adicionales: data.instrucciones_adicionales || data.observaciones || '',
    // Secciones adicionales (si existen)
    fecha_recepcion_1: data.fecha_recepcion_1 || '',
    destino_1: data.destino_1 || '',
    destinos_1: data.destinos_1 || [],
    instrucciones_adicionales_1: data.instrucciones_adicionales_1 || '',
    fecha_recepcion_2: data.fecha_recepcion_2 || '',
    destino_2: data.destino_2 || '',
    destinos_2: data.destinos_2 || [],
    instrucciones_adicionales_2: data.instrucciones_adicionales_2 || '',
    fecha_recepcion_3: data.fecha_recepcion_3 || '',
    destino_3: data.destino_3 || '',
    destinos_3: data.destinos_3 || [],
    instrucciones_adicionales_3: data.instrucciones_adicionales_3 || '',
  };

  return (
    <div className="flex justify-center w-full" style={{ background: 'transparent' }}>
      <div
        className="bg-white shadow-lg"
        style={{ background: '#fff', color: '#222', width: '100%', maxWidth: 1100, borderRadius: 12 }}
      >
        <div className="p-6 w-full">
        <div className="text-center mb-4">
          <div className="flex items-start justify-between mb-2">
            <SedegesLogo width={80} height={80} className="mt-2" />
            <div className="flex-1 text-center">
              <h2 className="text-lg font-bold">SERVICIO DEPARTAMENTAL DE GESTIÓN SOCIAL</h2>
              <h3 className="text-xl font-bold">HOJA DE RUTA</h3>
            </div>
            <div className="text-right">
              <div className="border border-black p-1 min-w-[120px]">
                <p className="text-xs font-bold text-center">NÚMERO H.R.</p>
                <p className="text-center text-sm">{hoja.numero_hr || '........................'}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Tabla principal */}
        <table className="w-full border-collapse border border-black text-xs">
          <tbody>
            <tr>
              <td className="border border-black bg-gray-100 p-1 font-bold w-20">REFERENCIA</td>
              <td className="border border-black p-1 w-96">{hoja.referencia}</td>
              <td className="border border-black bg-gray-100 p-1 w-20 text-center">
                <div className="space-y-1">
                  <div>
                    <input type="checkbox" checked={hoja.prioridad === 'urgente'} readOnly className="mr-1" />
                    URGENTE
                  </div>
                  <div>
                    <input type="checkbox" checked={hoja.prioridad === 'prioritario'} readOnly className="mr-1" />
                    PRIORITARIO
                  </div>
                  <div>
                    <input type="checkbox" checked={hoja.prioridad === 'rutinario'} readOnly className="mr-1" />
                    RUTINARIO
                  </div>
                  <div>
                    <input type="checkbox" checked={hoja.prioridad === 'otros'} readOnly className="mr-1" />
                    OTROS
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-black bg-gray-100 p-1 font-bold">PROCEDENCIA</td>
              <td className="border border-black p-1" colSpan={2}>{hoja.procedencia}</td>
            </tr>
            <tr>
              <td className="border border-black bg-gray-100 p-1 font-bold">NOMBRE SOLICITANTE</td>
              <td className="border border-black p-1">{hoja.nombre_solicitante}</td>
              <td className="border border-black p-1">
                <div className="flex">
                  <span className="bg-gray-100 font-bold pr-2">TEL:</span>
                  <span>{hoja.telefono_celular}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-black bg-gray-100 p-1 font-bold">FECHA DE DOCUMENTO</td>
              <td className="border border-black p-1">{hoja.fecha_documento}</td>
              <td className="border border-black p-1"></td>
            </tr>
            <tr>
              <td className="border border-black bg-gray-100 p-1 font-bold">FECHA DE INGRESO</td>
              <td className="border border-black p-1">{hoja.fecha_ingreso}</td>
              <td className="border border-black p-1"></td>
            </tr>
            <tr>
              <td className="border border-black bg-gray-100 p-1 font-bold">CITE:</td>
              <td className="border border-black p-1">{hoja.cite}</td>
              <td className="border border-black p-1">
                <span className="font-bold">No. FOJAS:</span> {hoja.numero_fojas}
              </td>
            </tr>
          </tbody>
        </table>
        {/* IMPORTANTE */}
        <div className="border border-black border-t-0">
          <div className="bg-gray-100 p-2">
            <span className="text-sm font-bold">IMPORTANTE</span>
          </div>
          <div className="p-2">
            <ul className="list-disc ml-4 text-xs space-y-1">
              <li>La Hoja de Ruta debe encabezar todos los documentos en cualquier tipo de trámites.</li>
              <li>A través de la hoja de ruta se podrá determinar dónde está la obstaculización, retraso u otras anomalías</li>
              <li>Todo trámite debe ser atendido en plazos mínimos establecidos</li>
            </ul>
          </div>
        </div>
        {/* DESTINO principal */}
        <div className="border border-black border-t-0">
          <div className="bg-gray-100 p-1">
            <span className="text-sm font-bold">DESTINO</span>
          </div>
          <div className="border-b border-black p-1">
            <div className="border border-gray-400 p-2 min-h-10 text-xs">
              {hoja.destino_principal || '...........................................................................'}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="border-r border-black p-1">
              <div className="space-y-1 text-xs">
                {destinosOptions.map((destino) => (
                  <div key={destino}>
                    <input type="checkbox" checked={hoja.destinos.includes(destino)} readOnly className="mr-1" />{destino}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-1">
              <div className="text-center mb-1">
                <span className="text-sm font-bold">INSTRUCCIONES ADICIONALES:</span>
              </div>
              <div className="text-xs min-h-20 p-1">
                {hoja.instrucciones_adicionales}
              </div>
              <div className="mt-2 text-center text-xs">
                <div>Lic. Beatriz Churata Mamani</div>
                <div className="font-bold">Directora Técnica</div>
                <div className="font-bold">SEDEGES</div>
              </div>
            </div>
          </div>
        </div>
        {/* Secciones adicionales de recepción (máximo 3) */}
        {[1,2,3].map((section) => (
          <div key={section}>
            <div className="border border-black border-t-0 p-1">
              <span className="text-xs font-bold">FECHA DE RECEPCIÓN: {hoja[`fecha_recepcion_${section}`] || '___________________________'}</span>
            </div>
            <div className="border border-black border-t-0 p-1">
              <span className="text-xs font-bold">DESTINO: {hoja[`destino_${section}`] || '......................................................................'}</span>
            </div>
            <div className="border border-black border-t-0">
              <div className="grid grid-cols-2">
                <div className="border-r border-black p-1">
                  <div className="space-y-1 text-xs">
                    {destinosSeccionesAdicionalesOptions.map((destino) => (
                      <div key={destino}>
                        <input type="checkbox" checked={hoja[`destinos_${section}`]?.includes(destino)} readOnly className="mr-1" />{destino}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-1">
                  <div className="text-xs">
                    <div className="font-bold mb-1">Instrucciones Adicionales:</div>
                    <div className="min-h-20">
                      {hoja[`instrucciones_adicionales_${section}`] ? (
                        <div className="whitespace-pre-wrap">{hoja[`instrucciones_adicionales_${section}`]}</div>
                      ) : (
                        <div>
                          <div>...................................................................</div>
                          <div>...................................................................</div>
                          <div>...................................................................</div>
                          <div>...................................................................</div>
                          <div>...................................................................</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default HojaRutaPreview;

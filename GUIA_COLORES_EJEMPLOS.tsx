/**
 * GUÍA DE COLORES - EJEMPLOS DE USO EN TAILWIND
 * 
 * Paleta Minimalista Profesional para Sistema SEDEGES
 */

// ============================================================
// 1. FONDOS Y CONTENEDORES
// ============================================================

// Fondo de página
<div className="bg-[var(--color-fondo-casi-blanco)]">
  {/* Fondo principal, muy claro */}
</div>

// Card o contenedor principal
<div className="bg-[var(--color-fondo-blanco)] border border-[var(--color-gris-300)] rounded-lg p-4">
  {/* Fondo blanco puro, borde sutil */}
</div>

// Sección destacada
<div className="bg-[var(--color-gris-100)]">
  {/* Fondo gris muy claro */}
</div>

// ============================================================
// 2. TEXTO
// ============================================================

// Texto principal (encabezados)
<h1 className="text-[var(--color-gris-900)]">Título Principal</h1>

// Texto regular
<p className="text-[var(--color-gris-800)]">Contenido normal</p>

// Texto secundario/muted
<p className="text-[var(--color-gris-600)]">Información secundaria</p>

// Texto débil
<p className="text-[var(--color-gris-500)]">Texto muy suave</p>

// ============================================================
// 3. BOTONES
// ============================================================

// Botón primario
<button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-4 py-2 rounded-lg transition-colors">
  Acción Principal
</button>

// Botón secundario
<button className="bg-[var(--color-gris-200)] hover:bg-[var(--color-gris-300)] text-[var(--color-gris-800)] px-4 py-2 rounded-lg transition-colors">
  Acción Secundaria
</button>

// Botón deshabilitado
<button disabled className="bg-[var(--color-gris-300)] text-[var(--color-gris-500)] px-4 py-2 rounded-lg cursor-not-allowed">
  Deshabilitado
</button>

// ============================================================
// 4. INDICADORES DE PRIORIDAD
// ============================================================

// Prioridad CRÍTICA (Rojo profesional)
<div className="bg-[var(--color-priority-critical)] text-white px-3 py-1 rounded-md border-2 border-[#A83838]">
  Crítica
</div>

// Prioridad ALTA (Naranja profesional)
<div className="bg-[var(--color-priority-high)] text-white px-3 py-1 rounded-md border-2 border-[#D4883C]">
  Alta
</div>

// Prioridad MEDIA (Azul profesional)
<div className="bg-[var(--color-priority-medium)] text-white px-3 py-1 rounded-md border-2 border-[#3E5FA8]">
  Media
</div>

// Prioridad BAJA (Verde profesional)
<div className="bg-[var(--color-priority-low)] text-white px-3 py-1 rounded-md border-2 border-[#5A9A68]">
  Baja
</div>

// ============================================================
// 5. ESTADOS Y ALERTAS
// ============================================================

// Alerta de éxito
<div className="bg-[var(--color-priority-low)] bg-opacity-20 border-l-4 border-[var(--color-priority-low)] p-4 rounded">
  <p className="text-[var(--color-priority-low)] font-medium">✓ Operación exitosa</p>
</div>

// Alerta de advertencia
<div className="bg-[var(--color-priority-high)] bg-opacity-20 border-l-4 border-[var(--color-priority-high)] p-4 rounded">
  <p className="text-[var(--color-priority-high)] font-medium">⚠ Advertencia</p>
</div>

// Alerta de error
<div className="bg-[var(--color-priority-critical)] bg-opacity-20 border-l-4 border-[var(--color-priority-critical)] p-4 rounded">
  <p className="text-[var(--color-priority-critical)] font-medium">✕ Error</p>
</div>

// Alerta informativa
<div className="bg-[var(--color-primary)] bg-opacity-20 border-l-4 border-[var(--color-primary)] p-4 rounded">
  <p className="text-[var(--color-primary)] font-medium">ⓘ Información</p>
</div>

// ============================================================
// 6. TABLAS
// ============================================================

// Header de tabla
<table>
  <thead>
    <tr className="bg-[var(--color-gris-100)] border-b-2 border-[var(--color-gris-300)]">
      <th className="p-3 text-left text-[var(--color-gris-700)]">Columna</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-[var(--color-gris-300)] hover:bg-[var(--color-gris-100)]">
      <td className="p-3 text-[var(--color-gris-800)]">Datos</td>
    </tr>
  </tbody>
</table>

// ============================================================
// 7. BADGES Y ETIQUETAS
// ============================================================

// Badge con borde
<span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-[var(--color-primary)] text-white border-2 border-[var(--color-primary-dark)]">
  Etiqueta
</span>

// Badge de estado
<span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-[var(--color-priority-medium)] text-white border-2 border-[var(--color-primary-dark)]">
  Procesando
</span>

// ============================================================
// 8. INPUTS Y FORMULARIOS
// ============================================================

// Input normal
<input 
  type="text"
  className="w-full px-4 py-2 border border-[var(--color-gris-300)] rounded-lg focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20 outline-none transition-colors text-[var(--color-gris-800)] placeholder-[var(--color-gris-400)]"
  placeholder="Ingresa aquí..."
/>

// Input con error
<input 
  type="text"
  className="w-full px-4 py-2 border-2 border-[var(--color-priority-critical)] rounded-lg text-[var(--color-gris-800)] bg-[var(--color-priority-critical)] bg-opacity-5"
/>

// Input con éxito
<input 
  type="text"
  className="w-full px-4 py-2 border-2 border-[var(--color-priority-low)] rounded-lg text-[var(--color-gris-800)] bg-[var(--color-priority-low)] bg-opacity-5"
/>

// ============================================================
// 9. CARDS CON INDICADORES
// ============================================================

// Card con indicador izquierdo
<div className="bg-[var(--color-fondo-blanco)] border-l-4 border-[var(--color-priority-high)] p-4 rounded-lg">
  <h3 className="text-[var(--color-gris-900)] font-bold">Título</h3>
  <p className="text-[var(--color-gris-600)] mt-2">Descripción</p>
</div>

// ============================================================
// 10. GRADIENTES
// ============================================================

// Gradiente primario
<div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white p-6">
  Contenido con gradiente
</div>

// ============================================================
// COLORES COMPLETOS - REFERENCIA RÁPIDA
// ============================================================

/*
FONDOS:
  --color-fondo-casi-blanco: #F7F7F7
  --color-fondo-blanco: #FFFFFF

GRISES (escala):
  --color-gris-100: #F5F5F5 (muy claro)
  --color-gris-200: #EFEFEF
  --color-gris-300: #E5E5E5 (bordes)
  --color-gris-400: #D0D0D0
  --color-gris-500: #B0B0B0 (secundario)
  --color-gris-600: #808080
  --color-gris-700: #505050
  --color-gris-800: #303030 (texto principal)
  --color-gris-900: #1A1A1A (muy oscuro)

PRIMARIOS:
  --color-primary: #5B8DEE (azul principal)
  --color-primary-dark: #3E5FA8 (hover)
  --color-primary-light: #8AABF0 (claro)

PRIORIDADES:
  --color-priority-critical: #C84C4C (rojo)
  --color-priority-high: #E8A87C (naranja)
  --color-priority-medium: #5B8DEE (azul)
  --color-priority-low: #6BAA75 (verde)

ESTADOS:
  --color-success: #6BAA75
  --color-warning: #E8A87C
  --color-error: #C84C4C
  --color-info: #5B8DEE
*/

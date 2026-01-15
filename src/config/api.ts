// API Configuration - Centralized URL and defaults
const API_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');

export const API_ENDPOINTS = {
  AUTH_LOGIN: `${API_URL}/api/auth/login`,
  AUTH_LOGOUT: `${API_URL}/api/auth/logout`,
  AUTH_VERIFY: `${API_URL}/api/auth/verify`,
  AUTH_REFRESH: `${API_URL}/api/auth/refresh`,
  
  HOJAS_RUTA: `${API_URL}/api/hojas-ruta`,
  HOJAS_RUTA_DETALLE: (id: number) => `${API_URL}/api/hojas-ruta/${id}`,
  HOJAS_RUTA_ESTADISTICAS: `${API_URL}/api/hojas-ruta/estadisticas/dashboard`,
  HOJAS_RUTA_DASHBOARD: `${API_URL}/api/hojas-ruta/dashboard/tiempo-real`,
  HOJAS_RUTA_POR_VENCER: `${API_URL}/api/hojas-ruta/por-vencer/lista`,

  PROGRESO_ADD: `${API_URL}/api/progreso/agregar`,
  PROGRESO_ADD_MULTIPLE: `${API_URL}/api/progreso/agregar-multiple`,
  PROGRESO_HISTORIAL: (hojaId: number) => `${API_URL}/api/progreso/historial/${hojaId}`,
  LOCACIONES: `${API_URL}/api/locaciones`,
  
  ENVIOS: `${API_URL}/api/enviar`,
  ENVIOS_ESTADO: (id: number) => `${API_URL}/api/enviar/${id}/estado`,
  DESTINOS: `${API_URL}/api/enviar/destinos`,
  DESTINOS_PUBLIC: `${API_URL}/api/destinos`,
  
  NOTIFICACIONES: `${API_URL}/api/notificaciones`,
  HISTORIAL: `${API_URL}/api/historial`
};

export const apiConfig = {
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  
  endpoints: {
    // Auth
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    verify: '/api/auth/verify',
    refresh: '/api/auth/refresh',
    
    // Hojas de Ruta
    hojasRuta: '/api/hojas-ruta',
    hojaRutaDetalle: (id: number) => `/api/hojas-ruta/${id}`,
    hojaRutaEstadisticas: '/api/hojas-ruta/estadisticas/dashboard',
    hojaRutaDashboard: '/api/hojas-ruta/dashboard/tiempo-real',
    hojaRutaPorVencer: '/api/hojas-ruta/por-vencer/lista',

    // Progreso
    progresoAdd: '/api/progreso/agregar',
    progresoAddMultiple: '/api/progreso/agregar-multiple',
    progresoHistorial: (hojaId: number) => `/api/progreso/historial/${hojaId}`,
    locaciones: '/api/locaciones',
    
    // Envíos
    envios: '/api/enviar',
    envioEstado: (id: number) => `/api/enviar/${id}/estado`,
    destinos: '/api/enviar/destinos',
    destinosPublic: '/api/destinos',
    
    // Otros
    notificaciones: '/api/notificaciones',
    historial: '/api/historial'
  },
  
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
};

export default apiConfig;

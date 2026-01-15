import axios, { AxiosError } from 'axios';
import logger from './logger';

export interface ApiError {
  message: string;
  code: string;
  status?: number;
  details?: any;
}

export const handleAxiosError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    
    logger.error('API Error:', {
      status: axiosError.response?.status,
      message: axiosError.message,
      data: axiosError.response?.data
    });

    return {
      message: axiosError.response?.data?.error || axiosError.message || 'Error desconocido',
      code: axiosError.response?.data?.code || 'UNKNOWN_ERROR',
      status: axiosError.response?.status,
      details: axiosError.response?.data
    };
  }

  // Error no relacionado con Axios
  const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
  logger.error('Non-Axios Error:', errorMessage);

  return {
    message: errorMessage,
    code: 'CLIENT_ERROR'
  };
};

// Mensajes amigables para el usuario según el tipo de error
export const getUserFriendlyMessage = (error: ApiError): string => {
  switch (error.code) {
    case 'NO_TOKEN':
      return 'Por favor inicie sesión';
    case 'TOKEN_EXPIRED':
      return 'Su sesión ha expirado. Por favor inicie sesión nuevamente';
    case 'INVALID_TOKEN':
      return 'Token inválido. Por favor inicie sesión';
    case 'NO_USER':
      return 'Usuario no encontrado';
    case 'USER_NOT_FOUND':
      return 'Usuario no encontrado en el sistema';
    case 'INVALID_CREDENTIALS':
      return 'Usuario o contraseña incorrectos';
    case 'FORBIDDEN':
      return 'No tiene permisos para realizar esta acción';
    case 'PAYLOAD_TOO_LARGE':
      return 'El archivo es muy grande';
    case 'SUSPICIOUS_INPUT':
      return 'Entrada de datos sospechosa detectada';
    case 'VALIDATION_ERROR':
      return 'Los datos proporcionados son inválidos';
    default:
      if (error.status === 500) {
        return 'Error del servidor. Por favor intente más tarde';
      }
      if (error.status === 503) {
        return 'Servicio no disponible. Por favor intente más tarde';
      }
      if (!navigator.onLine) {
        return 'Sin conexión a internet';
      }
      return error.message || 'Ocurrió un error inesperado';
  }
};

// Log detallado de errores para debugging
export const logDetailedError = (error: ApiError, context: string) => {
  logger.error(`Error en ${context}:`, {
    message: error.message,
    code: error.code,
    status: error.status,
    timestamp: new Date().toISOString(),
    context,
    details: error.details
  });
};

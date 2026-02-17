import axios, { type AxiosError } from 'axios';

/**
 * Normaliza mensajes de error del backend para que siempre devuelvan un string legible.
 * Compatible con respuestas de class-validator, errores de red, timeouts, y errores genéricos de Axios.
 * Acepta errores de React Query (unknown) y valida internamente si es un AxiosError.
 */
export function parseErrorMessage(error: unknown): string {
  // Si no es un AxiosError, retornar mensaje genérico
  if (!axios.isAxiosError(error)) {
    // Si es un Error estándar con mensaje, usarlo
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return 'Ocurrió un error inesperado. Por favor, intenta de nuevo.';
  }

  // A partir de aquí sabemos que es un AxiosError
  const axiosError = error as AxiosError;
  const data = axiosError?.response?.data as any;
  const status = axiosError?.response?.status;

  // Error de red (sin conexión, servidor caído, etc.)
  if (axiosError.code === 'ERR_NETWORK' || !axiosError.response) {
    return 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
  }

  // Timeout
  if (axiosError.code === 'ECONNABORTED' || axiosError.message?.includes('timeout')) {
    return 'La solicitud tardó demasiado tiempo. Intenta de nuevo.';
  }

  // Errores del servidor (500+)
  if (status && status >= 500) {
    return 'Error del servidor. Por favor, intenta más tarde.';
  }

  // 4. Intentar extraer mensaje del backend
  let message: string | null = null;

  if (Array.isArray(data?.message)) {
    message = data.message.join('\n');
  } else if (typeof data?.message === 'object' && data?.message !== null) {
    // Si devuelve message como objeto indexado (ej: { 0: "...", 1: "..." })
    message = Object.values(data.message).join('\n');
  } else if (typeof data?.message === 'string') {
    // Si devuelve message como string simple
    message = data.message;
  }

  // Si se extrajo un mensaje del backend, retornarlo
  if (message) {
    return message;
  }

  // Fallback según status code
  if (status === 400) {
    return 'Solicitud inválida. Verifica los datos ingresados.';
  }
  if (status === 401) {
    return 'Credenciales inválidas.';
  }
  if (status === 403) {
    return 'No tienes permiso para realizar esta acción.';
  }
  if (status === 404) {
    return 'Recurso no encontrado.';
  }
  if (status === 409) {
    return 'Ya existe un registro con estos datos.';
  }

  // 7. Fallback genérico
  return 'Ocurrió un error inesperado. Por favor, intenta de nuevo.';
}


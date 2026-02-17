import axios, { type AxiosError } from 'axios';
import { toast } from 'sonner';
import { parseErrorMessage } from '../utils/parseErrorMessage.ts';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Variable para trackear si ya estamos redirigiendo
let isRedirecting = false;

function isAuthEndpoint(url?: string | null): boolean {
  if (!url) return false;

  const lower = url.toLowerCase();
  return (
    lower.includes('/auth/admins/login') ||
    lower.includes('/auth/me') ||
    lower.includes('/auth/students/login') ||
    lower.includes('/auth/students/register') ||
    lower.includes('/auth/logout') ||
    lower.includes('/dba/')
  );
}

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // Si es un AxiosError, puede tiparlo y extraer info
    if (axios.isAxiosError(error)) {
      const axiosErr = error as AxiosError;
      const url = axiosErr.config?.url ?? null;
      const status = axiosErr.response?.status;

      // Normaliza mensaje con el util
      const message = parseErrorMessage(axiosErr);

      // Si es 401 y NO es una petición de auth (login/me/refresh), redirige
      if (status === 401 && !isAuthEndpoint(url) && !isRedirecting) {
        isRedirecting = true;
        toast.dismiss()

        // Mostrar un único toast informativo
        toast.error('Tu sesión ha expirado, redirigiendo...', {
          id: 'session-expired', // ID para que no se duplique
          duration: 4000,
        });

        setTimeout(() => {
          isRedirecting = false;
          // Forzar recarga para limpiar estado de la app
          window.location.replace('/');
        }, 1500);
        // Si es 401, devolvemos una promesa vacía o pendiente para que
        // React Query se quede "esperando" y no dispare sus propios errores
        // mientras redirigimos.
        return new Promise(() => {});
      }

      // Rechaza con Error que contiene el mensaje normalizado
      return Promise.reject(new Error(message));
    }

    // Si no es un AxiosError (caso raro), rechaza tal cual
    return Promise.reject(error);
  },
);

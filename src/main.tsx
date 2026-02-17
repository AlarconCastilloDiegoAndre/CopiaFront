import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/global.css';
import { AuthProvider } from './providers/AuthProvider.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // Los datos son "frescos" por 1 minuto
      gcTime: 5 * 60 * 1000, // Limpia caché inactivo después de 5 minutos
      refetchOnWindowFocus: false, // No refetch automático al cambiar de pestaña
      refetchOnReconnect: false, // No refetch al reconectar internet
      retry: 1, // Solo 1 reintento en caso de error
    },
  },
});

const rootEtl = document.getElementById('root');

if (!rootEtl) {
  throw new Error('No se encontró el elemento #root en el DOM...');
}

const root = createRoot(rootEtl);

// Esconde la pantalla de carga inicial
const hideLoadingScreen = () => {
  const loadingScreen = document.getElementById('initial-loading-screen');
  if (!loadingScreen) return;

  // Verificar si ya se cargó la app antes en esta sesión
  const hasLoadedBefore = sessionStorage.getItem('app-loaded');

  if (hasLoadedBefore) {
    // Si ya se cargó antes (F5), remover inmediatamente (ya está oculto por el script inline)
    loadingScreen.remove();
  } else {
    // Primera carga de la sesión, mostrar animación suave
    requestAnimationFrame(() => {
      loadingScreen.style.opacity = '0';
      loadingScreen.style.transition = 'opacity 0.3s ease-out';
      setTimeout(() => {
        loadingScreen.remove();
      }, 300);
    });
    // Marcar que ya se cargó
    sessionStorage.setItem('app-loaded', 'true');
  }
};

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

hideLoadingScreen();

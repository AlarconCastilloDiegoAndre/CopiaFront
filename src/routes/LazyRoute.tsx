import { Suspense } from 'react';
import { LazyLoadBoundary } from '@components/LazyLoadBoundary';
import PageSkeleton from '@components/PageSkeleton';

interface LazyRouteProps {
  loadingMessage?: string;
  children: React.ReactNode;
}

/**
 * Componente wrapper que combina LazyLoadBoundary y Suspense
 * para simplificar la carga lazy de componentes.
 * 
 * Usa PageSkeleton en lugar de LoadingSpinner para evitar
 * doble estado de carga (spinner + skeleton del componente).
 */
export const LazyRoute = ({ children }: LazyRouteProps) => {
  return (
    <LazyLoadBoundary>
      <Suspense fallback={<PageSkeleton />}>
        {children}
      </Suspense>
    </LazyLoadBoundary>
  );
};
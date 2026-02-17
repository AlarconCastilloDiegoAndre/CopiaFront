import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

/**
 * LoadingSpinner
 *
 * Componente reutilizable para mostrar un indicador de carga.
 * Usado principalmente en Suspense fallbacks y estados de carga.
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = (
  {
    size = 'md',
    message,
  }) => {
  // Tamaños del spinner en píxeles
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[200px] py-8"
      role="status"
      aria-live="polite"
      aria-label={message || 'Cargando'}
    >
      {/* Spinner animado */}
      <div className={`${sizeClasses[size]} relative`}>
        <div
          className="absolute inset-0 border-4 border-gray-200 rounded-full"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 border-4 border-[#003d6b] border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
      </div>

      {/* Mensaje opcional */}
      {message && (
        <p className="mt-4 text-sm text-gray-600 font-medium">
          {message}
        </p>
      )}

      {/* Texto para lectores de pantalla */}
      <span className="sr-only">
        {message || 'Cargando contenido...'}
      </span>
    </div>
  );
};

export default LoadingSpinner;
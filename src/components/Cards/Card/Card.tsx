import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
};

/**
 * Card - Componente genérico para layout
 *
 * Un contenedor simple con fondo blanco, bordes redondeados y sombra.
 * Tod el contenido lo controlas tú desde el padre.
 *
 * Props:
 * - children: Contenido de la card
 * - className: Clases adicionales para personalizar
 * - padding: Espaciado interno (none, sm, md, lg)
 * - shadow: Intensidad de sombra (none, sm, md, lg)
 *
 * Ejemplo básico:
 */
const Card: React.FC<CardProps> = (
  {
    children,
    className = '',
    padding = 'md',
    shadow = 'md',
  }) => {
  // Mapeo de padding
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  // Mapeo de shadow
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const baseClasses = 'bg-white rounded-lg';
  const paddingClass = paddingClasses[padding];
  const shadowClass = shadowClasses[shadow];

  return (
    <div className={`${baseClasses} ${paddingClass} ${shadowClass} ${className}`.trim()}>
      {children}
    </div>
  );
};

export default Card;
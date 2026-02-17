import React from 'react';

type LabelProps = {
  /** Texto de la etiqueta */
  children: React.ReactNode;
  /** ID del input asociado (para accesibilidad) */
  htmlFor?: string;
  /** Si es requerido, muestra un asterisco rojo */
  required?: boolean;
  /** Texto de ayuda debajo de la etiqueta (opcional) */
  helpText?: string;
  /** Clases adicionales */
  className?: string;
};

/**
 * Label - Etiqueta consistente para formularios
 *
 * Muestra una etiqueta con el estilo estándar de la app.
 * Incluye soporte para campos requeridos y texto de ayuda.
 *
 * Ejemplos:
 *
 * // Básico
 * <Label htmlFor="name">Nombre</Label>
 * <input id="name" />
 *
 * // Campo requerido
 * <Label htmlFor="email" required>Correo electrónico</Label>
 *
 * // Con texto de ayuda
 * <Label htmlFor="password" helpText="Mínimo 8 caracteres">
 *   Contraseña
 * </Label>
 */
const Label: React.FC<LabelProps> = (
  {
    children,
    htmlFor,
    required = false,
    helpText,
    className = '',
  }) => {
  const baseClasses = 'block text-sm font-semibold text-gray-700 mb-2';

  return (
    <div className="mb-2">
      <label
        htmlFor={htmlFor}
        className={`${baseClasses} ${className}`.trim()}
      >
        {children}
        {required && (
          <span className="text-red-600 ml-1" aria-label="requerido">
            *
          </span>
        )}
      </label>

      {helpText && (
        <p className="text-xs text-gray-500 mt-1">
          {helpText}
        </p>
      )}
    </div>
  );
};

export default Label;
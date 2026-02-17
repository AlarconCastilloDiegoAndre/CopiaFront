import React from 'react';
import { Button as HButton } from '@headlessui/react';

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  variant?: 'primary';
  isLoading?: boolean;
  className?: string;
};

const Button: React.FC<ButtonProps> = (
  {
    children,
    variant = 'primary',
    isLoading = false,
    disabled = false,
    className = '',
    type = 'button',
    ...rest
  }) => {
  const isDisabled = disabled || isLoading;

  // Clases base compartidas
  const baseClasses = [
    'inline-flex items-center justify-center',
    'w-full',
    'rounded-md px-6 py-3',
    'text-sm font-bold',
    'transition-colors duration-150',
    'focus-ring-global',
    'focus-visible:ring-[#005A9C]',
  ].join(' ');

  // Variant: primary (brand)
  // //Primary: fondo marca, texto blanco
  const variantClasses =
    variant === 'primary'
      ? 'bg-main-color hover:bg-base-700 text-white'
      : '';

  // Disabled / loading styles
  const disabledClasses = isDisabled ? 'opacity-70 cursor-not-allowed hover:bg-none' : '';

  // Compose final className
  const finalClassName = `${baseClasses} ${variantClasses} ${disabledClasses} ${className}`.trim();

  return (
    <HButton
      as="button"
      type={type}
      className={finalClassName}
      disabled={isDisabled}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading ? (
        // Spinner (solo visible cuando isLoading = true)
        <span className="inline-flex items-center gap-2">
          <span
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
            aria-hidden="true"
          />
          <span className="sr-only">Cargando</span>
        </span>
      ) : (
        children
      )}
    </HButton>
  );
};

export default Button;
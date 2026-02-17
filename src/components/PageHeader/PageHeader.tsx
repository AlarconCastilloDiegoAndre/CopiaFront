import React, { memo } from 'react'; // 1. Importa 'memo'
import { IconBox } from '@components/IconBox';

type PageHeaderProps = {
  title: string;
  icon?: React.ReactNode;
  imageSrc?: string;
  iconBgColor?: string;
  iconSize?: 'sm' | 'md' | 'lg';
  subtitle?: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  actions?: React.ReactNode;
};

const PageHeader: React.FC<PageHeaderProps> = memo((
  {
    title,
    icon,
    imageSrc,
    iconBgColor,
    iconSize = 'md',
    subtitle,
    as: Component = 'h1',
    className = '',
    actions,
  }) => {
  const textSizeClasses = {
    h1: 'text-2xl',
    h2: 'text-xl',
    h3: 'text-lg',
    h4: 'text-base',
    h5: 'text-sm',
    h6: 'text-sm',
  };

  const sizeClass = textSizeClasses[Component];

  const renderIcon = () => {
    if (!icon && !imageSrc) return null;

    if (imageSrc) {
      return (
        <IconBox
          icon={<img src={imageSrc} alt="" className="w-7 h-7 object-contain" />}
          size={iconSize}
          bgColor={iconBgColor}
        />
      );
    }

    return <IconBox icon={icon} size={iconSize} bgColor={iconBgColor} />;
  };

  // LAYOUT CON ACCIONES
  if (actions) {
    return (
      <div
        className={`
          flex flex-col sm:flex-row sm:items-center sm:justify-between
          gap-4 min-w-0 ${className}
        `.trim()}
      >
        {/* IZQUIERDA: Título + icono */}
        <Component
          className={`
            flex items-center gap-4 min-w-0
            leading-8 font-bold text-[#0f1724]
            ${sizeClass}
          `}
        >
          {renderIcon()}

          <span className="flex flex-col min-w-0">
            <span>{title}</span>
            {subtitle && (
              <span className="text-sm font-normal text-gray-600 mt-1">
                {subtitle}
              </span>
            )}
          </span>
        </Component>

        {/* DERECHA: Acciones */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          {actions}
        </div>
      </div>
    );
  }

  // LAYOUT SIN ACCIONES
  return (
    <Component
      className={`
        flex items-center gap-4 min-w-0
        leading-8 font-bold text-[#0f1724]
        ${sizeClass} ${className}
      `.trim()}
    >
      {renderIcon()}

      <span className="flex flex-col min-w-0">
        <span>{title}</span>
        {subtitle && (
          <span className="text-sm font-normal text-gray-600 mt-1">
            {subtitle}
          </span>
        )}
      </span>
    </Component>
  );
}); // <-- 3. Cierra el wrapper 'memo'

export default PageHeader;
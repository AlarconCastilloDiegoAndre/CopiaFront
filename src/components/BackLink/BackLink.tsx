import React from 'react';
import { Link } from 'react-router-dom';

type BackLinkProps = {
  to?: string;
  onClick?: (e?: React.MouseEvent) => void;
  children?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  title?: string;
  rel?: string;
};

/**
 * BackLink
 *
 * Pequeño componente que actúa como "volver". Usa Tailwind para estilos y mantiene
 * la API original (to, onClick, children, ariaLabel, className, title, rel).
 */
const BackLink: React.FC<BackLinkProps> = (
  {
    to,
    onClick,
    children,
    ariaLabel = 'Navegación de la sección',
    className,
    title,
    rel,
  }) => {
  // Clases base compartidas para <Link>, <a> o <button>
  const base = [
    'text-[#002B4A]',
    'inline-block',
    'mb-3',
    'font-semibold',
    'text-sm',
    'bg-none',
    'p-0',
    'cursor-pointer',
    'no-underline',
    'hover:underline',
    'focus:outline-none',
    'focus:underline',
    className ?? '',
  ].join(' ').trim();

  // Contenido: flecha + texto
  // ← Volver
  const content = (
    <>
      ← {children ?? 'Volver'}
    </>
  );

  return (
    <nav aria-label={ariaLabel}>
      {to ? (
        // Internal navigation using react-router Link
        <Link to={to} className={base} onClick={onClick} title={title} rel={rel}>
          {content}
        </Link>
      ) : (
        // If no `to`, render a semantic button that looks like a link
        <button type="button" className={base} onClick={onClick} title={title}>
          {content}
        </button>
      )}
    </nav>
  );
};

export default BackLink;
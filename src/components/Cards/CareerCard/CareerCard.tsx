import React from 'react';
import { Link } from 'react-router-dom';
import type { Career } from '@types';
import formatCareerId from '@utils/formatCareerId.ts';

interface CareerCardProps {
  career: Career;
  href: string;
}

/**
 * CareerCard
 *
 * Componente genérico que muestra una tarjeta con:
 * - un "square" lateral con el id de carrera
 * - título (nombre de la carrera),
 *
 * Accesibilidad y comportamiento:
 * - Usa Link de React Router para permitir navegación natural (click izquierdo, derecho, Ctrl+click, etc.)
 * - focus-visible aplica un anillo accesible para usuarios con teclado.
 * - Diseño responsive: horizontal en escritorio, vertical en móviles
 */
const CareerCard: React.FC<CareerCardProps> = ({ career, href }) => {
  return (
    <Link
      to={href}
      className="
        bg-white rounded-lg shadow-md overflow-hidden
        flex items-stretch w-full h-25 min-h-[80px]
        transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg
        cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9C] focus-visible:ring-offset-2
        no-underline
      "
      aria-label={`Abrir carrera ${career.name}`}
    >
      {/* Square lateral - siempre a la izquierda */}
      <div
        className="
          w-[72px] sm:w-[120px] min-w-[72px] sm:min-w-[96px] flex-shrink-0
          bg-main-color text-white
          flex items-center justify-center font-extrabold
          text-sm sm:text-[1.25rem] tracking-tight
          rounded-l-lg
        "
        aria-hidden="true"
      >
        {formatCareerId(career.careerId)}
      </div>

      {/* Contenido principal */}
      <div className="px-4 sm:px-5 py-3 sm:py-4 flex flex-col justify-center gap-1 w-full min-w-0">
        <h3
          className="text-sm sm:text-[17px] leading-[1.3] font-semibold text-[#111827] break-words sm:truncate m-0"
          title={career.name}
        >
          {career.name}
        </h3>
      </div>
    </Link>
  );
};

export default CareerCard;
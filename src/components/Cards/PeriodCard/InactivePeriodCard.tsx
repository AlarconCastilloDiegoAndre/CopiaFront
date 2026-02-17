import { FaCalendarAlt } from 'react-icons/fa';
import { SquarePen, Trash } from 'lucide-react';
import type { Period } from '@types';
import { formatDate } from '@utils/formatDate.ts';

interface InactivePeriodCardProps {
  period: Period;
  onEdit: (period: Period) => void;
  onDelete: (period: Period) => void;
}

// Clases estáticas
const CONTENT_CLASSES = 'flex sm:items-center justify-between w-full gap-3 sm:gap-4';
const ACTIONS_WRAPPER_CLASSES = 'flex gap-2 items-center justify-center flex-shrink-0';
const ACTION_BTN_BASE = 'inline-flex items-center justify-center p-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9C]';

const InactivePeriodCard = ({ period, onEdit, onDelete }: InactivePeriodCardProps) => {
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg w-full p-4 overflow-hidden hover:bg-gray-50 transition-colors">
      {/* Fila 1: Badge del Periodo (solo móvil) */}
      <div className="flex sm:hidden items-center gap-2 mb-3 w-full">
        <span className="text-xs font-medium uppercase text-gray-500 flex-shrink-0">Periodo</span>
        <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 flex-1">
          <FaCalendarAlt size={14} />
          <span className="text-sm font-semibold">{period.periodId}</span>
        </div>
      </div>

      {/* Fila 2: Resto del contenido */}
      <div className={CONTENT_CLASSES}>
        {/* Contenido Principal */}
        <div className="flex flex-col sm:flex-row sm:items-stretch gap-3 sm:gap-4 flex-1 min-w-0">

          {/* Icono y ID del Periodo (solo desktop) */}
          <div className="hidden sm:flex sm:flex-col items-center justify-center gap-0 flex-shrink-0">
            <span className="text-xs font-medium uppercase text-gray-500 mb-1">Periodo</span>
            <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800">
              <FaCalendarAlt size={14} />
              <span className="text-sm font-semibold">{period.periodId}</span>
            </div>
          </div>

          {/* Fechas */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 flex-1 min-w-0">
            {/* Fecha Inicio */}
            <div className="flex flex-col justify-center flex-1 min-w-0">
              <span className="text-xs font-medium uppercase text-gray-500 mb-1">Fecha de apertura</span>
              <span className="text-base font-semibold text-gray-900">
                {formatDate(period.startDate)}
              </span>
            </div>

            {/* Fecha Fin */}
            <div className="flex flex-col justify-center flex-1 min-w-0">
              <span className="text-xs font-medium uppercase text-gray-500 mb-1">Fecha de cierre</span>
              <span className="text-base font-semibold text-gray-900">
                {formatDate(period.endDate)}
              </span>
            </div>
          </div>

          {/* Estado */}
          <div
            className="flex flex-row sm:flex-col items-center justify-start sm:justify-center gap-2 sm:gap-0 flex-shrink-0">
            <span className="text-xs font-medium uppercase text-gray-500 sm:mb-1">Estado</span>
            <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-600">
              Inactivo
            </span>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className={ACTIONS_WRAPPER_CLASSES}>
          <button
            onClick={() => onEdit(period)}
            className={`${ACTION_BTN_BASE} text-main-color hover:bg-main-color/10`}
            aria-label="Editar periodo"
            title="Editar fechas del periodo"
            type="button"
          >
            <SquarePen size={20} />
          </button>

          <button
            onClick={() => onDelete(period)}
            className={`${ACTION_BTN_BASE} text-red-600 hover:bg-red-600/10`}
            aria-label="Eliminar periodo"
            title="Eliminar periodo"
            type="button"
          >
            <Trash size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InactivePeriodCard;
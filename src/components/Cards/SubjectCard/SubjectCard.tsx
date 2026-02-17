import { memo } from 'react';
import type { Subject } from '@types';
import { SquarePen, Trash } from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
}

// Clases estáticas - actualizadas para responsive
const LI_CLASSES = 'bg-white border border-gray-200 rounded-lg flex sm:items-center justify-between w-full p-4 overflow-hidden hover:bg-gray-50 transition-colors gap-3 sm:gap-4';
const INTERACTIVE_CLASSES = 'flex flex-col sm:flex-row sm:items-stretch gap-3 sm:gap-4 text-inherit no-underline flex-1 min-w-0 text-left focus:outline-none';
const ACTIONS_WRAPPER_CLASSES = 'flex gap-2 items-center justify-center flex-shrink-0';
const ACTION_BTN_BASE = 'inline-flex items-center justify-center p-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9C]';

const SubjectCard = memo((
  {
    subject,
    onEdit,
    onDelete,
    showActions = true,
    onClick,
    isSelected = false,
  }: SubjectCardProps) => {

  // Clases dinámicas (calculadas solo si cambia isSelected)
  const selectedClasses = isSelected ? 'ring-2 ring-[#003d6b] ring-offset-2 mt-2' : '';

  // Contenido interno reutilizable
  const content = (
    <>
      {/* Badge Clave */}
      <div
        className="flex flex-row sm:flex-col items-center justify-start sm:justify-center gap-2 sm:gap-0 flex-shrink-0">
        <span className="text-xs font-medium uppercase text-gray-500 sm:mb-1">Clave</span>
        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
          {subject.subjectId}
        </span>
      </div>

      {/* Nombre Materia */}
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <span className="text-xs font-medium uppercase text-gray-500 mb-1">Nombre de la materia</span>
        <span className="text-base font-semibold text-gray-900 break-words sm:truncate">
          {subject.name}
        </span>
      </div>
    </>
  );

  return (
    <li className={`${LI_CLASSES} ${selectedClasses}`}>
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className={INTERACTIVE_CLASSES}
          aria-pressed={isSelected}
        >
          {content}
        </button>
      ) : (
        <button
          type="button"
          onClick={onEdit}
          className={INTERACTIVE_CLASSES}
        >
          {content}
        </button>
      )}

      {showActions && (
        <div className={ACTIONS_WRAPPER_CLASSES}>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevenimos que el click llegue al li/button padre si existiera
              onEdit?.();
            }}
            className={`${ACTION_BTN_BASE} text-main-color hover:bg-main-color/10`}
            aria-label={`Editar ${subject.name}`}
            title={`Editar ${subject.name.toLowerCase()}`}
            type="button"
          >
            <SquarePen size={20} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className={`${ACTION_BTN_BASE} text-red-600 hover:bg-red-600/10`}
            aria-label={`Eliminar ${subject.name}`}
            title={`Eliminar ${subject.name.toLowerCase()}`}
            type="button"
          >
            <Trash size={20} />
          </button>
        </div>
      )}
    </li>
  );
});

SubjectCard.displayName = 'SubjectCard';

export default SubjectCard;
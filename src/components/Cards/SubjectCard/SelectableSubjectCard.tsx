import { memo } from 'react';
import type { Subject } from '@types';

interface SelectableSubjectCardProps {
  subject: Subject;
  isSelected?: boolean;
  onToggle?: () => void;
  disabled?: boolean;
}

const BASE_CLASSES =
  'bg-white border border-gray-200 rounded-lg flex sm:items-center justify-between w-full p-4 overflow-hidden transition-colors gap-3 sm:gap-4';
const BUTTON_CLASSES =
  'flex flex-col sm:flex-row sm:items-stretch gap-3 sm:gap-4 text-inherit no-underline flex-1 min-w-0 text-left focus:outline-none';
const CHECKBOX_CLASSES =
  'w-5 h-5 text-[#003d6b] bg-gray-100 border-gray-300 rounded focus:ring-[#005A9C] focus:ring-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

const SelectableSubjectCard = memo(
  ({ subject, isSelected = false, onToggle, disabled = false }: SelectableSubjectCardProps) => {
    const selectedClasses = isSelected
      ? 'ring-2 ring-[#003d6b] ring-offset-2 mt-2'
      : '';

    const disabledClasses = disabled
      ? 'opacity-50 cursor-not-allowed'
      : 'hover:bg-gray-100 cursor-pointer';

    const handleToggle = () => {
      if (!disabled && onToggle) {
        onToggle();
      }
    };

    return (
      <li className={`${BASE_CLASSES} ${selectedClasses} ${disabledClasses}`}>
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={BUTTON_CLASSES}
          aria-pressed={isSelected}
          aria-disabled={disabled}
        >
          {/* Columna "Clave" */}
          <div className="flex flex-row sm:flex-col items-center sm:justify-center gap-2 sm:gap-0 flex-shrink-0">
            <span className="text-xs font-medium uppercase text-gray-500 sm:mb-1">
              Clave
            </span>

            <span
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              {subject.subjectId}
            </span>
          </div>

          {/* Nombre de la materia */}
          <div className="flex flex-col justify-center flex-1 min-w-0">
            <span className="text-xs font-medium uppercase text-gray-500 mb-1">
              Nombre de la materia
            </span>

            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-gray-900 break-words sm:truncate">
                {subject.name}
              </span>
            </div>
          </div>
        </button>

        {/* Checkbox */}
        <div className="flex items-center justify-center flex-shrink-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleToggle}
            disabled={disabled}
            className={CHECKBOX_CLASSES}
            aria-label={`Seleccionar ${subject.name}`}
          />
        </div>
      </li>
    );
  },
);

SelectableSubjectCard.displayName = 'SelectableSubjectCard';
export default SelectableSubjectCard;
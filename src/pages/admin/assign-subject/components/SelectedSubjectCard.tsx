import React, { memo, useState } from 'react';
import { X } from 'lucide-react';
import type { Subject } from '@types';
import CustomListbox from '@components/CustomListBox/CustomListBox.tsx';

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// Clases estáticas
const LI_BASE = 'bg-white border border-gray-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between w-full hover:bg-gray-50 transition-colors';
const CONTENT_WRAPPER = 'flex flex-col sm:flex-row sm:items-stretch gap-3 sm:gap-4 p-4 flex-1 min-w-0';
const BADGE_WRAPPER = 'flex flex-row sm:flex-col items-center sm:items-center justify-start sm:justify-center gap-2 sm:gap-0 flex-shrink-0';
const BADGE_LABEL = 'text-xs font-medium uppercase text-gray-500 sm:mb-1';
const BADGE_VALUE = 'inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold';
const NAME_WRAPPER = 'flex flex-col justify-center flex-1 min-w-0';
const NAME_LABEL = 'text-xs font-medium uppercase text-gray-500 mb-1';
const NAME_VALUE = 'text-base font-semibold text-gray-900 break-words sm:truncate';
const CONTROLS_WRAPPER = 'flex items-center justify-between sm:justify-end gap-2 px-4 pb-4 sm:p-0 sm:pr-4 flex-shrink-0 relative z-10 border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0';
const REMOVE_BTN = 'p-2 rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors';

type Props = {
  subject: Subject;
  semester: number;
  setSubjectSemester: (subjectId: number, sem: number) => void;
  removeSelectedSubject: (subjectId: number) => void;
  isUnifiedSemester?: boolean;
};

const SelectedSubjectCard: React.FC<Props> = memo((
  {
    subject,
    semester,
    setSubjectSemester,
    removeSelectedSubject,
    isUnifiedSemester = false,
  }) => {
  const [isOpen, setIsOpen] = useState(false);
  const zIndexClass = isOpen ? 'z-50' : 'z-0';

  // Preparar opciones para el listbox
  const semesterOptions = SEMESTERS.map((s) => ({
    value: s,
    label: `Semestre ${s}`,
  }));

  return (
    <li className={`${LI_BASE} ${zIndexClass}`}>
      {/* Contenido principal */}
      <div className={CONTENT_WRAPPER}>
        <div className={BADGE_WRAPPER}>
          <span className={BADGE_LABEL}>Clave</span>
          <span className={BADGE_VALUE}>{subject.subjectId}</span>
        </div>

        <div className={NAME_WRAPPER}>
          <span className={NAME_LABEL}>Nombre de la materia</span>
          <span className={NAME_VALUE}>{subject.name}</span>
        </div>
      </div>

      {/* Controles */}
      <div className={CONTROLS_WRAPPER}>
        {isUnifiedSemester ? (
          <div className="px-3 py-1.5 text-sm text-gray-700 min-w-[120px] text-center">
            Semestre {semester}
          </div>
        ) : (
          <CustomListbox
            value={semester}
            onChange={(val) => setSubjectSemester(subject.subjectId, val)}
            options={semesterOptions}
            className="flex-1 sm:flex-initial"
            buttonClassName="w-full sm:w-auto min-w-[120px]"
            optionsClassName="left-0 sm:right-0 sm:left-auto w-full sm:w-44 max-h-44"
            ariaLabel={`Semestre para ${subject.name}`}
            onOpenChange={setIsOpen}
          />
        )}

        <button
          type="button"
          onClick={() => removeSelectedSubject(subject.subjectId)}
          className={REMOVE_BTN}
          aria-label={`Remover ${subject.name}`}
          title={`Remover ${subject.name}`}
        >
          <X size={14} />
        </button>
      </div>
    </li>
  );
});

SelectedSubjectCard.displayName = 'SelectedSubjectCard';

export default SelectedSubjectCard;
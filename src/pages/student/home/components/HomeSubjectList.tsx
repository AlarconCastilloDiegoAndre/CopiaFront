import { memo } from 'react';
import SelectableSubjectCard from '@components/Cards/SubjectCard/SelectableSubjectCard';
import type { CareerSubject } from '@types';

interface HomeSubjectListProps {
  items: CareerSubject[];
  selectedIds: Set<number>;
  semester: number;
  onToggle: (id: number) => void;
  isMaxReached?: boolean;
  maxSubjects?: number;
  totalSelected?: number;
}

const HomeSubjectList = memo(({
  items,
  selectedIds,
  semester,
  onToggle,
  isMaxReached = false,
  maxSubjects = 8,
  totalSelected = 0,
}: HomeSubjectListProps) => {
  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 px-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <p className="text-base font-semibold text-gray-900 text-right sm:text-left">
            ASIGNATURAS DEL {semester}° SEMESTRE
          </p>
          {/* Indicador de límite */}
          {isMaxReached && (
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full text-right sm:text-left">
              Límite alcanzado ({totalSelected}/{maxSubjects})
            </span>
          )}
        </div>
      </div>

      {/* Lista de materias */}
      <ul className="space-y-3 pt-5">
        {items.map((careerSubject) => {
          const id = careerSubject.career_subject_id;
          const isSelected = selectedIds.has(id);
          // Deshabilitar items no seleccionados si se alcanzó el límite
          const isDisabled = isMaxReached && !isSelected;

          return (
            <SelectableSubjectCard
              key={id}
              subject={careerSubject.subject}
              isSelected={isSelected}
              onToggle={() => onToggle(id)}
              disabled={isDisabled}
            />
          );
        })}
      </ul>

      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay materias disponibles para este semestre</p>
        </div>
      )}
    </>
  );
});

HomeSubjectList.displayName = 'HomeSubjectList';
export default HomeSubjectList;
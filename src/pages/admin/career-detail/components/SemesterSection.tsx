import { CollapsibleSection } from '@components/CollapsibleSection';
import SubjectCard from '@components/Cards/SubjectCard';
import type { CareerSubject } from '@types';

interface SemesterSectionProps {
  semester: number;
  items: CareerSubject[];
  defaultOpen?: boolean;
  careerId: string;
  // Props de acciones
  onRemoveSubject: (id: number, name: string) => void;
  onEditSubject: (id: number, semester: number, name: string) => void;
}

const SemesterSection = (
  {
    semester,
    items,
    defaultOpen = false,
    onRemoveSubject,
    onEditSubject,
  }: SemesterSectionProps) => {

  const count = items.length;

  return (
    <CollapsibleSection
      title={`Semestre ${semester}`}
      badgeCount={count}
      defaultOpen={defaultOpen}
    >
      {items.length > 0 ? (
        items.map((assignment) => {
          const subject = assignment.subject;
          if (!subject) return null;

          return (
            <SubjectCard
              key={assignment.career_subject_id}
              subject={subject}
              onDelete={() => onRemoveSubject(assignment.career_subject_id, subject.name)}
              onEdit={() => onEditSubject(assignment.career_subject_id, assignment.semester, subject.name)}
            />
          );
        })
      ) : (
        <div className="px-3 py-6 text-center text-gray-500 text-sm italic">
          No hay materias asignadas a este semestre.
        </div>
      )}
    </CollapsibleSection>
  );
};

export default SemesterSection;
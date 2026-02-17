import React, { useRef, useEffect } from 'react';
import ListSkeleton from '@components/Lists/ListSkeleton';
import Button from '@components/Button';
import SubjectCard from '@components/Cards/SubjectCard';
import type { Subject } from '@types';

type SubjectListProps = {
  isLoading: boolean;
  subjects: Subject[];
  searchTerm: string;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  handleOpenEditModal: (subject: Subject) => void;
  handleDeleteClick: (id: number, name: string) => void;
  scrollToSubjectId?: number | null;
  clearScrollTarget?: () => void;
};

export const SubjectList: React.FC<SubjectListProps> = (
  {
    isLoading,
    subjects,
    searchTerm,
    hasNextPage,
    fetchNextPage,
    handleOpenEditModal,
    handleDeleteClick,
    scrollToSubjectId,
    clearScrollTarget,
  }) => {
  // Refs para cada card
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Efecto para hacer scroll cuando se indica
  useEffect(() => {
    if (scrollToSubjectId && cardRefs.current.has(scrollToSubjectId)) {
      const element = cardRefs.current.get(scrollToSubjectId);
      if (element) {
        // Scroll suave al elemento
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });

        // Añadir animación de highlight
        element.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');

        // Remover highlight después de 2 segundos
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
          clearScrollTarget?.();
        }, 2000);
      }
    }
  }, [scrollToSubjectId, subjects, clearScrollTarget]);

  // Manejo de la carga INICIAL
  if (isLoading && subjects.length === 0) {
    return <ListSkeleton variant="card" items={5} />;
  }

  // Manejo de estado vacío
  if (subjects.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 text-center text-gray-500">
        {searchTerm
          ? 'No se encontraron materias con ese criterio.'
          : 'No hay materias disponibles.'}
      </div>
    );
  }

  // Renderizado de la lista
  return (
    <div className="flex flex-col gap-4">
      {subjects.map((subject) => (
        <div
          key={subject.subjectId}
          ref={(el) => {
            if (el) {
              cardRefs.current.set(subject.subjectId, el);
            } else {
              cardRefs.current.delete(subject.subjectId);
            }
          }}
          className="transition-all duration-300 rounded-lg"
        >
          <SubjectCard
            subject={subject}
            showActions={true}
            onClick={() => handleOpenEditModal(subject)}
            onEdit={() => handleOpenEditModal(subject)}
            onDelete={() => handleDeleteClick(subject.subjectId, subject.name)}
          />
        </div>
      ))}

      {/* Botón de Paginación */}
      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} className="w-full">
          Cargar más...
        </Button>
      )}
    </div>
  );
};
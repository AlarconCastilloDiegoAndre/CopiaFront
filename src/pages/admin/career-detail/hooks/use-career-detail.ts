import { useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CareerSubject } from '@types';
import {
  deleteCareerSubjectService,
  updateCareerSubjectService,
} from '@services';
import { parseErrorMessage } from '@utils/parseErrorMessage.ts';
import { useCareersQuery } from '@hooks/use-careers-query.ts';
import { useCareerSubjectsQuery } from '@hooks/use-career-subjects-query.ts';

export const useCareerDetail = (
  careerId: string | undefined,
  searchTerm: string,
) => {
  const queryClient = useQueryClient();

  // Carreras completas
  const { data: careers = [], isLoading: isLoadingCareers } = useCareersQuery();

  // Materias asignadas a la carrera
  const {
    data: subjects = [],
    isLoading: isLoadingSubjects,
    error: subjectsError,
  } = useCareerSubjectsQuery(careerId);

  // --- Mutación: eliminar asignación materia-carrera ---
  const removeMutation = useMutation({
    mutationFn: deleteCareerSubjectService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['career-subjects', careerId],
      });
    },
  });

  // --- Mutación: actualizar semestre ---
  const updateMutation = useMutation({
    mutationFn: updateCareerSubjectService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['career-subjects', careerId],
      });
    },
  });

  // --- Buscar carrera actual ---
  const career = useMemo(
    () => careers.find((c) => c.careerId === careerId),
    [careers, careerId],
  );

  // --- Agrupar materias filtradas por semestre ---
  const groupedAssignments = useMemo(() => {
    if (!subjects.length) return {};

    const filtered = searchTerm
      ? subjects.filter((a: CareerSubject) => {
        const lowerSearch = searchTerm.toLowerCase();
        return (
          a.subject.name.toLowerCase().includes(lowerSearch) ||
          a.subject.subjectId.toString().includes(searchTerm)
        );
      })
      : subjects;

    return filtered.reduce((acc, item) => {
      const sem = item.semester;
      if (!acc[sem]) acc[sem] = [];
      acc[sem].push(item);
      return acc;
    }, {} as Record<number, CareerSubject[]>);
  }, [subjects, searchTerm]);

  return {
    isLoading: isLoadingCareers || isLoadingSubjects,

    error: subjectsError
      ? 'No se pudieron cargar los datos del plan de estudios.'
      : null,

    career,
    groupedAssignments,

    // --- Eliminación ---
    isRemoving: removeMutation.isPending,
    deleteError: removeMutation.error
      ? parseErrorMessage(removeMutation.error)
      : null,
    removeSubjectFromCareer: removeMutation.mutateAsync,

    // --- Actualización ---
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error
      ? parseErrorMessage(updateMutation.error)
      : null,
    updateSubjectSemester: updateMutation.mutateAsync,
  };
};

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateCareerSubjectDTO } from '@pages/admin/assign-subject/types';
import { createCareerSubjectService, searchSubjectService } from '@services';
import { useParams } from 'react-router-dom';


// Hook para gestionar la asignación de materias a una carrera
export const useAssignSubject = (debouncedSearchTerm: string) => {
  const { careerId } = useParams<{ careerId: string }>();
  const queryClient = useQueryClient();

  // --- Query para buscar materias ---
  const {
    data,
    isLoading: isSearching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['subjects-list', debouncedSearchTerm],
    queryFn: ({ pageParam = 1 }) => searchSubjectService(debouncedSearchTerm, pageParam),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.meta;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60,
  });

  // Aplanamos los resultados
  const searchResults = data?.pages.flatMap(page => page.data) ?? [];

  // --- Mutación para guardar asignaciones ---
  const saveMutation = useMutation({
    mutationFn: (dtos: CreateCareerSubjectDTO[]) => createCareerSubjectService(dtos),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['career-subjects', careerId] });
    },
  });

  return {
    // Datos de Búsqueda
    searchResults,
    isSearching,
    hasNextPage,
    fetchNextPage,

    // Datos de Mutación
    careerId, // La página lo necesita para el submit
    isSaving: saveMutation.isPending,
    saveError: saveMutation.error,
    saveAssignments: (data: CreateCareerSubjectDTO[]) => saveMutation.mutateAsync(data),
  };
};
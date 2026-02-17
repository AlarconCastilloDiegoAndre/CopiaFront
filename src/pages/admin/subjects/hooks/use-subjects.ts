import { useDebounce } from 'use-debounce';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createSubjectService,
  deleteSubjectService,
  searchSubjectService,
  updateSubjectService,
} from '@services';
import type { SubjectDto } from '@types';

export const useSubjects = (searchTerm: string) => {
  const queryClient = useQueryClient();

  // --- Debounce de búsqueda ---
  const [debouncedSearch] = useDebounce(searchTerm, 300);

  // --- Query de materias ---
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    error,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['subjects-list', debouncedSearch],
    queryFn: ({ pageParam = 1 }) =>
      searchSubjectService(debouncedSearch, pageParam),

    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.meta;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },

    initialPageParam: 1,
    retry: 1, // Reintentar solo una vez
  });

  // Aplanar las páginas
  const subjects = data?.pages.flatMap((p) => p.data) ?? [];

  // --- Mutaciones ---
  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['subjects-list'] });
    queryClient.invalidateQueries({
      queryKey: ['career-subjects'],
      exact: false,
      refetchType: 'all',
    });
    queryClient.invalidateQueries({
      queryKey: ['dashboard-stats'],
    })
  };

  const createMutation = useMutation({
    mutationFn: (data: SubjectDto) => createSubjectService(data),
    onSuccess: invalidateAll,
  });

  const updateMutation = useMutation({
    mutationFn: (data: SubjectDto) => updateSubjectService(data),
    onSuccess: invalidateAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSubjectService(id),
    onSuccess: invalidateAll,
  });

  return {
    subjects,
    isLoading,
    hasNextPage,
    fetchNextPage,
    error,
    isError,
    refetch,

    createSubject: createMutation.mutateAsync,
    updateSubject: updateMutation.mutateAsync,
    deleteSubject: deleteMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
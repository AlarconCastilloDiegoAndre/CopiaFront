import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { searchStudentsService, updateStudentService } from '@services/students.service.ts';
import type { Student } from '@types';
import { toast } from 'sonner';

interface UpdateStudentParams {
  studentId: number;
  data: {
    name: string;
    email: string;
    semester: number;
    groupNo: number;
    careerId: string;
    status: 'ACTIVO' | 'EGRESADO';
  };
}

export const useStudents = () => {
  const queryClient = useQueryClient();

  // Estado de la tabla
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce para la búsqueda
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  // Resetear a la página 1 cuando cambia la búsqueda
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Query para obtener estudiantes
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['students', page, debouncedSearch],
    queryFn: () => searchStudentsService(debouncedSearch, page),
    placeholderData: (previousData) => previousData,
  });

  // Mutation para actualizar estudiante
  const updateMutation = useMutation({
    mutationFn: ({ studentId, data }: UpdateStudentParams) => 
      updateStudentService(studentId, data),
    onSuccess: (response) => {
      toast.success(response?.message || 'Estudiante actualizado correctamente');
      // Invalidar la query para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Error al actualizar el estudiante';
      toast.error(message);
    },
  });

  return {
    // Datos
    students: data?.data || [] as Student[],
    meta: data?.meta,

    // Estados de carga
    isLoading,
    isError,
    error,

    // Paginación
    page,
    setPage,

    // Búsqueda
    searchTerm,
    setSearchTerm,

    // Update
    updateStudent: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
};
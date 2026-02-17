import { createCareerService, deleteCareerService, updateCareerService } from '@services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parseErrorMessage } from '@utils/parseErrorMessage.ts';
import type { CareerDto } from '@pages/admin/careers/types';
import { useCareersQuery } from '@hooks/use-careers-query.ts';
import { useMemo, useState } from 'react';

export const useCareer = () => {
  const queryClient = useQueryClient();

  // Estado local para búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Consumir hook global
  const { data: careers = [], isLoading, error } = useCareersQuery();

  // Mutación para crear una carrera
  const createMutation = useMutation({
    mutationFn: createCareerService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['careers'] });
    },
  });

  // Mutación para editar una carrera
  const updateMutation = useMutation({
    mutationFn: updateCareerService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['careers'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCareerService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['careers'] });
    }
  });

  // Filtrado de carreras
  const filteredCareers = useMemo(
    () =>
      careers.filter(
        (career) =>
          career.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          career.careerId.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [careers, searchTerm],
  );

  return {
    // Estado de carga y errores
    isLoading,
    error: error ? 'No se pudieron cargar las carreras.' : null,

    // Datos
    filteredCareers,
    searchTerm,

    // Acciones de estado local
    setSearchTerm,

    // Estados de la mutación de creación
    isCreating: createMutation.isPending,
    createError: createMutation.error ? parseErrorMessage(createMutation.error) : null,
    createCareer: (data: CareerDto) => createMutation.mutateAsync(data),

    // Estados de la mutación de actualización
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error ? parseErrorMessage(updateMutation.error) : null,
    updateCareer: (data: CareerDto) => updateMutation.mutateAsync(data),

    // Estados de la mutación de edición
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error ? parseErrorMessage(deleteMutation.error) : null,
    deleteCarrer: (id: string) => deleteMutation.mutateAsync(id)
  };
};
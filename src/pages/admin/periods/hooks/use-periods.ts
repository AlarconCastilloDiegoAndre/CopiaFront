import { useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { advanceSemesterService, createPeriodService, deletePeriodService, updatePeriodService } from '@services';
import { parseErrorMessage } from '@utils/parseErrorMessage.ts';
import { usePeriodsQuery } from '@hooks/use-periods-query.ts';

export const usePeriods = () => {
  const queryClient = useQueryClient();

  // Períodos desde la API
  const {
    data: periods = [],
    isLoading,
    error,
  } = usePeriodsQuery();

  // --- Mutación: eliminar período ---
  const deleteMutation = useMutation({
    mutationFn: deletePeriodService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['periods'],
      });
    },
  });

  // --- Mutación: actualizar período ---
  const updateMutation = useMutation({
    mutationFn: updatePeriodService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['periods'],
      });
    },
  });

  // --- Mutación: crear período ---
  const createMutation = useMutation({
    mutationFn: createPeriodService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['periods'],
      });
    },
  });

  const advanceSemesterMutation = useMutation({
    mutationFn: advanceSemesterService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['periods'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      // TODO: Si hay que actualizar otras keys de cache agregarlas
    },
  });

  // --- Lógica de clasificación de períodos ---
  const { activePeriod, upcomingPeriods, pastPeriods } = useMemo(() => {
    // Obtener la fecha de hoy en formato YYYY-MM-DD en zona horaria de México
    const now = new Date();
    const todayMexico = now.toLocaleDateString('sv-SE', {
      timeZone: 'America/Mexico_City'
    }); // "2026-02-16"

    const active = periods.find((p) => p.active);
    const allInactive = periods.filter((p) => !p.active);

    const upcoming = allInactive
      .filter((p) => p.endDate >= todayMexico) // Comparación de strings
      .sort((a, b) => a.startDate.localeCompare(b.startDate));

    const past = allInactive
      .filter((p) => p.endDate < todayMexico)
      .sort((a, b) => b.endDate.localeCompare(a.endDate));

    return {
      activePeriod: active,
      upcomingPeriods: upcoming,
      pastPeriods: past,
    };
  }, [periods]);

  return {
    isLoading,
    error: error ? 'No se pudieron cargar los períodos.' : null,

    // Datos clasificados
    activePeriod,
    upcomingPeriods,
    pastPeriods,

    // --- Eliminación ---
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error
      ? parseErrorMessage(deleteMutation.error)
      : null,
    deletePeriod: deleteMutation.mutateAsync,

    // --- Actualización ---
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error
      ? parseErrorMessage(updateMutation.error)
      : null,
    updatePeriod: updateMutation.mutateAsync,

    // --- Creación ---
    isCreating: createMutation.isPending,
    createError: createMutation.error
      ? parseErrorMessage(createMutation.error)
      : null,
    createPeriod: createMutation.mutateAsync,

    // --- Avanzar Semestre ---
    isAdvancingSemester: advanceSemesterMutation.isPending,
    advanceSemesterError: advanceSemesterMutation.error
      ? parseErrorMessage(advanceSemesterMutation.error)
      : null,
    advanceSemester: advanceSemesterMutation.mutateAsync,
  };
};
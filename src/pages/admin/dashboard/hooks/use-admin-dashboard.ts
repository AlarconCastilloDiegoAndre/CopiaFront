import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import {
  getDashboardStatsService,
  getGroupsService,
} from '@services/admin.service.ts';
import { usePeriodsQuery } from '@hooks/use-periods-query.ts';
import { useCareersQuery } from '@hooks/use-careers-query.ts';
import { getEnrollmentsService } from '@services';
import type { SortColumn, SortConfig, EnrollmentRow } from '../types/admin-dashboard.types';

export const useAdminDashboard = () => {
  // --- Estados de Filtros y Paginación ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCareer, setSelectedCareer] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedSubjectType, setSelectedSubjectType] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  // --- Estado de Ordenamiento ---
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: null,
    direction: 'asc',
  });

  // Debounce para no saturar la API al escribir
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  // Resetear a página 1 si cambian los filtros de búsqueda
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCareer, selectedGroup, selectedPeriod, selectedSubjectType]);

  // --- Peticiones de Datos ---

  // A. Estadísticas
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStatsService,
  });

  // B. Reporte Principal (Paginado)
  const { data: reportData, isLoading: loadingReport } = useQuery({
    queryKey: ['enrollment-report', debouncedSearch, selectedCareer, selectedGroup, selectedPeriod, selectedSubjectType, page],
    queryFn: () => getEnrollmentsService(
      debouncedSearch,
      selectedCareer,
      selectedGroup,
      selectedPeriod,
      selectedSubjectType,
      page,
      limit,
    ),
    placeholderData: (prev) => prev,
  });

  // C. Datos para los Selects (Carreras y Grupos)
  const { data: careers = [] } = useCareersQuery();

  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: getGroupsService,
  });

  // D. Verificar Periodo Activo (Para la alerta)
  const { data: periods = [] } = usePeriodsQuery();
  const activePeriod = periods.find((p) => p.active);

  // --- Función para manejar el ordenamiento ---
  const handleSort = (column: SortColumn) => {
    setSortConfig((prev) => {
      // Si es la misma columna, cambiar dirección
      if (prev.column === column) {
        // Si ya está en desc, quitar el ordenamiento
        if (prev.direction === 'desc') {
          return { column: null, direction: 'asc' };
        }
        // Si está en asc, cambiar a desc
        return { column, direction: 'desc' };
      }
      // Si es una columna diferente, ordenar asc
      return { column, direction: 'asc' };
    });
  };

  // --- Ordenar datos localmente ---
  const sortedReport = useMemo(() => {
    const data = reportData?.data || [];
    
    if (!sortConfig.column) {
      return data;
    }

    return [...data].sort((a: EnrollmentRow, b: EnrollmentRow) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.column) {
        case 'career':
          aValue = a.career?.toLowerCase() || '';
          bValue = b.career?.toLowerCase() || '';
          break;
        case 'subject':
          aValue = a.subject?.toLowerCase() || '';
          bValue = b.subject?.toLowerCase() || '';
          break;
        case 'semester':
          aValue = a.semester ?? 0;
          bValue = b.semester ?? 0;
          break;
        case 'type':
          aValue = a.type?.toLowerCase() || '';
          bValue = b.type?.toLowerCase() || '';
          break;
        case 'totalStudents':
          aValue = a.totalStudents ?? 0;
          bValue = b.totalStudents ?? 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [reportData?.data, sortConfig]);

  // --- Lógica de Exportación ---
  const handleExport = () => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.append('search', debouncedSearch);
    if (selectedCareer) params.append('careerId', selectedCareer);
    if (selectedGroup) params.append('group', selectedGroup);

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const exportUrl = `${baseUrl}/alumnos/exportar?${params.toString()}`;

    window.open(exportUrl, '_blank');
  };

  return {
    // Datos
    stats,
    report: sortedReport,
    meta: reportData?.meta,
    careers,
    groups,
    periods,
    activePeriod,

    // Estados de Carga
    isLoading: loadingStats || loadingReport,

    // Filtros y Paginación
    searchTerm, setSearchTerm,
    selectedCareer, setSelectedCareer,
    selectedGroup, setSelectedGroup,
    selectedPeriod, setSelectedPeriod,
    selectedSubjectType, setSelectedSubjectType,
    page, setPage,

    // Ordenamiento
    sortConfig,
    handleSort,

    // Acciones
    handleExport,
  };
};
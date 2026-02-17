import { useCallback, useEffect, useState } from 'react';
import {
  getSubmissionLogsService,
  type SubmissionLog,
  type SubmissionLogsFilters,
} from '@services/dba.service';
import { toast } from 'sonner';

export const useDbaLogs = () => {
  // Estado de filtros (valores en los inputs)
  const [adminUsername, setAdminUsername] = useState('');
  const [studentId, setStudentId] = useState('');
  const [entity, setEntity] = useState('');
  const [entityId, setEntityId] = useState('');
  const [action, setAction] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Filtros aplicados (los que realmente se usan en la petición)
  const [appliedFilters, setAppliedFilters] = useState<SubmissionLogsFilters>({});

  // Estado de paginación
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  // Estado de datos
  const [logs, setLogs] = useState<SubmissionLog[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch logs cuando cambian los filtros aplicados o la paginación
  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const filters: SubmissionLogsFilters = {
          page,
          limit,
          ...appliedFilters,
        };

        const response = await getSubmissionLogsService(filters);
        setLogs(response.data);
        setTotal(response.total);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
          error?.message ||
          'Error al cargar logs',
        );
        setLogs([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [appliedFilters, page, limit]);

  // Aplicar filtros (llamado desde el botón)
  const applyFilters = useCallback(() => {
    const filters: SubmissionLogsFilters = {};

    // Solo agregar filtros que tengan valor
    if (adminUsername.trim()) filters.adminUsername = adminUsername.trim();
    if (studentId.trim()) filters.studentId = studentId.trim();
    if (entity && entity !== 'ALL') filters.entity = entity;
    if (entityId.trim()) filters.entityId = entityId.trim();
    if (action && action !== 'ALL') filters.action = action;
    if (fromDate) filters.from = fromDate;
    if (toDate) filters.to = toDate;

    setAppliedFilters(filters);
    setPage(1); // Resetear a página 1 al aplicar filtros
  }, [adminUsername, studentId, entity, entityId, action, fromDate, toDate]);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setAdminUsername('');
    setStudentId('');
    setEntity('');
    setEntityId('');
    setAction('');
    setFromDate('');
    setToDate('');
    setAppliedFilters({});
    setPage(1);
  }, []);

  return {
    // Filtros
    adminUsername,
    setAdminUsername,
    studentId,
    setStudentId,
    entity,
    setEntity,
    entityId,
    setEntityId,
    action,
    setAction,
    fromDate,
    setFromDate,
    toDate,
    setToDate,

    // Paginación
    page,
    setPage,
    limit,
    total,

    // Datos
    logs,
    isLoading,

    // Utilidades
    applyFilters,
    clearFilters,
  };
};

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { getEnrollmentDetailsService } from '@services/enrollments.service.ts';

export const useEnrollmentDetails = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  // Extraer parámetros de la URL
  const careerSubjectId = searchParams.get('careerSubjectId') || '';
  const group = searchParams.get('group') || '';
  const type = searchParams.get('type') || '';
  const periodId = searchParams.get('periodId') || undefined;

  // Query con TanStack
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['enrollment-details', careerSubjectId, group, type, periodId],
    queryFn: () => getEnrollmentDetailsService({ careerSubjectId, group, type, periodId }),
    enabled: !!careerSubjectId && !!group && !!type, // Solo ejecutar si hay parámetros válidos
  });

  // Filtrar estudiantes localmente basado en el término de búsqueda
  const filteredStudents = useMemo(() => {
    const allStudents = data?.students || [];

    if (!searchTerm || searchTerm.trim() === '') {
      return allStudents;
    }

    const term = searchTerm.toLowerCase();
    return allStudents.filter((student) =>
      student.name.toLowerCase().includes(term) ||
      student.studentId.toString().includes(term)
    );
  }, [data?.students, searchTerm]);

  return {
    context: data?.context,
    students: filteredStudents,
    allStudents: data?.students || [],
    searchTerm,
    setSearchTerm,
    isLoading,
    isError,
    error,
    hasValidParams: !!careerSubjectId && !!group && !!type,
  };
};

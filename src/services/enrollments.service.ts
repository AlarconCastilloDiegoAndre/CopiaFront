import type { 
  EnrollmentDetailsResponse, 
  CreateEnrollmentBatchDTO, 
  EnrollmentBatchResponse 
} from '@types';
import { api } from '@lib/axios.ts';

interface GetEnrollmentDetailsParams {
  careerSubjectId: string;
  group: string;
  type: string;
  periodId?: string;
}

// Reporte de Inscripciones (Con filtros)
export const getEnrollmentsService = async (
  search?: string,
  careerId?: string,
  group?: string,
  periodId?: string,
  type?: string,
  page = 1,
  limit = 30,
) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (careerId) params.append('careerId', careerId);
  if (group) params.append('group', group);
  if (periodId) params.append('periodId', periodId);
  if (type) params.append('type', type.toUpperCase());

  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const { data } = await api.get(`/enrollments?${params.toString()}`);

  return data;
};

export const getEnrollmentDetailsService = async (
  params: GetEnrollmentDetailsParams,
): Promise<EnrollmentDetailsResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('careerSubjectId', params.careerSubjectId);
  queryParams.append('group', params.group);
  queryParams.append('type', params.type);

  if (params.periodId) {
    queryParams.append('periodId', params.periodId);
  }

  const response = await api.get(`/enrollments/enrollment-details?${queryParams.toString()}`);
  return response.data;
};

/**
 * Crea múltiples enrollments en una sola solicitud
 */
export const createEnrollmentBatchService = async (
  data: CreateEnrollmentBatchDTO
): Promise<EnrollmentBatchResponse> => {
  const response = await api.post('/enrollments/batch', data);
  return response.data;
};

export interface EnrollmentStatusResponse {
  hasConfirmedEnrollment: boolean;
  period: {
    periodId: string;
    startDate: string;
    endDate: string;
    active: boolean;
  } | null;
  summary: {
    total: number;
    normal: number;
    adelanto: number;
    recursamiento: number;
  } | null;
  enrollments: Array<{
    enrollmentId: string;
    subjectName: string;
    type: 'NORMAL' | 'ADELANTO' | 'RECURSAMIENTO';
    state: string;
  }>;
}

/**
 * Obtiene el estado de inscripción del estudiante en el periodo activo
 */
export const getMyEnrollmentStatusService = async (
  studentId: number
): Promise<EnrollmentStatusResponse> => {
  const response = await api.get(`/enrollments/my-status?studentId=${studentId}`);
  return response.data;
};


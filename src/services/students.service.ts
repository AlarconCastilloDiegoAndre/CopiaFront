import type { Student, StudentRegisterDto } from '@types';
import { api } from '@lib/axios.ts';
import { handleApiRequest } from '@lib/api-handler.ts';

interface StudentPaginatedResponse {
  data: Student[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
  links: {
    current: string;
    next?: string;
    last: string;
  };
}

export interface UpdateStudentDto {
  name?: string;
  email?: string;
  semester?: number;
  groupNo?: number;
  careerId?: string;
  status?: 'ACTIVO' | 'EGRESADO';
}

export const searchStudentsService = async (
  searchTerm: string,
  page: number = 1,
): Promise<StudentPaginatedResponse> => {

  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', '30');
  params.append('sortBy', 'name:ASC');

  if (searchTerm) {
    params.append('search', searchTerm);
  }

  // Llamada al endpoint paginado
  const response = await api.get(`/students?${params.toString()}`);

  return response.data;
};

export const getStudentByIdService = async (studentId: number): Promise<Student> => {
  const response = await api.get(`/students/${studentId}`);
  return response.data;
};

export const updateStudentService = async (
  studentId: number,
  data: UpdateStudentDto,
): Promise<{ message: string; student: Student }> => {
  return handleApiRequest(api.patch(`/students/${studentId}`, data));
};

export const registerStudentService = async (
  data: StudentRegisterDto,
): Promise<{ message: string }> => {
  return handleApiRequest(api.post(`/auth/students/register`, data));
};
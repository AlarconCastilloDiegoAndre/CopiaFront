import { api } from '../lib/axios.ts';
import type { Subject, SubjectDto } from '@types';
import { handleApiRequest } from '@lib/api-handler.ts';

// Respuesta paginada
interface SubjectPaginatedResponse {
  data: Subject[];
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

export const searchSubjectService = async (
  searchTerm: string, page: number = 1,
): Promise<SubjectPaginatedResponse> => {
  // Construye la URL con los parámetros que 'nestjs-paginate' espera
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', '20');
  params.append('sortBy', 'subjectId:ASC');

  if (searchTerm) {
    params.append('search', searchTerm);
  }

  const response = await api.get(`/subjects?${params.toString()}`);

  return response.data;
};

export const createSubjectService = async (subject: SubjectDto): Promise<Subject> => {
  return handleApiRequest(api.post('/subjects', subject));
};

export const updateSubjectService = async (subject: SubjectDto): Promise<Subject> => {
  return handleApiRequest(api.patch(`/subjects/${subject.subjectId}`, { name: subject.name }));
};

export const deleteSubjectService = async (subjectId: number): Promise<{ message: string }> => {
  return handleApiRequest(api.delete(`/subjects/${subjectId}`));
};

export const importSubjectsExcelService = async (
  file: File,
): Promise<{ inserted: number; totalRows: number }> => {
  const formData = new FormData();
  formData.append('file', file);

  return handleApiRequest(
    api.post('/subjects/import-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  );
};



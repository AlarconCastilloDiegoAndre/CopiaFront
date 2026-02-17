import type { CreateCareerSubjectDTO, UpdateCareerSubjectDTO } from '@pages/admin/assign-subject/types';
import { handleApiRequest } from '../lib/api-handler.ts';
import type { CareerSubject } from '@types';
import { api } from '../lib/axios.ts';

export const getCareerSubjectService = async (careerId: string): Promise<CareerSubject[]> => {
  return handleApiRequest(api.get(`/career-subjects?career_id=${careerId}`));
};

export const getCareerSubjectsBySemesterService = async (
  careerId: string,
  semester: number
): Promise<CareerSubject[]> => {
  return handleApiRequest(
    api.get(`/career-subjects?career_id=${careerId}&semester=${semester}`)
  );
};

// Este servicio se puede utilizar para mandar una sola asociacion
// Pero realmente no se necesita, se deja aqui porque xd
export const createCareerSubject = async (subject: CreateCareerSubjectDTO): Promise<CareerSubject> => {
  return handleApiRequest(api.post(`/career-subjects`, subject));
};

export const createCareerSubjectService = async (data: CreateCareerSubjectDTO[]) => {
  const response = await api.post('/career-subjects', data);
  return response.data;
};

export const updateCareerSubjectService = async (
  { careerSubjectId, newSemester }: UpdateCareerSubjectDTO): Promise<CareerSubject> => {
  return await handleApiRequest(api.patch(`/career-subjects/${careerSubjectId}`, { semester: newSemester }));
};

export const deleteCareerSubjectService = async (careerSubjectId: number): Promise<{ message: string }> => {
  return handleApiRequest(api.delete(`/career-subjects/${careerSubjectId}`));
};

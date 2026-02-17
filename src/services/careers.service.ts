import type { CareerDto } from '@pages/admin/careers/types';
import { handleApiRequest } from '../lib/api-handler.ts';
import type { Career } from '@types';
import { api } from '../lib/axios';

export const getCareersService = async (): Promise<Career[]> => {
  return handleApiRequest(api.get(`/careers`));
};

export const createCareerService = async (career: CareerDto): Promise<Career> => {
  return handleApiRequest(api.post(`/careers`, career));
};

export const updateCareerService = async (career: CareerDto): Promise<Career> => {
  return handleApiRequest(api.patch(`/careers/${career.careerId}`, { name: career.name }));
};

export const deleteCareerService = async (careerId: string): Promise<{ message: string }> => {
  return handleApiRequest(api.delete(`/careers/${careerId}`));
};

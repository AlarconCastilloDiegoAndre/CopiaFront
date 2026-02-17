import type { CreatePeriodDto, Period, UpdatePeriodDto } from '@types';
import { api } from '../lib/axios.ts';
import { handleApiRequest } from '../lib/api-handler.ts';

export const getPeriodsService = async (): Promise<Period[]> => {
  return handleApiRequest(api.get(`/periods`));
};

export const createPeriodService = async (
  data: CreatePeriodDto,
): Promise<Period> => {
  return handleApiRequest(api.post(`/periods`, data));
};

export const updatePeriodService = async (
  { periodId, ...data }: UpdatePeriodDto,
): Promise<Period> => {
  return handleApiRequest(api.patch(`/periods/${periodId}`, data));
};

export const deletePeriodService = async (
  periodId: string,
): Promise<{ message: string }> => {
  return handleApiRequest(api.delete(`/periods/${periodId}`));
};

export const advanceSemesterService = async (
  newPeriodId: string,
): Promise<{ message: string }> => {
  return handleApiRequest(api.post(`/periods/advance-semester`, { newPeriodId: newPeriodId }));
};

import { handleApiRequest } from '@lib/api-handler.ts';
import { api } from '@lib/axios.ts';

export interface DashboardStats {
  totalStudents: number;
  totalSubjects: number;
  periodsCount: number;
}

// Estadisticas
export const getDashboardStatsService = async (): Promise<DashboardStats> => {
  return handleApiRequest(api.get('/admins/dashboard-stats'));
};

// Lista de Grupos (Para el Select)
export const getGroupsService = async () => {
  const { data } = await api.get('/admins/groups');
  return data as number[]; // Devuelve array de números [1, 35, 40...]
};
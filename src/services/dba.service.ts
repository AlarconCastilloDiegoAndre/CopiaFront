import { api } from '@/lib/axios';

export interface DbaStudentResult {
  studentId: number;
  name: string;
  email: string;
  semester: number;
  career: string;
}

export const validateDbaTokenService = async (token: string) => {
  const { data } = await api.get('/dba/validate', {
    params: { token },
  });
  return data as { valid: boolean };
};

export const searchStudentsDbaService = async (token: string, query: string) => {
  const { data } = await api.get('/dba/students/search', {
    params: { token, q: query },
  });
  return data as DbaStudentResult[];
};

export const resetStudentPasswordDbaService = async (
  token: string,
  studentId: number,
  newPassword: string,
) => {
  const { data } = await api.patch(
    '/dba/students/reset-password',
    { studentId, newPassword },
    { params: { token } },
  );
  return data as { message: string };
};

// ============================================
// Submission Logs Types & Service
// ============================================

export interface SubmissionLog {
  logId: string;
  adminUsername: string;
  studentId: number | null;
  entity: string;
  entityId: string;
  action: 'create' | 'update' | 'delete';
  reason: string | null;
  changesJson: Record<string, any> | null;
  ts: string;
}

export interface SubmissionLogsResponse {
  data: SubmissionLog[];
  page: number;
  limit: number;
  total: number;
}

export interface SubmissionLogsFilters {
  adminUsername?: string;
  studentId?: string;
  entity?: string;
  entityId?: string;
  action?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export const getSubmissionLogsService = async (
  filters: SubmissionLogsFilters = {},
): Promise<SubmissionLogsResponse> => {
  const { data } = await api.get('/submission-logs', {
    params: {
      ...filters,
    },
  });
  return data;
};
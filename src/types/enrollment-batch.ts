// Tipos para el sistema de inscripciones batch

export type EnrollmentType = 'NORMAL' | 'ADELANTO' | 'RECURSAMIENTO';

export interface EnrollmentItem {
  careerSubjectId: number;
  type: EnrollmentType;
}

export interface CreateEnrollmentBatchDTO {
  periodId: string;
  items: EnrollmentItem[];
}

export interface EnrollmentBatchResponse {
  message: string;
  summary: {
    total: number;
    normal: number;
    adelanto: number;
    recursamiento: number;
  };
  enrollments: Array<{
    enrollmentId: string;
    careerSubjectId: number;
    type: EnrollmentType;
    state: string;
  }>;
}
// Tipos específicos para el Dashboard Administrativo
export interface EnrollmentRow {
  uniqueId: string;
  careerSubjectId: number;
  career: string;
  semester: number | null;
  group: number | null;
  subject: string;
  type: 'NORMAL' | 'ADELANTO' | 'RECURSAMIENTO';
  totalStudents: number;
}

// Tipos para ordenamiento
export type SortColumn = 'career' | 'subject' | 'semester' | 'type' | 'totalStudents' | null;
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  column: SortColumn;
  direction: SortDirection;
}
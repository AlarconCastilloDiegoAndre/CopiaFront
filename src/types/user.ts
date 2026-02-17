import type { Career } from './career.ts';

export interface Student {
  studentId: number;
  name: string;
  email: string;
  groupNo: number;
  semester: number;
  career: Career;
  status: 'ACTIVO' | 'EGRESADO';
  rol: 'Student';
}

export interface Admin {
  name: string;
  username: string;
  department: string;
  rol: 'Admin';
}

export type User = Admin | Student;
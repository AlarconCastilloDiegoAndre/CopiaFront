import type { Subject } from './subject.ts';

export interface CareerSubject{
  career_subject_id: number;
  career: string;
  subject: Subject;
  semester: number;
}
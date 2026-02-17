export interface EnrollmentContext {
  subject: string;
  career: string;
  semester: number | null;
  group: number | string;
  type: 'NORMAL' | 'RECURSAMIENTO' | 'ADELANTO';
}

export interface EnrolledStudent {
  enrollmentId: string;
  state: 'BORRADOR' | 'CONFIRMADO' | 'CANCELADO';
  studentId: number;
  name: string;
  email: string;
  groupNo: number;
}

export interface EnrollmentDetailsResponse {
  context: EnrollmentContext;
  students: EnrolledStudent[];
}

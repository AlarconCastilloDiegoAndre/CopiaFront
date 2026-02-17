export interface AdminLoginDto {
  username: string;
  password: string;
}

export interface StudentLoginDto {
  studentId: number;
  password: string;
}

export interface StudentRegisterDto {
  studentId: number;
  name: string;
  email: string;
  password: string;
  groupNo: number;
  semester: number;
  careerId: string;
}
export interface CreateCareerSubjectDTO {
  careerId: string;
  subjectId: number;
  semester: number;
}

export interface UpdateCareerSubjectDTO {
  careerSubjectId: number;
  newSemester: number;
}
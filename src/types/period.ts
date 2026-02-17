export interface Period {
    periodId: string;
    startDate: string;
    endDate: string;
    active: boolean;
}

export interface CreatePeriodDto {
  periodId: string;
  startDate: string;
  endDate: string;
}

export interface UpdatePeriodDto {
  periodId: string;
  startDate: string;
  endDate: string;
  active: boolean;
}
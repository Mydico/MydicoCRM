export interface ITblReportDate {
  id?: number;
  date?: number;
  siteId?: number;
  saleId?: number;
  totalMoney?: number;
  realMoney?: number;
  reduceMoney?: number;
  createdAt?: number;
  updatedAt?: number;
  teamId?: number;
}

export const defaultValue: Readonly<ITblReportDate> = {};

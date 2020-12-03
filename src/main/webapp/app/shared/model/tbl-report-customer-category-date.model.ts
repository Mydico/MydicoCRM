export interface ITblReportCustomerCategoryDate {
  id?: number;
  date?: number;
  categoryId?: number;
  siteId?: number;
  totalMoney?: number;
  realMoney?: number;
  reduceMoney?: number;
  createdAt?: number;
  updatedAt?: number;
}

export const defaultValue: Readonly<ITblReportCustomerCategoryDate> = {};

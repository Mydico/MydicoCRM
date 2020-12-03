export interface ITblBill {
  id?: number;
  customerId?: number;
  orderId?: number;
  storeId?: number;
  status?: number;
  isDel?: boolean;
  note?: string;
  createdAt?: number;
  createdBy?: number;
  updatedAt?: number;
  updatedBy?: number;
  code?: string;
  saleId?: number;
  siteId?: number;
}

export const defaultValue: Readonly<ITblBill> = {
  isDel: false
};

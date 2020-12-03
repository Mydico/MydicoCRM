export interface ITblCustomerCall {
  id?: number;
  statusId?: number;
  comment?: string;
  customerId?: number;
  createdAt?: number;
  createdBy?: number;
  updatedAt?: number;
  updatedBy?: number;
  isDel?: boolean;
  siteId?: number;
}

export const defaultValue: Readonly<ITblCustomerCall> = {
  isDel: false
};

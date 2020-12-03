export interface ITblStoreInput {
  id?: number;
  createdAt?: number;
  createdBy?: number;
  updatedAt?: number;
  updatedBy?: number;
  isDel?: boolean;
  summary?: string;
  type?: number;
  status?: number;
  customerId?: number;
  orderId?: number;
  totalMoney?: number;
  note?: string;
  siteId?: number;
  storeOutputId?: number;
  storeInputId?: number;
}

export const defaultValue: Readonly<ITblStoreInput> = {
  isDel: false
};

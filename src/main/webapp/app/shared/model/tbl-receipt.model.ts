export interface ITblReceipt {
  id?: number;
  customerId?: number;
  code?: string;
  status?: number;
  isDel?: boolean;
  note?: string;
  money?: number;
  createdAt?: number;
  createdBy?: number;
  updatedAt?: number;
  updatedBy?: number;
  type?: number;
  storeInputId?: number;
  siteId?: number;
}

export const defaultValue: Readonly<ITblReceipt> = {
  isDel: false
};

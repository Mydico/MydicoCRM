export interface ITblTransportLog {
  id?: number;
  userId?: number;
  customerId?: number;
  orderId?: number;
  billId?: number;
  storeId?: number;
  status?: number;
  isDel?: boolean;
  note?: string;
  createdAt?: number;
  createdBy?: string;
  updatedAt?: number;
  updatedBy?: string;
  siteId?: number;
}

export const defaultValue: Readonly<ITblTransportLog> = {
  isDel: false
};

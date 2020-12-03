export interface ITblOrderPush {
  id?: number;
  orderId?: number;
  transportId?: number;
  repon?: string;
  isDel?: boolean;
  createdAt?: number;
  updatedAt?: number;
  code?: string;
  note?: string;
  status?: number;
  siteId?: number;
}

export const defaultValue: Readonly<ITblOrderPush> = {
  isDel: false
};

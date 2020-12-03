export interface ITblOrder {
  id?: number;
  createdAt?: number;
  createdBy?: number;
  updatedAt?: number;
  updatedBy?: number;
  isDel?: boolean;
  customerId?: number;
  customerName?: string;
  customerTel?: string;
  cityId?: number;
  districtId?: number;
  wardsId?: number;
  address?: string;
  codCode?: string;
  status?: number;
  storeId?: number;
  transportId?: number;
  totalMoney?: number;
  summary?: string;
  requestId?: number;
  note?: string;
  customerNote?: string;
  pushStatus?: boolean;
  promotionId?: number;
  promotionItemId?: number;
  realMoney?: number;
  reduceMoney?: number;
  siteId?: number;
}

export const defaultValue: Readonly<ITblOrder> = {
  isDel: false,
  pushStatus: false
};

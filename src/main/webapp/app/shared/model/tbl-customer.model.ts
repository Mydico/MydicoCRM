export interface ITblCustomer {
  id?: number;
  name?: string;
  tel?: string;
  cityId?: number;
  districtId?: number;
  wardsId?: number;
  address?: string;
  fanpageId?: number;
  yearOfBirth?: number;
  obclubJoinTime?: number;
  estimateRevenueMonth?: number;
  capacity?: number;
  marriage?: boolean;
  skinId?: number;
  categoryId?: number;
  statusId?: number;
  requestId?: number;
  createdAt?: number;
  createdBy?: number;
  updatedAt?: number;
  updatedBy?: number;
  isDel?: boolean;
  productId?: number;
  userIds?: string;
  email?: string;
  type?: number;
  level?: number;
  code?: string;
  contactName?: string;
  note?: string;
  contactYearOfBirth?: number;
  totalDebt?: number;
  earlyDebt?: number;
  siteId?: number;
}

export const defaultValue: Readonly<ITblCustomer> = {
  marriage: false,
  isDel: false
};

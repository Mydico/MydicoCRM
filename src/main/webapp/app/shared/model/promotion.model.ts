export interface IPromotion {
  id?: number;
  startTime?: number;
  endTime?: number;
  name?: string;
  description?: string;
  totalRevenue?: number;
  customerTargetType?: number;
  createdAt?: number;
  updatedAt?: number;
  createdBy?: number;
  updatedBy?: number;
  siteId?: number;
  image?: string;
}

export const defaultValue: Readonly<IPromotion> = {};

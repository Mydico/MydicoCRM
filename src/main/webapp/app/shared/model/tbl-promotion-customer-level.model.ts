export interface ITblPromotionCustomerLevel {
  id?: number;
  customerId?: number;
  promotionId?: number;
  promotionItemId?: number;
  totalMoney?: number;
  updatedAt?: number;
  createdAt?: number;
  siteId?: number;
}

export const defaultValue: Readonly<ITblPromotionCustomerLevel> = {};

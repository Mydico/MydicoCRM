export interface ITblPromotionItem {
  id?: number;
  name?: string;
  totalMoney?: number;
  reducePercent?: number;
  note?: string;
  productGroupId?: number;
  promotionId?: number;
  createdAt?: number;
  updatedAt?: number;
  siteId?: number;
}

export const defaultValue: Readonly<ITblPromotionItem> = {};

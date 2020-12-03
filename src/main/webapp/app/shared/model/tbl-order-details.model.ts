export interface ITblOrderDetails {
  id?: number;
  createdAt?: number;
  createdBy?: number;
  updatedAt?: number;
  updatedBy?: number;
  isDel?: boolean;
  productId?: number;
  detailId?: number;
  quantity?: number;
  price?: number;
  storeId?: number;
  priceTotal?: number;
  reducePercent?: number;
  priceReal?: number;
  siteId?: number;
  orderId?: number;
}

export const defaultValue: Readonly<ITblOrderDetails> = {
  isDel: false
};

export interface ITblProductQuantity {
  id?: number;
  quantity?: number;
  createdAt?: number;
  createdBy?: number;
  updatedAt?: number;
  updatedBy?: number;
  isDel?: boolean;
  storeId?: number;
  detailId?: number;
}

export const defaultValue: Readonly<ITblProductQuantity> = {
  isDel: false
};

export interface ITblProductGroupMap {
  id?: number;
  groupId?: number;
  productId?: number;
  createdAt?: number;
  createdBy?: string;
  updatedAt?: number;
  updatedBy?: string;
}

export const defaultValue: Readonly<ITblProductGroupMap> = {};

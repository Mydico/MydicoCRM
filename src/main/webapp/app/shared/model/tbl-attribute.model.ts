export interface ITblAttribute {
  id?: number;
  name?: string;
  createdAt?: number;
  createdBy?: number;
  updatedAt?: number;
  updatedBy?: number;
  isDel?: boolean;
  siteId?: number;
  productId?: number;
}

export const defaultValue: Readonly<ITblAttribute> = {
  isDel: false
};

export interface ITblAttributeValue {
  id?: number;
  name?: string;
  productId?: number;
  createdAt?: number;
  createdBy?: number;
  updatedAt?: number;
  updatedBy?: number;
  isDel?: boolean;
  siteId?: number;
  attributeId?: number;
}

export const defaultValue: Readonly<ITblAttributeValue> = {
  isDel: false
};

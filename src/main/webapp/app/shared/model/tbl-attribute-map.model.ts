export interface ITblAttributeMap {
  id?: number;
  createdAt?: number;
  createdBy?: number;
  updatedAt?: number;
  updatedBy?: number;
  siteId?: number;
  detailId?: number;
  valueId?: number;
}

export const defaultValue: Readonly<ITblAttributeMap> = {};

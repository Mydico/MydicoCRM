export interface ITblCity {
  id?: number;
  name?: string;
  createdAt?: number;
  createdBy?: number;
  updatedAt?: number;
  updatedBy?: number;
  isDel?: boolean;
  storeId?: number;
  codIds?: string;
}

export const defaultValue: Readonly<ITblCity> = {
  isDel: false
};

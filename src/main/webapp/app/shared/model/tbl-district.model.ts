export interface ITblDistrict {
  id?: number;
  name?: string;
  createdAt?: number;
  createdBy?: number;
  updatedAt?: number;
  updatedBy?: number;
  isDel?: boolean;
  storeId?: number;
  codIds?: string;
  cityId?: number;
}

export const defaultValue: Readonly<ITblDistrict> = {
  isDel: false
};

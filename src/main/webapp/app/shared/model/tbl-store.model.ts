export interface ITblStore {
  id?: number;
  name?: string;
  address?: string;
  tel?: string;
  createdAt?: number;
  createdBy?: number;
  updatedAt?: number;
  updatedBy?: number;
  isDel?: boolean;
  transportId?: number;
  siteId?: number;
  cityId?: number;
  districtId?: number;
  wardsId?: number;
}

export const defaultValue: Readonly<ITblStore> = {
  isDel: false
};

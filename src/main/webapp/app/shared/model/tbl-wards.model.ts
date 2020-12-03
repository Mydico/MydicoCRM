export interface ITblWards {
  id?: number;
  name?: string;
  createdAt?: number;
  createdBy?: number;
  updatedAt?: number;
  updatedBy?: number;
  isDel?: boolean;
  districtId?: number;
}

export const defaultValue: Readonly<ITblWards> = {
  isDel: false
};

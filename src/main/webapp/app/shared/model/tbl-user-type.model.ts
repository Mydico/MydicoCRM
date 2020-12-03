export interface ITblUserType {
  id?: number;
  name?: string;
  percent?: number;
  createdAt?: number;
  createdBy?: number;
  updatedAt?: number;
  updatedBy?: number;
  isDel?: boolean;
  siteId?: number;
}

export const defaultValue: Readonly<ITblUserType> = {
  isDel: false
};

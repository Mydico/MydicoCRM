export interface ITblProduct {
  id?: number;
  name?: string;
  image?: string;
  desc?: string;
  createdAt?: number;
  createdBy?: number;
  updatedAt?: number;
  updatedBy?: number;
  isDel?: boolean;
  code?: string;
  status?: number;
  price?: number;
  unit?: number;
  agentPrice?: number;
}

export const defaultValue: Readonly<ITblProduct> = {
  isDel: false
};

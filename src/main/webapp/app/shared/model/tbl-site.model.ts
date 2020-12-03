export interface ITblSite {
  id?: number;
  name?: string;
  address?: string;
  createdAt?: number;
  createdBy?: string;
  updatedAt?: number;
  updatedBy?: string;
}

export const defaultValue: Readonly<ITblSite> = {};

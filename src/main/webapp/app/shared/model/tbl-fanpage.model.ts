export interface ITblFanpage {
  id?: number;
  name?: string;
  link?: string;
  createdAt?: number;
  createdBy?: number;
  updatedAt?: number;
  updatedBy?: number;
  isDel?: boolean;
  code?: string;
  siteId?: number;
}

export const defaultValue: Readonly<ITblFanpage> = {
  isDel: false
};

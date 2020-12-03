export interface ITblTransport {
  id?: number;
  name?: string;
  desc?: string;
  createdAt?: number;
  createdBy?: number;
  updatedAt?: number;
  updatedBy?: number;
  isDel?: boolean;
  siteId?: number;
}

export const defaultValue: Readonly<ITblTransport> = {
  isDel: false
};

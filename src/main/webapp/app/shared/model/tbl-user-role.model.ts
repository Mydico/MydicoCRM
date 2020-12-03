export interface ITblUserRole {
  id?: number;
  name?: string;
  permission?: string;
  siteId?: number;
}

export const defaultValue: Readonly<ITblUserRole> = {};

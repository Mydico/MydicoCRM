export interface ITblUserTeam {
  id?: number;
  name?: string;
  leaderId?: number;
  createdAt?: number;
  createdBy?: number;
  updatedAt?: number;
  updatedBy?: number;
  isDel?: boolean;
  siteId?: number;
}

export const defaultValue: Readonly<ITblUserTeam> = {
  isDel: false
};

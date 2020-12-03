export interface ITblSiteMapDomain {
  id?: number;
  siteId?: number;
  domain?: string;
  createdAt?: number;
  createdBy?: string;
  updatedAt?: number;
  updatedBy?: string;
}

export const defaultValue: Readonly<ITblSiteMapDomain> = {};

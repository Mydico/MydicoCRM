export interface ITblStoreInputDetails {
  id?: number;
  quantity?: number;
  isDel?: boolean;
  price?: number;
  siteId?: number;
  nhapkhoId?: number;
  chitietId?: number;
}

export const defaultValue: Readonly<ITblStoreInputDetails> = {
  isDel: false
};

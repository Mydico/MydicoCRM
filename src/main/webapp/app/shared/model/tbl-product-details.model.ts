export interface ITblProductDetails {
  id?: number;
  barcode?: string;
  createdAt?: number;
  createdBy?: number;
  updatedAt?: number;
  updatedBy?: number;
  isDel?: boolean;
  name?: string;
  productId?: number;
}

export const defaultValue: Readonly<ITblProductDetails> = {
  isDel: false
};

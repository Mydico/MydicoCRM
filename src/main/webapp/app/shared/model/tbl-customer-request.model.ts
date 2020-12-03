export interface ITblCustomerRequest {
  id?: number;
  name?: string;
  tel?: string;
  node?: string;
  isDel?: boolean;
  createdAt?: number;
  createdBy?: number;
  updatedAt?: number;
  updateBy?: number;
  userId?: number;
  email?: string;
  status?: boolean;
  siteId?: number;
  productId?: number;
  typeId?: number;
  fanpageId?: number;
}

export const defaultValue: Readonly<ITblCustomerRequest> = {
  isDel: false,
  status: false
};

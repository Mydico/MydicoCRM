export interface ICustomerToken {
  id?: number;
  type?: boolean;
  token?: string;
  tokenHash?: string;
  expiredAt?: number;
  createdAt?: number;
  updatedAt?: number;
  customerId?: number;
}

export const defaultValue: Readonly<ICustomerToken> = {
  type: false
};

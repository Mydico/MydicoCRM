export interface IUserToken {
  id?: number;
  type?: boolean;
  token?: string;
  tokenHash?: string;
  expiredAt?: number;
  createdAt?: number;
  updatedAt?: number;
  userId?: number;
}

export const defaultValue: Readonly<IUserToken> = {
  type: false
};

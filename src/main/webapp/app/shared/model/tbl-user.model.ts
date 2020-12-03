export interface ITblUser {
  id?: number;
  username?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  authKey?: string;
  passwordHash?: string;
  passwordResetToken?: string;
  status?: number;
  createdAt?: number;
  updatedAt?: number;
  typeId?: number;
  teamId?: number;
  storeId?: number;
  siteId?: number;
  roleId?: number;
}

export const defaultValue: Readonly<ITblUser> = {};

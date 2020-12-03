export interface ITblUserDeviceToken {
  id?: number;
  userId?: number;
  deviceToken?: string;
  createdAt?: number;
  updatedAt?: number;
}

export const defaultValue: Readonly<ITblUserDeviceToken> = {};

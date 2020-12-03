export interface ITblUserNotify {
  id?: number;
  userId?: number;
  title?: string;
  content?: string;
  isRead?: number;
  createdAt?: number;
  updatedAt?: number;
  type?: number;
  referenceId?: number;
}

export const defaultValue: Readonly<ITblUserNotify> = {};

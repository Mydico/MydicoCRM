export interface ITblProductGroup {
  id?: number;
  name?: string;
  description?: string;
  createdAt?: number;
  createdBy?: string;
  updatedAt?: number;
  updatedBy?: string;
}

export const defaultValue: Readonly<ITblProductGroup> = {};

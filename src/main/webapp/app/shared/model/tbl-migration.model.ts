export interface ITblMigration {
  id?: number;
  version?: string;
  applyTime?: number;
}

export const defaultValue: Readonly<ITblMigration> = {};

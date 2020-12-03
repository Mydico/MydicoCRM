export interface ITblCodlog {
  id?: number;
  transportId?: number;
  content?: string;
  time?: number;
  orderId?: number;
  siteId?: number;
}

export const defaultValue: Readonly<ITblCodlog> = {};

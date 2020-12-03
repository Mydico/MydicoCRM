export interface ITblTransaction {
  id?: number;
  customerId?: number;
  orderId?: number;
  storeId?: number;
  billId?: number;
  status?: number;
  isDel?: boolean;
  note?: string;
  createdAt?: number;
  createdBy?: number;
  updatedAt?: number;
  updatedBy?: number;
  saleId?: number;
  totalMoney?: number;
  refundMoney?: number;
  type?: number;
  earlyDebt?: number;
  debit?: number;
  debitYes?: number;
  receiptId?: number;
  siteId?: number;
}

export const defaultValue: Readonly<ITblTransaction> = {
  isDel: false
};

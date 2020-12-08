/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

/**
 * A Transaction.
 */
@Entity('transaction')
export default class Transaction extends BaseEntity {
  @Column({ type: 'integer', name: 'customer_id' })
  customerId: number;

  @Column({ type: 'integer', name: 'order_id', nullable: true })
  orderId: number;

  @Column({ type: 'integer', name: 'store_id', nullable: true })
  storeId: number;

  @Column({ type: 'integer', name: 'bill_id', nullable: true })
  billId: number;

  /**
   * 0 : chưa thanh toán, 1 : đã thanh toán
   */
  @Column({ type: 'integer', name: 'status', nullable: true })
  status: number;

  @Column({ type: 'boolean', name: 'is_del', nullable: true })
  isDel: boolean;

  @Column({ name: 'note', length: 255, nullable: true })
  note: string;



  @Column({ type: 'integer', name: 'sale_id', nullable: true })
  saleId: number;

  @Column({ type: 'integer', name: 'total_money', nullable: true })
  totalMoney: number;

  /**
   * Số tiền hòa trả do trả hàng
   */
  @Column({ type: 'integer', name: 'refund_money', nullable: true })
  refundMoney: number;

  /**
   * 0 : ghi nợ, 1 : thu công nợ, 2 thu tiền mặt
   */
  @Column({ type: 'integer', name: 'type', nullable: true })
  type: number;

  /**
   * công nợ đầu kỳ
   */
  @Column({ type: 'integer', name: 'early_debt', nullable: true })
  earlyDebt: number;

  /**
   * ghi nợ
   */
  @Column({ type: 'integer', name: 'debit', nullable: true })
  debit: number;

  /**
   * ghi có
   */
  @Column({ type: 'integer', name: 'debit_yes', nullable: true })
  debitYes: number;

  /**
   * id phiếu thu
   */
  @Column({ type: 'integer', name: 'receipt_id', nullable: true })
  receiptId: number;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

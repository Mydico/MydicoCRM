/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

/**
 * A Receipt.
 */
@Entity('receipt')
export default class Receipt extends BaseEntity {
  @Column({ type: 'integer', name: 'customer_id' })
  customerId: number;

  /**
   * mã phiếu thu (số phiếu thu)
   */
  @Column({ name: 'code', length: 255, nullable: true })
  code: string;

  /**
   * 0 :un active, 1 : active
   */
  @Column({ type: 'integer', name: 'status', nullable: true })
  status: number;

  @Column({ type: 'boolean', name: 'is_del', nullable: true })
  isDel: boolean;

  @Column({ name: 'note', length: 255, nullable: true })
  note: string;

  /**
   * Số tiền thu được của khách hàng
   */
  @Column({ type: 'integer', name: 'money', nullable: true })
  money: number;



  /**
   * 0 - Thu từ công nợ, 1 - Trừ công nợ do trả hàng
   */
  @Column({ type: 'integer', name: 'type', nullable: true })
  type: number;

  /**
   * đơn trả hàng
   */
  @Column({ type: 'integer', name: 'store_input_id', nullable: true })
  storeInputId: number;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

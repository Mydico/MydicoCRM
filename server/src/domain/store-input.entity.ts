/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import Store from './store.entity';

/**
 * A StoreInput.
 */
@Entity('store_input')
export default class StoreInput extends BaseEntity {


  @Column({ type: 'boolean', name: 'is_del', nullable: true })
  isDel: boolean;

  @Column({ name: 'summary', length: 255, nullable: true })
  summary: string;

  /**
   * Kiểu nhập kho : 0 - Nhập mới, 1 - Nhập trả
   */
  @Column({ type: 'integer', name: 'type', nullable: true })
  type: number;

  /**
   * Trạng thái đơn nhập : 0 - Chưa duyệt, 1 - Đã duyệt, 2 - Hủy duyệt
   */
  @Column({ type: 'integer', name: 'status', nullable: true })
  status: number;

  @Column({ type: 'integer', name: 'customer_id', nullable: true })
  customerId: number;

  @Column({ type: 'integer', name: 'order_id', nullable: true })
  orderId: number;

  @Column({ type: 'integer', name: 'total_money', nullable: true })
  totalMoney: number;

  @Column({ name: 'note', length: 255, nullable: true })
  note: string;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  @ManyToOne(type => Store)
  storeOutput: Store;

  @ManyToOne(type => Store)
  storeInput: Store;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
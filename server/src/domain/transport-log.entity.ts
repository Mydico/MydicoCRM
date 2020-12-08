/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

/**
 * A TransportLog.
 */
@Entity('transport_log')
export default class TransportLog extends BaseEntity {
  /**
   * User vận chuyển đơn hàng
   */
  @Column({ type: 'integer', name: 'user_id' })
  userId: number;

  @Column({ type: 'integer', name: 'customer_id' })
  customerId: number;

  @Column({ type: 'integer', name: 'order_id' })
  orderId: number;

  @Column({ type: 'integer', name: 'bill_id' })
  billId: number;

  @Column({ type: 'integer', name: 'store_id' })
  storeId: number;

  /**
   * 1: Đang vận chuyển, 2 : đã giao cho khách , 3 : khách không nhận hàng (chuyển lại về kho), 4 : Đã trả về kho
   */
  @Column({ type: 'integer', name: 'status', nullable: true })
  status: number;

  @Column({ type: 'boolean', name: 'is_del', nullable: true })
  isDel: boolean;

  @Column({ name: 'note', length: 255, nullable: true })
  note: string;

  @Column({ type: 'integer', name: 'created_at', nullable: true })
  createdAt: number;

  @Column({ name: 'created_by', length: 255, nullable: true })
  createdBy: string;

  @Column({ type: 'integer', name: 'updated_at', nullable: true })
  updatedAt: number;

  @Column({ name: 'updated_by', length: 255, nullable: true })
  updatedBy: string;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

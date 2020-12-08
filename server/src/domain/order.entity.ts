/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

/**
 * A Order.
 */
@Entity('mdc_order')
export default class Order extends BaseEntity {

  @Column({ type: 'boolean', name: 'is_del', nullable: true })
  isDel: boolean;

  @Column({ type: 'integer', name: 'customer_id', nullable: true })
  customerId: number;

  @Column({ name: 'customer_name', length: 255, nullable: true })
  customerName: string;

  @Column({ name: 'customer_tel', length: 255, nullable: true })
  customerTel: string;

  @Column({ type: 'integer', name: 'city_id', nullable: true })
  cityId: number;

  @Column({ type: 'integer', name: 'district_id', nullable: true })
  districtId: number;

  @Column({ type: 'integer', name: 'wards_id', nullable: true })
  wardsId: number;

  @Column({ name: 'address', length: 255, nullable: true })
  address: string;

  @Column({ name: 'cod_code', length: 255, nullable: true })
  codCode: string;

  @Column({ type: 'integer', name: 'status', nullable: true })
  status: number;

  @Column({ type: 'integer', name: 'store_id', nullable: true })
  storeId: number;

  @Column({ type: 'integer', name: 'transport_id', nullable: true })
  transportId: number;

  /**
   * tổng tiền
   */
  @Column({ type: 'double', name: 'total_money', nullable: true })
  totalMoney: number;

  @Column({ name: 'summary', length: 255, nullable: true })
  summary: string;

  @Column({ type: 'integer', name: 'request_id', nullable: true })
  requestId: number;

  @Column({ name: 'note', length: 500, nullable: true })
  note: string;

  @Column({ name: 'customer_note', length: 250, nullable: true })
  customerNote: string;

  @Column({ type: 'boolean', name: 'push_status', nullable: true })
  pushStatus: boolean;

  @Column({ type: 'integer', name: 'promotion_id', nullable: true })
  promotionId: number;

  @Column({ type: 'integer', name: 'promotion_item_id', nullable: true })
  promotionItemId: number;

  @Column({ type: 'integer', name: 'real_money', nullable: true })
  realMoney: number;

  @Column({ type: 'integer', name: 'reduce_money', nullable: true })
  reduceMoney: number;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

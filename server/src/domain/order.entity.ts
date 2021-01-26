/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';
import Customer from './customer.entity';
import City from './city.entity';
import District from './district.entity';
import Wards from './wards.entity';
import Store from './store.entity';
import Promotion from './promotion.entity';
import { OrderStatus } from './enumeration/order-status';
import OrderDetails from './order-details.entity';

/**
 * A Order.
 */
@Entity('order')
export default class Order extends BaseEntity {
  @Column({ type: 'boolean', name: 'is_del', nullable: true })
  isDel: boolean;

  @ManyToOne(type => Customer, customer => customer.order, { cascade: true })
  customer: Customer;

  @ManyToOne(type => City)
  city: City;

  @ManyToOne(type => District)
  district: District;

  @ManyToOne(type => Wards)
  wards: Wards;

  @Column({ name: 'address', length: 255, nullable: true })
  address: string;

  @Column({ name: 'code', length: 255, nullable: true })
  code: string;

  @Column({ name: 'cod_code', length: 255, nullable: true })
  codCode: string;

  @Column({ type: 'simple-enum', name: 'status', enum: OrderStatus, default: OrderStatus.WAITING })
  status: OrderStatus;

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

  @ManyToOne(type => Promotion, promotion => promotion.orders, { cascade: true })
  promotion: Promotion;

  @OneToMany(type => OrderDetails, orderDetails => orderDetails.order, { cascade: true })
  orderDetails: OrderDetails;

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

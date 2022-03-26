/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne, OneToMany, Index, JoinColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import Customer from './customer.entity';
import Store from './store.entity';
import Promotion from './promotion.entity';
import { OrderStatus } from './enumeration/order-status';
import OrderDetails from './order-details.entity';
import PromotionItem from './promotion-item.entity';
import Bill from './bill.entity';
import Department from './department.entity';
import { User } from './user.entity';
import Branch from './branch.entity';
import StoreInput from './store-input.entity';

/**
 * A Order.
 */
@Entity('order')
export default class Order extends BaseEntity {
  @ManyToOne(type => Customer, { createForeignKeyConstraints: false })
  customer?: Customer;

  @Column({ name: 'customer_name', length: 255, nullable: true })
  customerName?: string;

  @ManyToOne(type => Store, { createForeignKeyConstraints: false })
  store?: Store;

  @ManyToOne(type => Department, { createForeignKeyConstraints: false })
  department?: Department;

  @Column({ name: 'address', length: 255, nullable: true })
  @Index()
  address?: string;

  @Column({ name: 'reject', length: 255, nullable: true })
  @Index()
  reject?: string;

  @Column({ name: 'code', length: 255, nullable: true })
  @Index()
  code?: string;

  @Column({ type: 'simple-enum', name: 'status', enum: OrderStatus, default: OrderStatus.WAITING })
  @Index()
  status?: OrderStatus;

  @ManyToOne(type => Branch, { createForeignKeyConstraints: false })
  branch?: Branch;

  // @ManyToOne(type => StoreInput)
  // storeInput?: StoreInput;

  @ManyToOne(type => PromotionItem, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', createForeignKeyConstraints: false })
  promotionItem?: PromotionItem;

  @Column({ name: 'bill_date', nullable: true })
  billDate?: Date;
  /**
   * tổng tiền
   */
  @Column({ type: 'bigint', name: 'total_money', nullable: true })
  @Index()
  totalMoney?: number;

  @Column({ name: 'note', length: 500, nullable: true })
  @Index()
  note?: string;

  @ManyToOne(type => Promotion, { createForeignKeyConstraints: false })
  promotion?: Promotion;

  @OneToMany(type => OrderDetails, orderDetails => orderDetails.order, { cascade: ['insert', 'update'], nullable: false })
  @JoinColumn({ name: "orderId", referencedColumnName: "id"})
  orderDetails?: OrderDetails[];

  @OneToMany(type => Bill, bill => bill.order)
  bill?: Bill;

  @ManyToOne(type => User, { createForeignKeyConstraints: false })
  sale?: User;

  @Column({ type: 'bigint', name: 'real_money', nullable: true })
  @Index()
  realMoney?: number;

  @Column({ type: 'bigint', name: 'reduce_money', nullable: true })
  @Index()
  reduceMoney?: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

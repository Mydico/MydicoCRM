/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
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

/**
 * A Order.
 */
@Entity('order')
export default class Order extends BaseEntity {

  @ManyToOne(type => Customer, customer => customer.order)
  customer?: Customer;

  @Column({ name: 'customer_name', length: 255, nullable: true })
  customerName?: string;

  @ManyToOne(type => Store, store => store.order)
  store?: Store;

  @ManyToOne(type => Department, department => department.orders)
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

  @Column({ name: 'cod_code', length: 255, nullable: true })
  @Index()
  codCode?: string;

  @Column({ type: 'simple-enum', name: 'status', enum: OrderStatus, default: OrderStatus.WAITING })
  @Index()
  status?: OrderStatus;

  @Column({ type: 'integer', name: 'transport_id', nullable: true })
  @Index()
  transportId?: number;

  /**
   * tổng tiền
   */
  @Column({ type: 'bigint', name: 'total_money', nullable: true })
  @Index()
  totalMoney?: number;

  @Column({ name: 'note', length: 500, nullable: true })
  @Index()
  note?: string;


  @ManyToOne(type => Promotion, promotion => promotion.orders)
  promotion?: Promotion;

  @OneToMany(type => OrderDetails, orderDetails => orderDetails.order, { cascade: ['insert', 'update'] })
  orderDetails?: OrderDetails[];

  @OneToMany(type => Bill, bill => bill.order)
  bill?: Bill;

  @ManyToOne(type => User)
  sale?: User;

  @Column({ type: 'integer', name: 'promotion_item_id', nullable: true })
  @Index()
  promotionItem?: PromotionItem;

  @Column({ type: 'bigint', name: 'real_money', nullable: true })
  @Index()
  realMoney?: number;

  @Column({ type: 'bigint', name: 'reduce_money', nullable: true })
  @Index()
  reduceMoney?: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

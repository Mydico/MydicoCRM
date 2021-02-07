/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import Order from './order.entity';
import Product from './product.entity';
import Store from './store.entity';

/**
 * A OrderDetails.
 */
@Entity('order_details')
export default class OrderDetails extends BaseEntity {

  @Column({ type: 'boolean', name: 'is_del', nullable: true })
  isDel: boolean;

  @ManyToOne(type => Product, promotion => promotion, { cascade: true })
  product: Product;

  @Column({ type: 'integer', name: 'quantity', nullable: true })
  quantity: number;

  @Column({ type: 'bigint', name: 'price', nullable: true })
  price: number;

  @ManyToOne(type => Store, promotion => promotion, { cascade: true })
  store: Store;

  @Column({ type: 'double', name: 'price_total', nullable: true })
  priceTotal: number;

  @Column({ type: 'float', name: 'reduce_percent', nullable: true })
  reducePercent: number;

  @Column({ type: 'double', name: 'price_real', nullable: true })
  priceReal: number;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  @ManyToOne(type => Order)
  order: Order;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

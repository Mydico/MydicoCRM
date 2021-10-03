/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import StoreInput from './store-input.entity';
import ProductDetails from './product-details.entity';
import Product from './product.entity';

/**
 * A StoreInputDetails.
 */
@Entity('store_input_details')
export default class StoreInputDetails extends BaseEntity {
  @Column({ type: 'integer', name: 'quantity', nullable: true })
  @Index()
  quantity?: number;

  @Column({ type: 'bigint', name: 'price', nullable: true })
  @Index()
  price?: number;

  @Column({ name: 'reduce_percent', nullable: true })
  @Index()
  reducePercent?: number;

  @Column({ type: 'bigint', name: 'reduce', nullable: true })
  @Index()
  reduce?: number;

  @Column({ type: 'bigint', name: 'price_total', nullable: true })
  @Index()
  priceTotal?: number;

  @ManyToOne(type => StoreInput, { createForeignKeyConstraints: false })
  storeInput: StoreInput;

  @ManyToOne(type => Product, { createForeignKeyConstraints: false })
  product: Product;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

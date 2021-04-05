/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import StoreInput from './store-input.entity';
import ProductDetails from './product-details.entity';
import Product from './product.entity';

/**
 * A StoreInputDetails.
 */
@Entity('store_input_details')
export default class StoreInputDetails extends BaseEntity {
  @Column({ type: 'integer', name: 'quantity', nullable: true })
  quantity?: number;

  @Column({ type: 'bigint', name: 'price', nullable: true })
  price?: number;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId?: number;

  @ManyToOne(type => StoreInput)
  storeInput: StoreInput;

  @ManyToOne(type => Product)
  product: Product;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

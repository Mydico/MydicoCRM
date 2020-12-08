/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import Product from './product.entity';

/**
 * A ProductDetails.
 */
@Entity('product_details')
export default class ProductDetails extends BaseEntity {
  @Column({ name: 'barcode', length: 255, nullable: true })
  barcode: string;



  @Column({ type: 'boolean', name: 'is_del', nullable: true })
  isDel: boolean;

  @Column({ name: 'name', length: 250, nullable: true })
  name: string;

  @ManyToOne(type => Product)
  product: Product;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

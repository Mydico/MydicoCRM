/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';
import ProductGroup from './product-group.entity';

/**
 * A ProductBrand.
 */
@Entity('product_brand')
export default class ProductBrand extends BaseEntity {
  @Column({ name: 'name', length: 255, nullable: true })
  name: string;

  @Column({ name: 'description', length: 512, nullable: true })
  description: string;

  @OneToMany(type => ProductGroup, other => other.productBrand)
  productGroup? : ProductGroup[]
  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

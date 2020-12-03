/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import TblProduct from './tbl-product.entity';

/**
 * A TblProductDetails.
 */
@Entity('tbl_product_details')
export default class TblProductDetails extends BaseEntity {
  @Column({ name: 'barcode', length: 255, nullable: true })
  barcode: string;

  @Column({ type: 'integer', name: 'created_at', nullable: true })
  createdAt: number;

  @Column({ type: 'integer', name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ type: 'integer', name: 'updated_at', nullable: true })
  updatedAt: number;

  @Column({ type: 'integer', name: 'updated_by', nullable: true })
  updatedBy: number;

  @Column({ type: 'boolean', name: 'is_del', nullable: true })
  isDel: boolean;

  @Column({ name: 'name', length: 250, nullable: true })
  name: string;

  @ManyToOne(type => TblProduct)
  product: TblProduct;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

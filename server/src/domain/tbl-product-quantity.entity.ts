/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import TblStore from './tbl-store.entity';
import TblProductDetails from './tbl-product-details.entity';

/**
 * A TblProductQuantity.
 */
@Entity('tbl_product_quantity')
export default class TblProductQuantity extends BaseEntity {
  @Column({ type: 'integer', name: 'quantity' })
  quantity: number;



  @Column({ type: 'boolean', name: 'is_del', nullable: true })
  isDel: boolean;

  @ManyToOne(type => TblStore)
  store: TblStore;

  @ManyToOne(type => TblProductDetails)
  detail: TblProductDetails;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import TblStoreInput from './tbl-store-input.entity';
import TblProductDetails from './tbl-product-details.entity';

/**
 * A TblStoreInputDetails.
 */
@Entity('tbl_store_input_details')
export default class TblStoreInputDetails extends BaseEntity {
  @Column({ type: 'integer', name: 'quantity', nullable: true })
  quantity: number;

  @Column({ type: 'boolean', name: 'is_del', nullable: true })
  isDel: boolean;

  @Column({ type: 'integer', name: 'price', nullable: true })
  price: number;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  @ManyToOne(type => TblStoreInput)
  nhapkho: TblStoreInput;

  @ManyToOne(type => TblProductDetails)
  chitiet: TblProductDetails;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

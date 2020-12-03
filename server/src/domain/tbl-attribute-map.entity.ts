/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import TblProductDetails from './tbl-product-details.entity';
import TblAttributeValue from './tbl-attribute-value.entity';

/**
 * A TblAttributeMap.
 */
@Entity('tbl_attribute_map')
export default class TblAttributeMap extends BaseEntity {
  @Column({ type: 'integer', name: 'created_at', nullable: true })
  createdAt: number;

  @Column({ type: 'integer', name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ type: 'integer', name: 'updated_at', nullable: true })
  updatedAt: number;

  @Column({ type: 'integer', name: 'updated_by', nullable: true })
  updatedBy: number;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  @ManyToOne(type => TblProductDetails)
  detail: TblProductDetails;

  @ManyToOne(type => TblAttributeValue)
  value: TblAttributeValue;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

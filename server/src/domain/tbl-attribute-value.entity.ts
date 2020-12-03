/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import TblAttribute from './tbl-attribute.entity';

/**
 * A TblAttributeValue.
 */
@Entity('tbl_attribute_value')
export default class TblAttributeValue extends BaseEntity {
  @Column({ name: 'name', length: 255 })
  name: string;

  @Column({ type: 'integer', name: 'product_id', nullable: true })
  productId: number;

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

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  @ManyToOne(type => TblAttribute)
  attribute: TblAttribute;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

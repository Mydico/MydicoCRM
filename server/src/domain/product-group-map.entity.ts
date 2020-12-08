/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

/**
 * A ProductGroupMap.
 */
@Entity('product_group_map')
export default class ProductGroupMap extends BaseEntity {
  @Column({ type: 'integer', name: 'group_id' })
  groupId: number;

  @Column({ type: 'integer', name: 'product_id' })
  productId: number;

  @Column({ type: 'integer', name: 'created_at', nullable: true })
  createdAt: number;

  @Column({ name: 'created_by', length: 255, nullable: true })
  createdBy: string;

  @Column({ type: 'integer', name: 'updated_at', nullable: true })
  updatedAt: number;

  @Column({ name: 'updated_by', length: 255, nullable: true })
  updatedBy: string;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

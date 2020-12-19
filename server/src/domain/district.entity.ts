/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import City from './city.entity';

/**
 * A District.
 */
@Entity('district')
export default class District extends BaseEntity {
  @Column({ name: 'name', length: 255, nullable: true })
  name: string;

  @Column({ name: 'code', length: 255, nullable: true })
  code: string;

  @Column({ type: 'boolean', name: 'is_del', nullable: true })
  isDel: boolean;

  @Column({ type: 'integer', name: 'store_id', nullable: true })
  storeId?: number;

  @Column({ name: 'cod_ids', length: 250, nullable: true })
  codIds?: string;

  @Column({ name: 'city', length: 255, nullable: true })
  city: string;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

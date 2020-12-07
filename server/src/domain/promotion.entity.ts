/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

/**
 * A Promotion.
 */
@Entity('promotion')
export default class Promotion extends BaseEntity {
  @Column({ type: 'integer', name: 'start_time', nullable: true })
  startTime: number;

  @Column({ type: 'integer', name: 'end_time', nullable: true })
  endTime: number;

  @Column({ name: 'name', length: 255, nullable: true })
  name: string;

  @Column({ name: 'description', length: 512, nullable: true })
  description: string;

  @Column({ type: 'bigint', name: 'total_revenue', nullable: true })
  totalRevenue: number;

  @Column({ type: 'integer', name: 'customer_target_type', nullable: true })
  customerTargetType: number;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  @Column({ name: 'image', length: 255, nullable: true })
  image: string;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

/**
 * A CustomerToken.
 */
@Entity('customer_token')
export default class CustomerToken extends BaseEntity {
  @Column({ type: 'boolean', name: 'type', nullable: true })
  type: boolean;

  @Column({ name: 'token', length: 255, nullable: true })
  token: string;

  @Column({ name: 'token_hash', length: 255, nullable: true })
  tokenHash: string;

  @Column({ type: 'integer', name: 'expired_at', nullable: true })
  expiredAt: number;

  @Column({ type: 'integer', name: 'created_at', nullable: true })
  createdAt: number;

  @Column({ type: 'integer', name: 'updated_at', nullable: true })
  updatedAt: number;

  @Column({ type: 'integer', name: 'customer_id' })
  customerId: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

/**
 * VIEW
 */
@Entity('customer_temp')
export default class CustomerTemp extends BaseEntity {
  @Column({ name: 'name', length: 255, nullable: true })
  name: string;

  @Column({ name: 'tel', length: 100, nullable: true })
  tel: string;

  @Column({ name: 'address', length: 255, nullable: true })
  address: string;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

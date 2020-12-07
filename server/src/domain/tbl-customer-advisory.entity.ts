/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

/**
 * A TblCustomerAdvisory.
 */
@Entity('tbl_customer_advisory')
export default class TblCustomerAdvisory extends BaseEntity {
  @Column({ name: 'name', length: 255, nullable: true })
  name: string;

  @Column({ name: 'jhi_desc', length: 255, nullable: true })
  desc: string;



  @Column({ type: 'boolean', name: 'is_del', nullable: true })
  isDel: boolean;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

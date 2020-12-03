/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A TblCustomerMap.
 */
@Entity('tbl_customer_map')
export default class TblCustomerMap extends BaseEntity {
  @Column({ type: 'integer', name: 'customer_id', nullable: true })
  customerId: number;

  @Column({ type: 'integer', name: 'user_id', nullable: true })
  userId: number;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

/**
 * A CustomerCall.
 */
@Entity('customer_call')
export default class CustomerCall extends BaseEntity {
  /**
   * trạng thái (đã chốt đơn, chưa chốt yêu cầu)
   */
  @Column({ type: 'integer', name: 'status_id', nullable: true })
  statusId: number;

  /**
   * ghi chú
   */
  @Column({ name: 'comment', length: 255, nullable: true })
  comment: string;

  @Column({ type: 'integer', name: 'customer_id', nullable: true })
  customerId: number;



  @Column({ type: 'boolean', name: 'is_del', nullable: true })
  isDel: boolean;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

/**
 * A TblUserDeviceToken.
 */
@Entity('tbl_user_device_token')
export default class TblUserDeviceToken extends BaseEntity {
  /**
   * id user management
   */
  @Column({ type: 'integer', name: 'user_id' })
  userId: number;

  /**
   * token nhận notify push theo từng device
   */
  @Column({ name: 'device_token', length: 255, nullable: true })
  deviceToken: string;

  @Column({ type: 'integer', name: 'created_at', nullable: true })
  createdAt: number;

  @Column({ type: 'integer', name: 'updated_at', nullable: true })
  updatedAt: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

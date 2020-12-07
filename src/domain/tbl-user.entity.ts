/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import TblUserRole from './tbl-user-role.entity';

/**
 * A TblUser.
 */
@Entity('tbl_user')
export default class TblUser extends BaseEntity {
  @Column({ name: 'username', length: 250, nullable: true })
  username: string;

  @Column({ name: 'full_name', length: 250, nullable: true })
  fullName: string;

  @Column({ name: 'email', length: 250, nullable: true })
  email: string;

  @Column({ name: 'phone_number', length: 45, nullable: true })
  phoneNumber: string;

  @Column({ name: 'auth_key', length: 32, nullable: true })
  authKey: string;

  @Column({ name: 'password_hash', length: 255, nullable: true })
  passwordHash: string;

  @Column({ name: 'password_reset_token', length: 255, nullable: true })
  passwordResetToken: string;

  @Column({ type: 'integer', name: 'status', nullable: true })
  status: number;

  @Column({ type: 'integer', name: 'created_at', nullable: true })
  createdAt: number;

  @Column({ type: 'integer', name: 'updated_at', nullable: true })
  updatedAt: number;

  @Column({ type: 'integer', name: 'type_id', nullable: true })
  typeId: number;

  /**
   * dùng cho telesale chia team
   */
  @Column({ type: 'integer', name: 'team_id', nullable: true })
  teamId: number;

  @Column({ type: 'integer', name: 'store_id', nullable: true })
  storeId: number;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  @ManyToOne(type => TblUserRole)
  role: TblUserRole;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

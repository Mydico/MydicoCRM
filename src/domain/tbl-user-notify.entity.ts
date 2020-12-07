/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

/**
 * A TblUserNotify.
 */
@Entity('tbl_user_notify')
export default class TblUserNotify extends BaseEntity {
  @Column({ type: 'integer', name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'title', length: 255, nullable: true })
  title: string;

  @Column({ name: 'content', length: 255, nullable: true })
  content: string;

  /**
   * 0 - chưa đọc, 1 - đã đọc
   */
  @Column({ type: 'integer', name: 'is_read', nullable: true })
  isRead: number;

  @Column({ type: 'integer', name: 'created_at', nullable: true })
  createdAt: number;

  @Column({ type: 'integer', name: 'updated_at', nullable: true })
  updatedAt: number;

  @Column({ type: 'integer', name: 'type', nullable: true })
  type: number;

  @Column({ type: 'integer', name: 'reference_id' })
  referenceId: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

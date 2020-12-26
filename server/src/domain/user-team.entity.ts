/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

/**
 * A UserTeam.
 */
@Entity('user_team')
export default class UserTeam extends BaseEntity {
  @Column({ name: 'name', length: 255, nullable: true })
  name: string;

  /**
   * id user là leader
   */
  @Column({ type: 'integer', name: 'leader_id', nullable: true })
  leaderId: number;

  @Column({ type: 'boolean', name: 'is_del', nullable: true })
  isDel: boolean;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';
import { User } from './user.entity';
import PermissionGroup from './permission-group.entity';

/**
 * A UserRole.
 */
@Entity('user_role')
export default class UserRole extends BaseEntity {
  @Column({ name: 'code', length: 255 })
  code: string;
  @Column({ name: 'name', length: 255 })
  name: string;

  @ManyToMany(type => User, other => other.roles)
  @JoinTable({
    name: 'position_user',
    joinColumn: { name: 'user_role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' }
  })
  users?: User[];

  @ManyToMany(type => PermissionGroup, other => other.roles)
  permissionGroups?: PermissionGroup[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

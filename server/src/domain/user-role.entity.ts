/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { User } from './user.entity';
import PermissionGroup from './permission-group.entity';

/**
 * A UserRole.
 */
@Entity('user_role')
export default class UserRole extends BaseEntity {
  @Column({ name: 'code', length: 255 })
  @Index()
  code: string;

  @Column({ name: 'name', length: 255 })
  @Index()
  name: string;

  @ManyToMany(type => User, other => other.roles)
  users?: User[];

  @ManyToMany(type => PermissionGroup, other => other.roles)
  permissionGroups?: PermissionGroup[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

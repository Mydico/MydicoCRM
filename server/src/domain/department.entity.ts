/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { DepartmentStatus } from './enumeration/department-status';
import PermissionGroup from './permission-group.entity';
import { User } from './user.entity';

/**
 * A Department.
 */
@Entity('department')
export default class Department extends BaseEntity {
  @Column({ name: 'name', nullable: true })
  name: string;

  @Column({ type: 'simple-enum', name: 'status', enum: DepartmentStatus })
  status: DepartmentStatus;

  @ManyToMany(type => User, user => user.departments, { cascade: true })
  @JoinTable({
    name: 'department_user',
    joinColumn: { name: 'department_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' }
  })
  users?: User[];

  @ManyToMany(type => PermissionGroup, other => other.departments)
  permissionGroups?: PermissionGroup[];
  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

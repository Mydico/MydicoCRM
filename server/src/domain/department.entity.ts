/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Tree, TreeChildren, TreeParent } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { DepartmentStatus } from './enumeration/department-status';
import Order from './order.entity';
import PermissionGroup from './permission-group.entity';
import Store from './store.entity';
import { User } from './user.entity';

/**
 * A Department.
 */
@Entity('department')
@Tree('materialized-path')
export default class Department extends BaseEntity {
    @Column({ name: 'name', nullable: true })
    name: string;

    @Column({ type: 'simple-enum', name: 'status', enum: DepartmentStatus })
    status: DepartmentStatus;

    @TreeChildren()
    children?: Department[];
  
    @TreeParent()
    parent?: Department;

    @OneToMany(type => Store, store => store.department, { cascade: true })
    stores?: Store[];

    @OneToMany(type => Order, store => store.department)
    orders?: Store[];

    @ManyToMany(type => PermissionGroup, other => other.departments)
    permissionGroups?: PermissionGroup[];
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

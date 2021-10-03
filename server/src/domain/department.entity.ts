/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Tree, TreeChildren, TreeParent, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import Branch from './branch.entity';

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
    @Column({ name: 'code', nullable: true })
    @Index()
    code: string;

    @Column({ name: 'name', nullable: true })
    @Index()
    name: string;

    @Column({ name: 'external_child', nullable: true })
    @Index()
    externalChild: string;

    @Column({ type: 'boolean', name: 'activated', nullable: true, default: true })
    @Index()
    activated?: boolean;

    @TreeChildren()
    children?: Department[];

    @TreeParent()
    parent?: Department;

    // @OneToMany(type => Store, store => store.department)
    // stores?: Store[];

    // @OneToMany(type => Order, store => store.department)
    // orders?: Store[];

    @ManyToMany(type => Branch, store => store.departments)
    @JoinTable({
        name: 'department_branch',
        joinColumn: { name: 'department_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'branch_id', referencedColumnName: 'id' },
    })
    branches?: Branch[];

    @ManyToMany(type => PermissionGroup, other => other.departments)
    permissionGroups?: PermissionGroup[];
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

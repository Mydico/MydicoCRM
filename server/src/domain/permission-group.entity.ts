/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import PermissionGroupAssociate from './permission-group-associate.entity';
import { PermissionGroupStatus } from './enumeration/permission-group-status';

import { User } from './user.entity';
import Department from './department.entity';
import UserRole from './user-role.entity';
import Branch from './branch.entity';

/**
 * A PermissionGroup.
 */
@Entity('permission_group')
export default class PermissionGroup extends BaseEntity {
    @Column({ name: 'name', nullable: true })
    name: string;

    @Column({ name: 'note', nullable: true })
    note: string;

    @Column({ type: 'enum', name: 'status', enum: PermissionGroupStatus })
    status: PermissionGroupStatus;

    @ManyToMany(type => User, user => user.permissionGroups)
    @JoinTable({
        name: 'permission_group_user',
        joinColumn: { name: 'permission_group_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
    })
    users?: User[];

    @ManyToMany(type => Department, department => department.permissionGroups)
    @JoinTable({
        name: 'permission_group_department',
        joinColumn: { name: 'permission_group_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'department_id', referencedColumnName: 'id' },
    })
    departments?: Department[];

    @ManyToMany(type => Branch, branch => branch.permissionGroups)
    @JoinTable({
        name: 'permission_group_branch',
        joinColumn: { name: 'permission_group_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'branch_id', referencedColumnName: 'id' },
    })
    branches?: Branch[];

    @ManyToMany(type => UserRole, pos => pos.permissionGroups)
    @JoinTable({
        name: 'permission_group_role',
        joinColumn: { name: 'permission_group_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    })
    roles?: UserRole[];

    @ManyToMany(type => PermissionGroupAssociate)
    @JoinTable({
        name: 'permission_group_permission_group_associate',
        joinColumn: { name: 'permission_group_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'permission_group_associate_id', referencedColumnName: 'id' },
    })
    permissionGroupAssociates?: PermissionGroupAssociate[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

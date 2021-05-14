/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Tree, TreeChildren, TreeParent } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import Department from './department.entity';
import { DepartmentStatus } from './enumeration/department-status';
import PermissionGroup from './permission-group.entity';

/**
 * A Branch.
 */
@Entity('branch')
export default class Branch extends BaseEntity {
    @Column({ name: 'code', nullable: true })
    code: string;

    @Column({ name: 'name', nullable: true })
    name: string;

    @Column({ type: 'simple-enum', name: 'status', enum: DepartmentStatus, default: DepartmentStatus.ACTIVE })
    status: DepartmentStatus;
    
    @ManyToMany(type => PermissionGroup, other => other.branches)
    permissionGroups?: PermissionGroup[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

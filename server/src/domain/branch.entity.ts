/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToMany, Index} from 'typeorm';
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
    @Index()
    code: string;

    @Column({ name: 'name', nullable: true })
    @Index()
    name: string;

    @Column({ name: 'allow', nullable: true, default: false})
    @Index()
    allow: boolean;


    @Column({ name: 'see_all', nullable: true, default: false})
    @Index()
    seeAll: boolean;

    @ManyToMany(type => PermissionGroup, other => other.branches)
    permissionGroups?: PermissionGroup[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import PermissionGroup from './permission-group.entity';

/**
 * A PermissionGroupAssociate.
 */
@Entity('permission_group_associate')
export default class PermissionGroupAssociate extends BaseEntity {
    @Column({ name: 'resource', nullable: true })
    @Index()
    resource: string;

    @Column({ name: 'action', nullable: true })
    @Index()
    action: string;

    @Column({ name: 'type_name', nullable: true })
    @Index()
    typeName: string;

    @Column({ name: 'type', nullable: true })
    @Index()
    type: string;

    @Column({ name: 'description', nullable: true })
    @Index()
    description: string;

    @ManyToMany(type => PermissionGroup)
    permissionGroups?: PermissionGroup[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

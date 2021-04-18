/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { PermissionGroupStatus } from './enumeration/permission-group-status';

/**
 * A PermissionType.
 */
@Entity('permission_type')
export default class PermissionType extends BaseEntity {
    @Column({ name: 'description', nullable: true })
    description: string;

    @Column({ name: 'name', nullable: true })
    name: string;

    @Column({ type: 'enum', name: 'status', enum: PermissionGroupStatus })
    status: PermissionGroupStatus;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

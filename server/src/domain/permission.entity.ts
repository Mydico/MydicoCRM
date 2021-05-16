/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { PermissionStatus } from './enumeration/permission-status';

/**
 * A Permission.
 */
@Entity('permission')
export default class Permission extends BaseEntity {
    @Column({ name: 'description', nullable: true })
    @Index()
    description: string;

    @Column({ name: 'action', nullable: true })
    @Index()
    action: string;

    @Column({ name: 'type', nullable: true })
    @Index()
    type: string;

    @Column({ name: 'type_name', nullable: true })
    @Index()
    typeName: string;

    @Column({ type: 'enum', name: 'status', nullable: true, enum: PermissionStatus, default: PermissionStatus.PUBLIC })
    @Index()
    status: PermissionStatus;

    @Column({ name: 'resource', nullable: true })
    @Index()
    resource: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

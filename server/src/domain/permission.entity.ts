/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { PermissionStatus } from './enumeration/permission-status';

/**
 * A Permission.
 */
@Entity('permission')
export default class Permission extends BaseEntity {
  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'action', nullable: true })
  action: string;

  @Column({ name: 'type', nullable: true })
  type: string;

  @Column({ name: 'type_name', nullable: true })
  typeName: string;

  @Column({ type: 'enum', name: 'status', nullable: true, enum: PermissionStatus, default: PermissionStatus.PUBLIC })
  status: PermissionStatus;

  @Column({ name: 'resource', nullable: true })
  resource: string;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

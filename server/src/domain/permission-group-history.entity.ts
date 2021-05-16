/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A PermissionGroupHistory.
 */
@Entity('permission_group_history')
export default class PermissionGroupHistory extends BaseEntity {
    @Column({ name: 'description', nullable: true })
    @Index()
    description: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

/**
 * A Migration.
 */
@Entity('migration')
export default class Migration extends BaseEntity {
    @Column({ name: 'version', length: 180 })
    version: string;

    @Column({ type: 'integer', name: 'apply_time', nullable: true })
    applyTime: number;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

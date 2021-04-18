/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

/**
 * A CustomerStatus.
 */
@Entity('customer_status')
export default class CustomerStatus extends BaseEntity {
    @Column({ name: 'name', length: 255, nullable: true })
    name: string;

    @Column({ name: 'description', length: 255, nullable: true })
    description: string;


    @Column({ type: 'boolean', name: 'is_del', nullable: true })
    isDel?: boolean;

    @Column({ type: 'integer', name: 'site_id', nullable: true })
    siteId?: number;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

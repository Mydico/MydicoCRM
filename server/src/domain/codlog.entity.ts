/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

/**
 * A Codlog.
 */
@Entity('codlog')
export default class Codlog extends BaseEntity {
    @Column({ type: 'integer', name: 'transport_id', nullable: true })
    transportId: number;

    @Column({ name: 'content', length: 255, nullable: true })
    content: string;

    @Column({ type: 'integer', name: 'time', nullable: true })
    time: number;

    @Column({ type: 'integer', name: 'order_id', nullable: true })
    orderId: number;

    @Column({ type: 'integer', name: 'site_id', nullable: true })
    siteId: number;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

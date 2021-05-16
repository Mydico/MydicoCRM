/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A CustomerMap.
 */
@Entity('customer_map')
export default class CustomerMap extends BaseEntity {
    @Column({ type: 'integer', name: 'customer_id', nullable: true })
    @Index()
    customerId: number;

    @Column({ type: 'integer', name: 'user_id', nullable: true })
    @Index()
    userId: number;

    @Column({ type: 'integer', name: 'site_id', nullable: true })
    @Index()
    siteId: number;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

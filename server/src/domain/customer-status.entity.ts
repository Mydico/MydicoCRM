/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';


/**
 * A CustomerStatus.
 */
@Entity('customer_status')
export default class CustomerStatus extends BaseEntity {
    @Column({ name: 'name', length: 255, nullable: true })
    @Index()
    name: string;

    @Column({ name: 'description', length: 255, nullable: true })
    @Index()
    description: string;


    @Column({ type: 'boolean', name: 'is_del', nullable: true })
    @Index()
    isDel?: boolean;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

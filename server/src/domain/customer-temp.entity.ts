/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';


/**
 * VIEW
 */
@Entity('customer_temp')
export default class CustomerTemp extends BaseEntity {
    @Column({ name: 'name', length: 255, nullable: true })
    @Index()
    name: string;

    @Column({ name: 'tel', length: 100, nullable: true })
    @Index()
    tel: string;

    @Column({ name: 'address', length: 255, nullable: true })
    @Index()
    address: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

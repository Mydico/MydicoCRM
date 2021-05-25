/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import Customer from './customer.entity';
import Department from './department.entity';

import { User } from './user.entity';

/**
 * A CustomerDebit.
 */
@Entity('customer_debit')
export default class CustomerDebit extends BaseEntity {
    @Column({ type: 'bigint', name: 'debt', nullable: true, default: 0 })
    @Index()
    debt: number;

    @ManyToOne(type => Customer)
    customer: Customer;

    @ManyToOne(type => User)
    sale: User;

    @ManyToOne(type => Department)
    department? : Department;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

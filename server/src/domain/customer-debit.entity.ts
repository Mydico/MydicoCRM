/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import Branch from './branch.entity';

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

    @Column({ name: 'sale_name', length: 500, nullable: true })
    @Index()
    saleName?: string;

    @Column({ name: 'customer_code', length: 500, nullable: true })
    @Index()
    customerCode?: string;

    @Column({ name: 'customer_name', length: 500, nullable: true })
    @Index()
    customerName?: string;

    @ManyToOne(type => Customer)
    customer: Customer;

    @ManyToOne(type => User)
    sale: User;

    @ManyToOne(type => Branch)
    branch? : Branch;

    @ManyToOne(type => Department)
    department? : Department;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

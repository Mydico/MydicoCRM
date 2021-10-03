/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import Branch from './branch.entity';

import Customer from './customer.entity';
import Department from './department.entity';
import { ReceiptStatus } from './enumeration/receipt-status';
import { User } from './user.entity';

/**
 * A Receipt.
 */
@Entity('receipt')
export default class Receipt extends BaseEntity {
    @ManyToOne(type => Customer, { createForeignKeyConstraints: false })
    customer?: Customer;

    @ManyToOne(type => User, { createForeignKeyConstraints: false })
    sale?: User;

    @Column({ name: 'code', length: 255, nullable: true })
    @Index()
    code: string;

    @Column({ name: 'customer_name', length: 255, nullable: true })
    @Index()
    customerName: string;

    @Column({ name: 'approver_name', length: 255, nullable: true })
    @Index()
    approverName: string;

    @ManyToOne(type => User, { createForeignKeyConstraints: false })
    approver?: User;

    @Column({ type: 'simple-enum', name: 'status', enum: ReceiptStatus, default: ReceiptStatus.WAITING })
    @Index()
    status: ReceiptStatus;

    @ManyToOne(type => Branch, { createForeignKeyConstraints: false })
    branch?: Branch;

    @Column({ name: 'note', length: 255, nullable: true })
    @Index()
    note: string;

    @Column({ type: 'bigint', name: 'money', nullable: true, default: 0 })
    @Index()
    money: number;

    @ManyToOne(type => Department, { createForeignKeyConstraints: false })
    department? : Department;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import Customer from './customer.entity';
import Department from './department.entity';
import { ReceiptStatus } from './enumeration/receipt-status';
import { User } from './user.entity';

/**
 * A Receipt.
 */
@Entity('receipt')
export default class Receipt extends BaseEntity {
    @ManyToOne(type => Customer, customer => customer.receipts)
    customer?: Customer;

    @Column({ name: 'code', length: 255, nullable: true })
    @Index()
    code: string;

    @ManyToOne(type => User)
    approver?: User;

    @Column({ type: 'simple-enum', name: 'status', enum: ReceiptStatus, default: ReceiptStatus.WAITING })
    @Index()
    status: ReceiptStatus;

    @Column({ name: 'note', length: 255, nullable: true })
    @Index()
    note: string;

    @Column({ type: 'bigint', name: 'money', nullable: true, default: 0 })
    @Index()
    money: number;

    @ManyToOne(type => Department)
    department? : Department;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

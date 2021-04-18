/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';
import Customer from './customer.entity';
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
    code: string;

    @ManyToOne(type => User)
    approver?: User;

    @Column({ type: 'simple-enum', name: 'status', enum: ReceiptStatus, default: ReceiptStatus.WAITING })
    status: ReceiptStatus;

    @Column({ name: 'note', length: 255, nullable: true })
    note: string;

    @Column({ type: 'bigint', name: 'money', nullable: true, default: 0 })
    money: number;

    @Column({ type: 'integer', name: 'site_id', nullable: true })
    siteId: number;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

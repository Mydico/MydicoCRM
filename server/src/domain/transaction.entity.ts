/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import Receipt from './receipt.entity';
import { User } from './user.entity';
import Bill from './bill.entity';
import Store from './store.entity';
import Order from './order.entity';
import Customer from './customer.entity';
import { TransactionType } from './enumeration/transaction-type';
import StoreInput from './store-input.entity';
import Branch from './branch.entity';
import Department from './department.entity';

/**
 * A Transaction.
 */
@Entity('transaction')
export default class Transaction extends BaseEntity {
    @ManyToOne(type => Customer, { createForeignKeyConstraints: false })
    customer?: Customer;

    @ManyToOne(type => Order, { createForeignKeyConstraints: false })
    order?: Order;

    @ManyToOne(type => Store, { createForeignKeyConstraints: false })
    store?: Store;

    @ManyToOne(type => StoreInput, { createForeignKeyConstraints: false })
    storeInput?: StoreInput;

    @ManyToOne(type => Bill, { createForeignKeyConstraints: false })
    bill?: Bill;

    @Column({ name: 'sale_name', length: 500, nullable: true })
    @Index()
    saleName?: string;

    @Column({ name: 'customer_code', length: 500, nullable: true })
    @Index()
    customerCode?: string;

    @Column({ name: 'customer_name', length: 500, nullable: true })
    @Index()
    customerName?: string;

    @ManyToOne(type => Branch, { createForeignKeyConstraints: false })
    branch? : Branch;

    @ManyToOne(type => Department, { createForeignKeyConstraints: false })
    department? : Department;

    /**
   * 0 : chưa thanh toán, 1 : đã thanh toán
   */
    @Column({ type: 'integer', name: 'status', nullable: true })
    @Index()
    status?: number;

    @Column({ name: 'note', length: 255, nullable: true })
    @Index()
    note?: string;

    @ManyToOne(type => User, { createForeignKeyConstraints: false })
    sale?: User;

    @Column({ type: 'bigint', name: 'total_money', nullable: true, default: 0 })
    @Index()
    totalMoney?: number;

    /**
   * Số tiền hòa trả do trả hàng
   */
    @Column({ type: 'bigint', name: 'refund_money', nullable: true, default: 0 })
    @Index()
    refundMoney?: number;

    @Column({ type: 'bigint', name: 'collect_money', nullable: true, default: 0 })
    @Index()
    collectMoney?: number;

    @Column({ type: 'simple-enum', name: 'type', enum: TransactionType, default: TransactionType.DEBIT })
    @Index()
    type?: TransactionType;

    @Column({ type: 'bigint', name: 'pre_debt', nullable: true, default: 0 })
    @Index()
    previousDebt?: number;

    @Column({ type: 'bigint', name: 'early_debt', nullable: true, default: 0 })
    @Index()
    earlyDebt?: number;

    /**
   * id phiếu thu
   */
    @ManyToOne(type => Receipt, { createForeignKeyConstraints: false })
    receipt?: Receipt;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

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

/**
 * A Transaction.
 */
@Entity('transaction')
export default class Transaction extends BaseEntity {
    @ManyToOne(type => Customer)
    customer?: Customer;

    @ManyToOne(type => Order)
    order?: Order;

    @ManyToOne(type => Store)
    store?: Store;

    @ManyToOne(type => StoreInput)
    storeInput?: StoreInput;

    @ManyToOne(type => Bill)
    bill?: Bill;

    /**
   * 0 : chưa thanh toán, 1 : đã thanh toán
   */
    @Column({ type: 'integer', name: 'status', nullable: true })
    @Index()
    status: number;

    @Column({ name: 'note', length: 255, nullable: true })
    @Index()
    note: string;

    @ManyToOne(type => User)
    sale?: User;

    @Column({ type: 'bigint', name: 'total_money', nullable: true, default: 0 })
    @Index()
    totalMoney: number;

    /**
   * Số tiền hòa trả do trả hàng
   */
    @Column({ type: 'bigint', name: 'refund_money', nullable: true, default: 0 })
    @Index()
    refundMoney: number;

    @Column({ type: 'bigint', name: 'collect_money', nullable: true, default: 0 })
    @Index()
    collectMoney: number;

    @Column({ type: 'simple-enum', name: 'type', enum: TransactionType, default: TransactionType.DEBIT })
    @Index()
    type?: TransactionType;

    @Column({ type: 'bigint', name: 'pre_debt', nullable: true, default: 0 })
    @Index()
    previousDebt: number;

    @Column({ type: 'bigint', name: 'early_debt', nullable: true, default: 0 })
    @Index()
    earlyDebt: number;

    /**
   * id phiếu thu
   */
    @ManyToOne(type => Receipt)
    receipt?: Receipt;

    @Column({ type: 'integer', name: 'site_id', nullable: true })
    @Index()
    siteId: number;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

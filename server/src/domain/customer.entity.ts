/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column,  ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';


import CustomerStatus from './customer-status.entity';
import CustomerType from './customer-type.entity';
import { User } from './user.entity';

import Order from './order.entity';
import Bill from './bill.entity';
import StoreInput from './store-input.entity';
import Department from './department.entity';
import Receipt from './receipt.entity';
import Transaction from './transaction.entity';
import Branch from './branch.entity';

/**
 * A Customer.
 */
@Entity('customer')
export default class Customer extends BaseEntity {
    @Column({ name: 'name', length: 255, nullable: true })
    @Index()
    name: string;

    @Column({ name: 'tel', length: 100, nullable: true })
    @Index()
    tel: string;

    @Column({ name: 'address', length: 255, nullable: true })
    @Index()
    address: string;

    /**
   * năm sinh
   */
    @Column({ name: 'date_of_birth', nullable: true })
    @Index()
    dateOfBirth: string;

    @Column({ name: 'obclub_join_time', nullable: true })
    @Index()
    obclubJoinTime?: string;

    /**
   * chiều cao (cm)
   */
    @Column({ type: 'integer', name: 'estimate_revenue_month', nullable: true })
    @Index()
    estimateRevenueMonth?: number;

    /**
   * cân nặng(kg)
   */
    @Column({ name: 'sale_name', nullable: true })
    @Index()
    saleName?: string;

    /**
   * tình trạng hôn nhân (đọc thân, đã kết hôn, đã ly hôn)
   */
    @Column({ type: 'boolean', name: 'marriage', nullable: true })
    @Index()
    marriage?: boolean;

    @Column({ name: 'error_logs', nullable: true, length: "255" })
    errorLogs?: string;

    @Column({ type: 'boolean', name: 'activated', nullable: true, default: true })
    @Index()
    activated?: boolean;

    @Column({ name: 'social', length: 250, nullable: true })
    @Index()
    social?: string;

    @Column({ name: 'code', length: 256, nullable: false})
    code: string;

    @Column({ name: 'contact_name', length: 256, nullable: true })
    @Index()
    contactName?: string;

    @Column({ name: 'note', length: 500, nullable: true })
    @Index()
    note?: string;

    @Column({ type: 'integer', name: 'contact_year_of_birth', nullable: true })
    @Index()
    contactYearOfBirth?: number;

    @Column({ type: 'integer', name: 'early_debt', nullable: true })
    @Index()
    earlyDebt?: number;

    @OneToMany(type => Bill, other => other.customer)
    bill? : Bill[];

    @OneToMany(type => StoreInput, other => other.customer)
    storeInput? : StoreInput[];

    @OneToMany(type => Order, other => other.customer)
    order? : Order[];

    @OneToMany(type => Receipt, other => other.customer)
    receipts? : Receipt[];

    @OneToMany(type => Transaction, other => other.customer)
    transaction? : Transaction[];

    @Column({ name: 'city', length: 255, nullable: true })
    @Index()
    city?: string;

    @Column({ name: 'district', length: 255, nullable: true })
    @Index()
    district?: string;

    @ManyToOne(type => Department, { createForeignKeyConstraints: false })
    department?: Department;

    @ManyToOne(type => Branch, { createForeignKeyConstraints: false })
    branch?: Branch;

    @Column({ name: 'ward', length: 255, nullable: true })
    @Index()
    ward?: string;

    @ManyToOne(type => CustomerStatus, { createForeignKeyConstraints: false })
    status?: CustomerStatus;

    @ManyToOne(type => User, { createForeignKeyConstraints: false })
    sale?: User;

    @ManyToOne(type => CustomerType, { createForeignKeyConstraints: false })
    type?: CustomerType;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

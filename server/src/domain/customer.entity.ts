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
    @Column({ type: 'integer', name: 'capacity', nullable: true })
    @Index()
    capacity?: number;

    /**
   * tình trạng hôn nhân (đọc thân, đã kết hôn, đã ly hôn)
   */
    @Column({ type: 'boolean', name: 'marriage', nullable: true })
    @Index()
    marriage?: boolean;

    @Column({ type: 'boolean', name: 'is_del', nullable: true })
    @Index()
    isDel?: boolean;

    @Column({ type: 'boolean', name: 'activated', nullable: true })
    @Index()
    activated?: boolean;

    @Column({ name: 'email', length: 250, nullable: true })
    @Index()
    email?: string;

    @Column({ name: 'code', length: 256, unique: true, nullable: false })
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

    @OneToMany(type => Order, other => other.customer)
    order? : Order[];

    @OneToMany(type => Receipt, other => other.customer)
    receipts? : Receipt[];

    @OneToMany(type => Bill, other => other.customer)
    bill? : Bill[];

    @OneToMany(type => StoreInput, other => other.customer)
    storeInput? : StoreInput[];

    @Column({ name: 'city', length: 255, nullable: true })
    @Index()
    city?: string;

    @Column({ name: 'district', length: 255, nullable: true })
    @Index()
    district?: string;

    @ManyToOne(type => Department)
    department?: Department;

    @Column({ name: 'ward', length: 255, nullable: true })
    @Index()
    ward?: string;
    
    @ManyToOne(type => CustomerStatus)
    status?: CustomerStatus;

    @ManyToOne(type => User)
    sale?: User;

    @ManyToOne(type => CustomerType)
    type?: CustomerType;

    @ManyToMany(type => User)
    @JoinTable({
        name: 'customer_user',
        joinColumn: { name: 'customer_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
    })
    users?: User[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

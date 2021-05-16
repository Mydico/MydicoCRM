/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import City from './city.entity';
import District from './district.entity';
import Wards from './wards.entity';
import CustomerSkin from './customer-skin.entity';
import CustomerCategory from './customer-category.entity';
import CustomerStatus from './customer-status.entity';
import CustomerType from './customer-type.entity';
import CustomerRequest from './customer-request.entity';
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
    name: string;

    @Column({ name: 'tel', length: 100, nullable: true })
    tel: string;

    @Column({ name: 'address', length: 255, nullable: true })
    address: string;

    /**
   * năm sinh
   */
    @Column({ name: 'date_of_birth', nullable: true })
    dateOfBirth: string;

    @Column({ name: 'obclub_join_time', nullable: true })
    obclubJoinTime?: string;

    /**
   * chiều cao (cm)
   */
    @Column({ type: 'integer', name: 'estimate_revenue_month', nullable: true })
    estimateRevenueMonth?: number;

    /**
   * cân nặng(kg)
   */
    @Column({ type: 'integer', name: 'capacity', nullable: true })
    capacity?: number;

    /**
   * tình trạng hôn nhân (đọc thân, đã kết hôn, đã ly hôn)
   */
    @Column({ type: 'boolean', name: 'marriage', nullable: true })
    marriage?: boolean;

    @Column({ type: 'boolean', name: 'is_del', nullable: true })
    isDel?: boolean;

    @Column({ type: 'boolean', name: 'activated', nullable: true })
    activated?: boolean;

    @Column({ name: 'email', length: 250, nullable: true })
    email?: string;

    @Column({ name: 'code', length: 256, unique: true, nullable: false })
    code: string;

    @Column({ name: 'contact_name', length: 256, nullable: true })
    contactName?: string;

    @Column({ name: 'note', length: 500, nullable: true })
    note?: string;

    @Column({ type: 'integer', name: 'contact_year_of_birth', nullable: true })
    contactYearOfBirth?: number;

    @Column({ type: 'integer', name: 'early_debt', nullable: true })
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
    city?: string;

    @Column({ name: 'district', length: 255, nullable: true })
    district?: string;

    @ManyToOne(type => Department)
    department?: Department;

    @Column({ name: 'ward', length: 255, nullable: true })
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

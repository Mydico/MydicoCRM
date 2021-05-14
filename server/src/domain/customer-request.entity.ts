/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import Product from './product.entity';
import CustomerType from './customer-type.entity';

/**
 * A CustomerRequest.
 */
@Entity('customer_request')
export default class CustomerRequest extends BaseEntity {
    @Column({ name: 'name', length: 255, nullable: true })
    name: string;

    @Column({ name: 'tel', length: 100, nullable: true })
    tel: string;

    @Column({ name: 'node', length: 255, nullable: true })
    node: string;

    @Column({ type: 'boolean', name: 'is_del', nullable: true })
    isDel: boolean;

    @Column({ type: 'integer', name: 'user_id', nullable: true })
    userId: number;

    @Column({ name: 'email', length: 250, nullable: true })
    email: string;

    /**
   * trạng thái xử lý
   */
    @Column({ type: 'boolean', name: 'status', nullable: true })
    status: boolean;

    @Column({ type: 'integer', name: 'site_id', nullable: true })
    siteId: number;

    @ManyToOne(type => Product)
    product: Product;

    @ManyToOne(type => CustomerType)
    type: CustomerType;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

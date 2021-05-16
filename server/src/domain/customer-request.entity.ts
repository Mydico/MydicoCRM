/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';


import Product from './product.entity';
import CustomerType from './customer-type.entity';

/**
 * A CustomerRequest.
 */
@Entity('customer_request')
export default class CustomerRequest extends BaseEntity {
    @Column({ name: 'name', length: 255, nullable: true })
    @Index()
    name: string;

    @Column({ name: 'tel', length: 100, nullable: true })
    @Index()
    tel: string;

    @Column({ name: 'node', length: 255, nullable: true })
    @Index()
    node: string;



    @Column({ type: 'integer', name: 'user_id', nullable: true })
    @Index()
    userId: number;

    @Column({ name: 'email', length: 250, nullable: true })
    @Index()
    email: string;

    /**
   * trạng thái xử lý
   */
    @Column({ type: 'boolean', name: 'status', nullable: true })
    @Index()
    status: boolean;

    @Column({ type: 'integer', name: 'site_id', nullable: true })
    @Index()
    siteId: number;

    @ManyToOne(type => Product)
    product: Product;

    @ManyToOne(type => CustomerType)
    type: CustomerType;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

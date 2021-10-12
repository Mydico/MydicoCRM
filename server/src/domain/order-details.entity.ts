/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import Order from './order.entity';
import Product from './product.entity';
import Store from './store.entity';

/**
 * A OrderDetails.
 */
@Entity('order_details')
export default class OrderDetails extends BaseEntity {

    @ManyToOne(type => Product, promotion => promotion, { createForeignKeyConstraints: false })
    product: Product;

    @Column({ type: 'integer', name: 'quantity', nullable: true })
    @Index()
    quantity: number;

    @Column({ type: 'bigint', name: 'price', nullable: true })
    @Index()
    price: number;

    @Column({ name: 'attachTo', nullable: true })
    @Index()
    attachTo: number;

    @ManyToOne(type => Store, store => store, { createForeignKeyConstraints: false })
    store: Store;

    @Column({ type: 'double', name: 'price_total', nullable: true })
    @Index()
    priceTotal: number;

    @Column({ type: 'bigint', name: 'reduce', nullable: true })
    @Index()
    reduce: number;

    @Column({ type: 'float', name: 'reduce_percent', nullable: false, default: 0 })
    @Index()
    reducePercent: number;

    @Column({ type: 'double', name: 'price_real', nullable: true })
    @Index()
    priceReal: number;


    @ManyToOne(type => Order, { createForeignKeyConstraints: false })
    order: Order;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

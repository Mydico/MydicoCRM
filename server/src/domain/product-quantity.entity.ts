/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import Store from './store.entity';
import Product from './product.entity';

/**
 * A ProductQuantity.
 */
@Entity('product_quantity')
export default class ProductQuantity extends BaseEntity {
    @Column({ type: 'integer', name: 'quantity' })
    quantity: number;

    @Column({ type: 'boolean', name: 'is_del', nullable: true })
    isDel?: boolean;

    @ManyToOne(type => Store)
    store: Store;

    @ManyToOne(type => Product)
    product: Product;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import Store from './store.entity';
import Product from './product.entity';
import Department from './department.entity';
import { ProductStatus } from './enumeration/product-status';

/**
 * A ProductQuantity.
 */
@Entity('product_quantity')
export default class ProductQuantity extends BaseEntity {
    @Column({ type: 'integer', name: 'quantity' })
    @Index()
    quantity: number;

    @ManyToOne(type => Department)
    department: Department;

    @ManyToOne(type => Store)
    store: Store;

    @ManyToOne(type => Product)
    product: Product;

    @Column({ type: 'enum', name: 'status', nullable: true, enum: ProductStatus, default: ProductStatus.ACTIVE })
    @Index()
    status?: ProductStatus;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

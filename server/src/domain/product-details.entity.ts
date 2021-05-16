/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';


import Product from './product.entity';

/**
 * A ProductDetails.
 */
@Entity('product_details')
export default class ProductDetails extends BaseEntity {
    @Column({ name: 'barcode', length: 255, nullable: true })
    @Index()
    barcode: string;




    @Column({ name: 'name', length: 250, nullable: true })
    @Index()
    name: string;

    @ManyToOne(type => Product)
    product: Product;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

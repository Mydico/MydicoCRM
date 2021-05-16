/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import ProductGroup from './product-group.entity';

/**
 * A ProductBrand.
 */
@Entity('product_brand')
export default class ProductBrand extends BaseEntity {
    @Column({ name: 'code', length: 255, nullable: false })
    @Index()
    code: string;

    @Column({ name: 'name', length: 255, nullable: true })
    @Index()
    name: string;

    @Column({ name: 'description', length: 512, nullable: true })
    @Index()
    description: string;

    @OneToMany(type => ProductGroup, other => other.productBrand)
    productGroup? : ProductGroup[];
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

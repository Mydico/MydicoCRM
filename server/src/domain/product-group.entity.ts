/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import Product from './product.entity';
import PromotionItem from './promotion-item.entity';
import ProductBrand from './product-brand.entity';

/**
 * A ProductGroup.
 */
@Entity('product_group')
export default class ProductGroup extends BaseEntity {
    @Column({ name: 'code', length: 255, nullable: true })
    @Index()
    code?: string;

    @Column({ name: 'name', length: 255, nullable: true })
    @Index()
    name?: string;

    @Column({ name: 'description', length: 512, nullable: true })
    @Index()
    description?: string;

    @OneToMany(type => Product, other => other.productGroup)
    product? : Product[];

    @OneToMany(type => PromotionItem, other => other.productGroup)
    promotionItem? : PromotionItem[];

    @ManyToOne(type => ProductBrand)
    productBrand: ProductBrand;
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

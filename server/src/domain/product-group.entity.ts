/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';
import Product from './product.entity';
import PromotionItem from './promotion-item.entity';
import ProductBrand from './product-brand.entity';

/**
 * A ProductGroup.
 */
@Entity('product_group')
export default class ProductGroup extends BaseEntity {
    @Column({ name: 'name', length: 255, nullable: true })
    name?: string;

    @Column({ name: 'description', length: 512, nullable: true })
    description?: string;

    @OneToMany(type => Product, other => other.productGroup)
    product? : Product[];

    @OneToMany(type => PromotionItem, other => other.productGroup)
    promotionItem? : PromotionItem[];

    @ManyToOne(type => ProductBrand)
    productBrand: ProductBrand;
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

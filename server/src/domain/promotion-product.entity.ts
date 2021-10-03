/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import Product from './product.entity';
import Promotion from './promotion.entity';

/**
 * A PromotionProduct.
 */
@Entity('promotion_product')
export default class PromotionProduct extends BaseEntity {
    @Column({ type: 'integer', name: 'buy', nullable: true })
    @Index()
    buy?: number;

    @Column({ type: 'integer', name: 'gift', nullable: true })
    @Index()
    gift?: number;

    @ManyToOne(type => Product, { createForeignKeyConstraints: false })
    product?: Product;

    @ManyToOne(type => Promotion, { createForeignKeyConstraints: false })
    promotion?: Promotion;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

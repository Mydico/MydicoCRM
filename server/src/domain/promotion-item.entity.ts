/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';
import ProductGroup from './product-group.entity';
import Promotion from './promotion.entity';

/**
 * A PromotionItem.
 */
@Entity('promotion_item')
export default class PromotionItem extends BaseEntity {
    @Column({ name: 'name', length: 255, nullable: true })
    name: string;

    @Column({ type: 'bigint', name: 'total_money', nullable: true })
    totalMoney: number;

    @Column({ type: 'integer', name: 'reduce_percent', nullable: true })
    reducePercent: number;

    @Column({ name: 'note', length: 512, nullable: true })
    note: string;

    @ManyToOne(type => ProductGroup, productGroup => productGroup.product)
    productGroup?: ProductGroup;


    @ManyToOne(type => Promotion, promotion => promotion.promotionItems)
    promotion?: Promotion;


    @Column({ type: 'integer', name: 'site_id', nullable: true })
    siteId: number;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

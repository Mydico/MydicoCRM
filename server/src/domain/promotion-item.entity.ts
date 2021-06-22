/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import ProductGroup from './product-group.entity';
import Promotion from './promotion.entity';

/**
 * A PromotionItem.
 */
@Entity('promotion_item')
export default class PromotionItem extends BaseEntity {
    @Column({ name: 'name', length: 255, nullable: true })
    @Index()
    name: string;

    @Column({ type: 'bigint', name: 'total_money', nullable: true })
    @Index()
    totalMoney: number;

    @Column({ type: 'integer', name: 'reduce_percent', nullable: true })
    @Index()
    reducePercent: number;

    @Column({ name: 'note', length: 512, nullable: true })
    @Index()
    note: string;

    @ManyToOne(type => ProductGroup, productGroup => productGroup.product)
    productGroup?: ProductGroup;


    @ManyToOne(type => Promotion, promotion => promotion.promotionItems)
    promotion?: Promotion;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import PromotionItem from './promotion-item.entity';
import CustomerType from './customer-type.entity';
import Product from './product.entity';
import PromotionProduct from './promotion-product.entity';
import Order from './order.entity';
import { PromotionStatus } from './enumeration/promotion-status';
import { PromotionType } from './enumeration/promotion-type';

/**
 * A Promotion.
 */
@Entity('promotion')
export default class Promotion extends BaseEntity {
    @Column({ name: 'start_time', nullable: true })
    @Index()
    startTime: string;

    @Column({ name: 'end_time', nullable: true })
    @Index()
    endTime: string;

    @Column({ name: 'name', length: 255, nullable: true })
    @Index()
    name: string;

    @Column({ name: 'description', length: 512, nullable: true })
    @Index()
    description: string;

    @Column({ type: 'bigint', name: 'total_revenue', nullable: true })
    @Index()
    totalRevenue?: number;

    @Column({ type: 'integer', name: 'site_id', nullable: true })
    @Index()
    siteId?: number;

    @Column({ type: 'boolean', name: 'isLock', nullable: false, default: false })
    @Index()
    isLock: boolean;

    @Column({ name: 'image', length: 255, nullable: true })
    @Index()
    image?: string;

    @Column({ type: 'simple-enum', name: 'status', enum: PromotionStatus, default: PromotionStatus.ACTIVE })
    @Index()
    status?: PromotionStatus;

    @Column({ type: 'simple-enum', name: 'type', enum: PromotionType, default: PromotionType.SHORTTERM })
    @Index()
    type?: PromotionType;

    @OneToMany(type => Order, other => other.promotion)
    orders? : Order[];

    @OneToMany(type => PromotionItem, other => other.promotion)
    promotionItems? : PromotionItem[];

    @OneToMany(type => PromotionProduct, other => other.promotion)
    promotionProduct? : PromotionProduct[];

    @ManyToOne(type => CustomerType, other => other.promotion)
    customerType?: CustomerType;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

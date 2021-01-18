/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';
import PromotionItem from './promotion-item.entity';
import CustomerType from './customer-type.entity';
import Product from './product.entity';
import PromotionProduct from './promotion-product.entity';
import Order from './order.entity';
import { PromotionStatus } from './enumeration/promotion-status';

/**
 * A Promotion.
 */
@Entity('promotion')
export default class Promotion extends BaseEntity {
  @Column({ name: 'start_time', nullable: true })
  startTime: string;

  @Column({ name: 'end_time', nullable: true })
  endTime: string;

  @Column({ name: 'name', length: 255, nullable: true })
  name: string;

  @Column({ name: 'description', length: 512, nullable: true })
  description: string;

  @Column({ type: 'bigint', name: 'total_revenue', nullable: true })
  totalRevenue?: number;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId?: number;

  @Column({ type: 'boolean', name: 'isLock', nullable: true })
  isLock: boolean;

  @Column({ name: 'image', length: 255, nullable: true })
  image?: string;

  @Column({ type: 'simple-enum', name: 'status', enum: PromotionStatus, default: PromotionStatus.ACTIVE })
  status?: PromotionStatus;

  @OneToMany(type => Order, other => other.promotion)
  order? : Order[]

  @OneToMany(type => Promotion, other => other.promotionItem)
  promotionItem? : PromotionItem[]

  @OneToMany(type => Product, other => other.promotion)
  product? : Product[]

  @OneToMany(type => PromotionProduct, other => other.promotion)
  promotionProduct? : PromotionProduct[]

  @ManyToOne(type => CustomerType, other => other.promotion)
  customerType?: CustomerType

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

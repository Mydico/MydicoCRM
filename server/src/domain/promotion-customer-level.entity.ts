/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A PromotionCustomerLevel.
 */
@Entity('promotion_customer_level')
export default class PromotionCustomerLevel extends BaseEntity {
  @Column({ type: 'integer', name: 'customer_id', nullable: true })
  customerId: number;

  @Column({ type: 'integer', name: 'promotion_id', nullable: true })
  promotionId: number;

  @Column({ type: 'integer', name: 'promotion_item_id', nullable: true })
  promotionItemId: number;

  @Column({ type: 'integer', name: 'total_money', nullable: true })
  totalMoney: number;

  @Column({ type: 'integer', name: 'updated_at', nullable: true })
  updatedAt: number;

  @Column({ type: 'integer', name: 'created_at', nullable: true })
  createdAt: number;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

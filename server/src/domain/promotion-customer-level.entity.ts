/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A PromotionCustomerLevel.
 */
@Entity('promotion_customer_level')
export default class PromotionCustomerLevel extends BaseEntity {
    @Column({ type: 'integer', name: 'customer_id', nullable: true })
    @Index()
    customerId: number;

    @Column({ type: 'integer', name: 'promotion_id', nullable: true })
    @Index()
    promotionId: number;

    @Column({ type: 'integer', name: 'promotion_item_id', nullable: true })
    @Index()
    promotionItemId: number;

    @Column({ type: 'integer', name: 'total_money', nullable: true })
    @Index()
    totalMoney: number;

    @Column({ type: 'integer', name: 'updated_at', nullable: true })
    @Index()
    updatedAt: number;

    @Column({ type: 'integer', name: 'created_at', nullable: true })
    @Index()
    createdAt: number;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

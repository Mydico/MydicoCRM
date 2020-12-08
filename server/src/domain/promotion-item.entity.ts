/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

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

  @Column({ type: 'integer', name: 'product_group_id', nullable: true })
  productGroupId: number;

  @Column({ type: 'integer', name: 'promotion_id', nullable: true })
  promotionId: number;

  @Column({ type: 'integer', name: 'created_at', nullable: true })
  createdAt: number;

  @Column({ type: 'integer', name: 'updated_at', nullable: true })
  updatedAt: number;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

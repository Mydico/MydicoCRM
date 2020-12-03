/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import TblOrder from './tbl-order.entity';

/**
 * A TblOrderDetails.
 */
@Entity('tbl_order_details')
export default class TblOrderDetails extends BaseEntity {
  @Column({ type: 'integer', name: 'created_at', nullable: true })
  createdAt: number;

  @Column({ type: 'integer', name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ type: 'integer', name: 'updated_at', nullable: true })
  updatedAt: number;

  @Column({ type: 'integer', name: 'updated_by', nullable: true })
  updatedBy: number;

  @Column({ type: 'boolean', name: 'is_del', nullable: true })
  isDel: boolean;

  @Column({ type: 'integer', name: 'product_id', nullable: true })
  productId: number;

  @Column({ type: 'integer', name: 'detail_id', nullable: true })
  detailId: number;

  @Column({ type: 'integer', name: 'quantity', nullable: true })
  quantity: number;

  @Column({ type: 'double', name: 'price', nullable: true })
  price: number;

  @Column({ type: 'integer', name: 'store_id', nullable: true })
  storeId: number;

  @Column({ type: 'double', name: 'price_total', nullable: true })
  priceTotal: number;

  @Column({ type: 'float', name: 'reduce_percent', nullable: true })
  reducePercent: number;

  @Column({ type: 'double', name: 'price_real', nullable: true })
  priceReal: number;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  @ManyToOne(type => TblOrder)
  order: TblOrder;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

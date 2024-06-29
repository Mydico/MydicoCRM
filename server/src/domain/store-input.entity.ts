/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import Store from './store.entity';
import { StoreImportStatus } from './enumeration/store-import-status';
import Customer from './customer.entity';
import { User } from './user.entity';
import StoreInputDetails from './store-input-details.entity';
import { StoreImportType } from './enumeration/store-import-type';
import Provider from './provider.entity';
import Department from './department.entity';
import Order from './order.entity';
import Promotion from './promotion.entity';
import PromotionItem from './promotion-item.entity';
import Branch from './branch.entity';

/**
 * A StoreInput.
 */
@Entity('store_input')
export default class StoreInput extends BaseEntity {
  @Column({ type: 'simple-enum', name: 'type', enum: StoreImportType, default: StoreImportType.NEW })
  @Index()
  type?: StoreImportType;

  @Column({ type: 'simple-enum', name: 'status', enum: StoreImportStatus, default: StoreImportStatus.WAITING })
  @Index()
  status?: StoreImportStatus;

  @ManyToOne(type => Customer, { createForeignKeyConstraints: false })
  customer?: Customer;

  @Column({ name: 'customer_name', length: 255, nullable: true })
  @Index()
  customerName?: string;

  @ManyToOne(type => User, { createForeignKeyConstraints: false })
  sale?: User;

  @Column({ type: 'bigint', name: 'total_money', nullable: true })
  @Index()
  totalMoney?: number;

  @Column({ type: 'bigint', name: 'real_money', nullable: true })
  @Index()
  realMoney?: number;

  @Column({ type: 'bigint', name: 'reduce_money', nullable: true })
  @Index()
  reduceMoney?: number;

  @ManyToOne(type => Department, { createForeignKeyConstraints: false })
  @Index()
  department?: Department;

  @ManyToOne(type => Branch, { createForeignKeyConstraints: false })
  @Index()
  branch?: Branch;

  @ManyToOne(type => User, { createForeignKeyConstraints: false })
  @Index()
  approver?: User;

  @Column({ name: 'approver_name', length: 255, nullable: true })
  @Index()
  approverName?: string;

  @Column({ name: 'note', length: 255, nullable: true })
  @Index()
  note?: string;

  @Column({ name: 'code', length: 255, nullable: true })
  @Index()
  code?: string;

  @OneToMany(type => StoreInputDetails, other => other.storeInput, { cascade: true })
  storeInputDetails?: StoreInputDetails[];

  @ManyToOne(type => Promotion, { createForeignKeyConstraints: false })
  promotion?: Promotion;

  @ManyToOne(type => PromotionItem, { createForeignKeyConstraints: false })
  promotionItem?: PromotionItem;

  @ManyToOne(type => Store, { createForeignKeyConstraints: false })
  @Index()
  store?: Store;

  @Column({ name: 'store_name', length: 255, nullable: true })
  @Index()
  storeName?: string;

  @ManyToOne(type => Provider, { createForeignKeyConstraints: false })
  provider?: Provider;

  @Column({ name: 'provider_name', length: 255, nullable: true })
  @Index()
  providerName?: string;

  @ManyToOne(type => Store, { createForeignKeyConstraints: false })
  @Index()
  storeTransfer?: Store;

  @Column({ name: 'store_transfer_name', length: 255, nullable: true })
  @Index()
  storeTransferName?: string;

  @Column({ name: 'related_id', length: 255, nullable: true })
  @Index()
  relatedId?: string;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

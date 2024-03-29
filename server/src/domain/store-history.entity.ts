/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import Department from './department.entity';
import { StoreHistoryType } from './enumeration/store-history-type';

import Product from './product.entity';
import Store from './store.entity';

/**
 * A StoreHistory.
 */
@Entity('store_history')
export default class StoreHistory extends BaseEntity {
    @Column({ type: 'integer', name: 'quantity', nullable: true })
    @Index()
    quantity: number;

    @Column({ type: 'integer', name: 'remain', nullable: true })
    @Index()
    remain: number;

    @Column({ type: 'integer', name: 'before_update', nullable: true })
    @Index()
    beforeUpdate: number;

    @Column({  name: 'store_name', nullable: true })
    @Index()
    storeName: string;

    @Column({ name: 'product_name', nullable: true })
    @Index()
    productName: string;

    @Column({ name: 'entity', nullable: true })
    @Index()
    entity: string;

    @Column({ name: 'entityId', nullable: true })
    @Index()
    entityId: string;

    @Column({ name: 'entityCode', nullable: true })
    @Index()
    entityCode: string;

    @Column({ name: 'entityType', nullable: true })
    @Index()
    entityType: string;

    @Column({ name: 'destinationId', nullable: true })
    @Index()
    destinationId: string;

    @Column({ name: 'dest_name', nullable: true })
    @Index()
    destName: string;
    
    @Column({ type: 'simple-enum', name: 'status', enum: StoreHistoryType, default: StoreHistoryType.IMPORT })
    @Index()
    type: StoreHistoryType;

    @ManyToOne(type => Product, { createForeignKeyConstraints: false })
    product: Product;

    @ManyToOne(type => Store, { createForeignKeyConstraints: false })
    store: Store;

    @ManyToOne(type => Department, { createForeignKeyConstraints: false })
    department: Department;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

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

    @ManyToOne(type => Customer, customer => customer.storeInput)
    customer?: Customer;

    @Column({ type: 'bigint', name: 'total_money', nullable: true })
    @Index()
    totalMoney?: number;

    @Column({ type: 'bigint', name: 'real_money', nullable: true })
    @Index()
    realMoney?: number;

    @Column({ type: 'bigint', name: 'reduce_money', nullable: true })
    @Index()
    reduceMoney?: number;

    @ManyToOne(type => User, user => user.storeInput)
    approver?: User;

    @Column({ name: 'note', length: 255, nullable: true })
    @Index()
    note: string;


    @OneToMany(type => StoreInputDetails, other => other.storeInput)
    storeInputDetails? : StoreInputDetails[];

    @ManyToOne(type => Store)
    store: Store;

    @ManyToOne(type => Provider)
    provider: Provider;

    @ManyToOne(type => Store)
    storeTransfer?: Store;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import Customer from './customer.entity';
import Store from './store.entity';
import Promotion from './promotion.entity';
import { OrderStatus } from './enumeration/order-status';
import OrderDetails from './order-details.entity';
import PromotionItem from './promotion-item.entity';
import Bill from './bill.entity';
import Department from './department.entity';

/**
 * A Order.
 */
@Entity('order')
export default class Order extends BaseEntity {
    @Column({ type: 'boolean', name: 'is_del', nullable: true })
    @Index()
    isDel?: boolean;

    @ManyToOne(type => Customer, customer => customer.order)
    customer?: Customer;

    @ManyToOne(type => Store, store => store.order)
    store?: Store;

    @ManyToOne(type => Department, department => department.orders)
    department?: Department;

    @Column({ name: 'address', length: 255, nullable: true })
    @Index()
    address?: string;

    @Column({ name: 'code', length: 255, nullable: true })
    @Index()
    code?: string;

    @Column({ name: 'cod_code', length: 255, nullable: true })
    @Index()
    codCode?: string;

    @Column({ type: 'simple-enum', name: 'status', enum: OrderStatus, default: OrderStatus.WAITING })
    @Index()
    status?: OrderStatus;

    @Column({ type: 'integer', name: 'transport_id', nullable: true })
    @Index()
    transportId?: number;

    /**
   * tổng tiền
   */
    @Column({ type: 'bigint', name: 'total_money', nullable: true })
    @Index()
    totalMoney?: number;

    @Column({ name: 'summary', length: 255, nullable: true })
    @Index()
    summary?: string;

    @Column({ type: 'integer', name: 'request_id', nullable: true })
    @Index()
    requestId?: number;

    @Column({ name: 'note', length: 500, nullable: true })
    @Index()
    note?: string;

    @Column({ name: 'customer_note', length: 250, nullable: true })
    @Index()
    customerNote?: string;

    @Column({ type: 'boolean', name: 'push_status', nullable: true })
    @Index()
    pushStatus?: boolean;

    @ManyToOne(type => Promotion, promotion => promotion.orders)
    promotion?: Promotion;

    @OneToMany(type => OrderDetails, orderDetails => orderDetails.order)
    orderDetails?: OrderDetails[];

    @OneToMany(type => Bill, bill => bill.order)
    bill?: Bill;

    @Column({ type: 'integer', name: 'promotion_item_id', nullable: true })
    @Index()
    promotionItem?: PromotionItem;

    @Column({ type: 'bigint', name: 'real_money', nullable: true })
    @Index()
    realMoney?: number;

    @Column({ type: 'bigint', name: 'reduce_money', nullable: true })
    @Index()
    reduceMoney?: number;

    @Column({ type: 'integer', name: 'site_id', nullable: true })
    @Index()
    siteId?: number;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

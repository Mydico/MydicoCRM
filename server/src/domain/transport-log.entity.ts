/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';


/**
 * A TransportLog.
 */
@Entity('transport_log')
export default class TransportLog extends BaseEntity {
    /**
   * User vận chuyển đơn hàng
   */
    @Column({ type: 'integer', name: 'user_id' })
    @Index()
    userId: number;

    @Column({ type: 'integer', name: 'customer_id' })
    @Index()
    customerId: number;

    @Column({ type: 'integer', name: 'order_id' })
    @Index()
    orderId: number;

    @Column({ type: 'integer', name: 'bill_id' })
    @Index()
    billId: number;

    @Column({ type: 'integer', name: 'store_id' })
    @Index()
    storeId: number;

    /**
   * 1: Đang vận chuyển, 2 : đã giao cho khách , 3 : khách không nhận hàng (chuyển lại về kho), 4 : Đã trả về kho
   */
    @Column({ type: 'integer', name: 'status', nullable: true })
    @Index()
    status: number;



    @Column({ name: 'note', length: 255, nullable: true })
    @Index()
    note: string;

    @Column({ type: 'integer', name: 'created_at', nullable: true })
    @Index()
    createdAt: number;

    @Column({ name: 'created_by', length: 255, nullable: true })
    @Index()
    createdBy: string;

    @Column({ type: 'integer', name: 'updated_at', nullable: true })
    @Index()
    updatedAt: number;

    @Column({ name: 'updated_by', length: 255, nullable: true })
    @Index()
    updatedBy: string;



    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

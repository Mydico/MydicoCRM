/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';


/**
 * A OrderPush.
 */
@Entity('order_push')
export default class OrderPush extends BaseEntity {
    @Column({ type: 'integer', name: 'order_id', nullable: true })
    @Index()
    orderId: number;

    @Column({ type: 'integer', name: 'transport_id', nullable: true })
    @Index()
    transportId: number;

    @Column({ name: 'repon', length: 255, nullable: true })
    @Index()
    repon: string;



    @Column({ type: 'integer', name: 'created_at', nullable: true })
    @Index()
    createdAt: number;

    @Column({ type: 'integer', name: 'updated_at', nullable: true })
    @Index()
    updatedAt: number;

    /**
   * mã đơn hàng + random (để 1 đơn hàng push dc nhiều lần)
   */
    @Column({ name: 'code', length: 100, nullable: true })
    @Index()
    code: string;

    /**
   * ghi chú nội dung cho tiện theo dõi
   */
    @Column({ name: 'note', length: 255, nullable: true })
    @Index()
    note: string;

    @Column({ type: 'integer', name: 'status', nullable: true })
    @Index()
    status: number;



    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

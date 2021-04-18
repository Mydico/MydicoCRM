/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

/**
 * A OrderPush.
 */
@Entity('order_push')
export default class OrderPush extends BaseEntity {
    @Column({ type: 'integer', name: 'order_id', nullable: true })
    orderId: number;

    @Column({ type: 'integer', name: 'transport_id', nullable: true })
    transportId: number;

    @Column({ name: 'repon', length: 255, nullable: true })
    repon: string;

    @Column({ type: 'boolean', name: 'is_del', nullable: true })
    isDel: boolean;

    @Column({ type: 'integer', name: 'created_at', nullable: true })
    createdAt: number;

    @Column({ type: 'integer', name: 'updated_at', nullable: true })
    updatedAt: number;

    /**
   * mã đơn hàng + random (để 1 đơn hàng push dc nhiều lần)
   */
    @Column({ name: 'code', length: 100, nullable: true })
    code: string;

    /**
   * ghi chú nội dung cho tiện theo dõi
   */
    @Column({ name: 'note', length: 255, nullable: true })
    note: string;

    @Column({ type: 'integer', name: 'status', nullable: true })
    status: number;

    @Column({ type: 'integer', name: 'site_id', nullable: true })
    siteId: number;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

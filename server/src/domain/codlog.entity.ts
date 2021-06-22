/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A Codlog.
 */
@Entity('codlog')
export default class Codlog extends BaseEntity {
    @Column({ type: 'integer', name: 'transport_id', nullable: true })
    @Index()
    transportId: number;

    @Column({ name: 'content', length: 255, nullable: true })
    @Index()
    content: string;

    @Column({ type: 'integer', name: 'time', nullable: true })
    @Index()
    time: number;

    @Column({ type: 'integer', name: 'order_id', nullable: true })
    @Index()
    orderId: number;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

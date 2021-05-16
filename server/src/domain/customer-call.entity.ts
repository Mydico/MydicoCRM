/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';


/**
 * A CustomerCall.
 */
@Entity('customer_call')
export default class CustomerCall extends BaseEntity {
    /**
   * trạng thái (đã chốt đơn, chưa chốt yêu cầu)
   */
    @Column({ type: 'integer', name: 'status_id', nullable: true })
    @Index()
    statusId: number;

    /**
   * ghi chú
   */
    @Column({ name: 'comment', length: 255, nullable: true })
    @Index()
    comment: string;

    @Column({ type: 'integer', name: 'customer_id', nullable: true })
    @Index()
    customerId: number;




    @Column({ type: 'integer', name: 'site_id', nullable: true })
    @Index()
    siteId: number;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

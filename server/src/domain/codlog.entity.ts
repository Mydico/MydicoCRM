/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, Index, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import Bill from './bill.entity';
import Order from './order.entity';
import { User } from './user.entity';

/**
 * A Codlog.
 */
@Entity('codlog')
export default class Codlog extends BaseEntity {
    @ManyToOne(type => Bill, { createForeignKeyConstraints: false })
    bill: Bill;

    @ManyToOne(type => User, { createForeignKeyConstraints: false })
    transporter: User;

    @Column({ name: 'status', length: 255, nullable: true })
    @Index()
    status: string;

    @Column({ name: 'code', length: 255, nullable: true })
    @Index()
    code: string;

    @ManyToOne(type => Order, {createForeignKeyConstraints: false })
    order: Order;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

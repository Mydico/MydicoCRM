/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne, Index, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import Order from './order.entity';
import Customer from './customer.entity';
import Store from './store.entity';
import { BillStatus } from './enumeration/bill-status';
import { User } from './user.entity';
import Department from './department.entity';
import Branch from './branch.entity';

/**
 * A Bill.
 */
@Entity('internal_notification')
export default class InternalNotification extends BaseEntity {
    @Column({ name: 'content', type: 'text', nullable: true })
    content: string;

    @Column({ name: 'receiver', type: 'text', nullable: true })
    receiver?: string[];

    @Column({ name: 'title', nullable: true })
    @Index()    
    title: string;

    @Column({ name: 'short_content', nullable: true })
    @Index()    
    shortContent: string;

    @Column({ name: 'entityId', nullable: true })
    @Index()    
    entityId: string;

    @Column({ name: 'entityName', nullable: true })
    @Index()    
    entityName: string;

    @ManyToMany(type => Department, other => other.internalNotifications, {createForeignKeyConstraints: false})
    @JoinTable({
        name: 'department_internal_notification',
        joinColumn: { name: 'interal_notification_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'department_id', referencedColumnName: 'id' },
    })
    departments?: Department[];

    @ManyToMany(type => Branch, other => other.internalNotifications, {createForeignKeyConstraints: false})
    @JoinTable({
        name: 'internal_notification_branch',
        joinColumn: { name: 'interal_notification_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'branch_id', referencedColumnName: 'id' },
    })
    branches?: Branch[];

    @ManyToMany(type => User, other => other.internalNotifications, {createForeignKeyConstraints: false})
    @JoinTable({
        name: 'internal_notification_user',
        joinColumn: { name: 'interal_notification_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
    })
    users?: User[];
 
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { DashboardType } from './enumeration/dashboard-type';
import { TransactionType } from './enumeration/transaction-type';

/**
 * A AttributeMap.
 */
@Entity('debt_dashboard')
export default class DebtDashboard extends BaseEntity {
    @Column({ type: 'integer', name: 'user_id', nullable: true })
    @Index()
    userId: string;

    @Column({ type: 'simple-enum', name: 'type', enum: DashboardType, default: DashboardType.DEBT })
    @Index()
    type: DashboardType;

    @Column({ type: 'bigint', name: 'amount', nullable: true })
    @Index()
    amount: number;

    @Column({  name: 'entityId', nullable: true })
    @Index()
    entityId: string;

    @Column({  name: 'departmentId', nullable: true })
    @Index()
    departmentId: string;

    @Column({ type: 'simple-enum', name: 'entity_type', enum: TransactionType, default: TransactionType.DEBIT })
    @Index()
    entityType?: TransactionType;
}

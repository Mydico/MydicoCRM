/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { DashboardType } from './enumeration/dashboard-type';

/**
 * A AttributeMap.
 */
@Entity('income_dashboard')
export default class IncomeDashboard extends BaseEntity {
  @Column({ type: 'integer', name: 'user_id', nullable: true })
  @Index()
  userId: string;

  @Column({ type: 'simple-enum', name: 'type', enum: DashboardType })
  @Index()
  type: DashboardType;

  @Column({ type: 'bigint', name: 'amount', nullable: true })
  @Index()
  amount: number;
}

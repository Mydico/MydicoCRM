/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

/**
 * A ReportDate.
 */
@Entity('report_date')
export default class ReportDate extends BaseEntity {
    /**
   * báo cáo ngày
   */
    @Column({ type: 'integer', name: 'date' })
    date: number;

    /**
   * chi nhánh
   */
    @Column({ type: 'integer', name: 'site_id', nullable: true })
    siteId: number;

    /**
   * nhân viên
   */
    @Column({ type: 'integer', name: 'sale_id', nullable: true })
    saleId: number;

    @Column({ type: 'bigint', name: 'total_money', nullable: true })
    totalMoney: number;

    @Column({ type: 'bigint', name: 'real_money', nullable: true })
    realMoney: number;

    @Column({ type: 'bigint', name: 'reduce_money', nullable: true })
    reduceMoney: number;

    @Column({ type: 'integer', name: 'created_at', nullable: true })
    createdAt: number;

    @Column({ type: 'integer', name: 'updated_at', nullable: true })
    updatedAt: number;

    @Column({ type: 'integer', name: 'team_id', nullable: true })
    teamId: number;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

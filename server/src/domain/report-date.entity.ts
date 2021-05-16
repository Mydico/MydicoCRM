/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';


/**
 * A ReportDate.
 */
@Entity('report_date')
export default class ReportDate extends BaseEntity {
    /**
   * báo cáo ngày
   */
    @Column({ type: 'integer', name: 'date' })
    @Index()
    date: number;

    /**
   * chi nhánh
   */
    @Column({ type: 'integer', name: 'site_id', nullable: true })
    @Index()
    siteId: number;

    /**
   * nhân viên
   */
    @Column({ type: 'integer', name: 'sale_id', nullable: true })
    @Index()
    saleId: number;

    @Column({ type: 'bigint', name: 'total_money', nullable: true })
    @Index()
    totalMoney: number;

    @Column({ type: 'bigint', name: 'real_money', nullable: true })
    @Index()
    realMoney: number;

    @Column({ type: 'bigint', name: 'reduce_money', nullable: true })
    @Index()
    reduceMoney: number;

    @Column({ type: 'integer', name: 'created_at', nullable: true })
    @Index()
    createdAt: number;

    @Column({ type: 'integer', name: 'updated_at', nullable: true })
    @Index()
    updatedAt: number;

    @Column({ type: 'integer', name: 'team_id', nullable: true })
    @Index()
    teamId: number;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

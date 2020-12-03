/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

/**
 * A TblReportCustomerCategoryDate.
 */
@Entity('tbl_report_customer_category_date')
export default class TblReportCustomerCategoryDate extends BaseEntity {
  /**
   * báo cáo ngày
   */
  @Column({ type: 'integer', name: 'date' })
  date: number;

  /**
   * nhóm khách hàng
   */
  @Column({ type: 'integer', name: 'category_id', nullable: true })
  categoryId: number;

  /**
   * chi nhánh
   */
  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  @Column({ type: 'long', name: 'total_money', nullable: true })
  totalMoney: number;

  @Column({ type: 'long', name: 'real_money', nullable: true })
  realMoney: number;

  @Column({ type: 'long', name: 'reduce_money', nullable: true })
  reduceMoney: number;

  @Column({ type: 'integer', name: 'created_at', nullable: true })
  createdAt: number;

  @Column({ type: 'integer', name: 'updated_at', nullable: true })
  updatedAt: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

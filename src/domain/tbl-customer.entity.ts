/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

/**
 * A TblCustomer.
 */
@Entity('tbl_customer')
export default class TblCustomer extends BaseEntity {
  @Column({ name: 'name', length: 255, nullable: true })
  name: string;

  @Column({ name: 'tel', length: 100, nullable: true })
  tel: string;

  @Column({ type: 'integer', name: 'city_id', nullable: true })
  cityId: number;

  @Column({ type: 'integer', name: 'district_id', nullable: true })
  districtId: number;

  @Column({ type: 'integer', name: 'wards_id', nullable: true })
  wardsId: number;

  @Column({ name: 'address', length: 255, nullable: true })
  address: string;

  @Column({ type: 'integer', name: 'fanpage_id', nullable: true })
  fanpageId: number;

  /**
   * năm sinh
   */
  @Column({ type: 'integer', name: 'year_of_birth', nullable: true })
  yearOfBirth: number;

  @Column({ type: 'integer', name: 'obclub_join_time', nullable: true })
  obclubJoinTime: number;

  /**
   * chiều cao (cm)
   */
  @Column({ type: 'integer', name: 'estimate_revenue_month', nullable: true })
  estimateRevenueMonth: number;

  /**
   * cân nặng(kg)
   */
  @Column({ type: 'integer', name: 'capacity', nullable: true })
  capacity: number;

  /**
   * tình trạng hôn nhân (đọc thân, đã kết hôn, đã ly hôn)
   */
  @Column({ type: 'boolean', name: 'marriage', nullable: true })
  marriage: boolean;

  /**
   * loại da
   */
  @Column({ type: 'integer', name: 'skin_id', nullable: true })
  skinId: number;

  /**
   * phân loại khách hàng
   */
  @Column({ type: 'integer', name: 'category_id', nullable: true })
  categoryId: number;

  /**
   * trạng thái
   */
  @Column({ type: 'integer', name: 'status_id', nullable: true })
  statusId: number;

  /**
   * id bảng yêu cầu
   */
  @Column({ type: 'integer', name: 'request_id', nullable: true })
  requestId: number;



  @Column({ type: 'boolean', name: 'is_del', nullable: true })
  isDel: boolean;

  @Column({ type: 'integer', name: 'product_id', nullable: true })
  productId: number;

  @Column({ name: 'user_ids', length: 250, nullable: true })
  userIds: string;

  @Column({ name: 'email', length: 250, nullable: true })
  email: string;

  @Column({ type: 'integer', name: 'type', nullable: true })
  type: number;

  @Column({ type: 'integer', name: 'level', nullable: true })
  level: number;

  @Column({ name: 'code', length: 256 })
  code: string;

  @Column({ name: 'contact_name', length: 256 })
  contactName: string;

  @Column({ name: 'note', length: 500, nullable: true })
  note: string;

  @Column({ type: 'integer', name: 'contact_year_of_birth', nullable: true })
  contactYearOfBirth: number;

  @Column({ type: 'integer', name: 'total_debt', nullable: true })
  totalDebt: number;

  /**
   * Công nợ đầu kỳ
   */
  @Column({ type: 'integer', name: 'early_debt', nullable: true })
  earlyDebt: number;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

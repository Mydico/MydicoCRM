/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';
import Order from './order.entity';
import Customer from './customer.entity';
import Store from './store.entity';
import { BillStatus } from './enumeration/bill-status';

/**
 * A Bill.
 */
@Entity('bill')
export default class Bill extends BaseEntity {

  @OneToOne(() => Customer)
  @JoinColumn()
  customer: Customer;

  // @ManyToOne(type => Store, store => store.product, { cascade: true })
  // store?: Store;
  @OneToOne(() => Order)
  @JoinColumn()
  order: Order;


  @OneToOne(() => Store)
  @JoinColumn()
  store: Store;

  /**
   * 0 : khởi tạo chờ duyệt, -1 : hủy duyệt, 1: duyệt đơn và xuất kho, trừ số lượng trong kho (không hủy được nữa), 2 : đang vận chuyển , 3 : giao thành công (tạo công nợ cho khách), 4 : khách hủy đơn (phải tạo dơn nhập lại hàng vào kho)
   */
  @Column({ type: 'simple-enum', name: 'status', enum: BillStatus, default: BillStatus.CREATED })
  status: BillStatus;

  @Column({ type: 'boolean', name: 'is_del', nullable: true })
  isDel: boolean;

  @Column({ name: 'note', length: 255, nullable: true })
  note: string;

  /**
   * mã vận đơn
   */
  @Column({ name: 'code', length: 255, nullable: true })
  code: string;

  @Column({ type: 'integer', name: 'sale_id', nullable: true })
  saleId: number;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

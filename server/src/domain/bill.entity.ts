/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import Order from './order.entity';
import Customer from './customer.entity';
import Store from './store.entity';
import { BillStatus } from './enumeration/bill-status';
import { User } from './user.entity';
import Department from './department.entity';

/**
 * A Bill.
 */
@Entity('bill')
export default class Bill extends BaseEntity {
  @ManyToOne(type => Customer, customer => customer.bill)
  customer: Customer;

  @Column({ name: 'customer_name', length: 255, nullable: true })
  @Index()
  customerName?: string;

  @ManyToOne(type => User, user => user.bill)
  transporter: User;

  @Column({ name: 'transporter_name', length: 255, nullable: true })
  @Index()
  transporterName?: string;

  @ManyToOne(type => Department)
  department? : Department;

  @ManyToOne(type => Order, order => order.bill)
  order: Order;

  @ManyToOne(type => Store, store => store.bill)
  store: Store;

  /**
   * 0 : khởi tạo chờ duyệt, -1 : hủy duyệt, 1: duyệt đơn và xuất kho, trừ số lượng trong kho (không hủy được nữa), 2 : đang vận chuyển , 3 : giao thành công (tạo công nợ cho khách), 4 : khách hủy đơn (phải tạo dơn nhập lại hàng vào kho)
   */
  @Column({ type: 'simple-enum', name: 'status', enum: BillStatus, default: BillStatus.CREATED })
  @Index()
  status?: BillStatus;

  @Column({ name: 'note', length: 255, nullable: true })
  @Index()
  note?: string;

  /**
   * mã vận đơn
   */
  @Column({ name: 'code', length: 255, nullable: true })
  @Index()
  code: string;


  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

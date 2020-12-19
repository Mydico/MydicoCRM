/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

/**
 * A Product.
 */
@Entity('product')
export default class Product extends BaseEntity {
  @Column({ name: 'name', length: 255 })
  name: string;

  @Column({ name: 'image', length: 255, nullable: true })
  image: string;

  @Column({ name: 'description', length: 255, nullable: true })
  desc: string;



  @Column({ type: 'boolean', name: 'is_del', nullable: true })
  isDel: boolean;

  @Column({ name: 'code', length: 255, nullable: true })
  code: string;

  @Column({ type: 'integer', name: 'status', nullable: true })
  status: number;

  /**
   * Giá gốc của sản phẩm tính theo đơn vị của sản phẩm
   */
  @Column({ type: 'integer', name: 'price', nullable: true })
  price: number;

  /**
   * Đơn vị của sản phẩm : 0 - Cái, 1 - Hộp, 2 - Chai , 3 - Túi , 4 - Tuýp , 5 - Hũ , 6 - Lọ, 7 - Cặp
   */
  @Column({ type: 'integer', name: 'unit', nullable: true })
  unit: number;

  /**
   * Giá gốc của sản phẩm danh cho đại lý tính theo đơn vị của sản phẩm
   */
  @Column({ type: 'integer', name: 'agent_price', nullable: true })
  agentPrice: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

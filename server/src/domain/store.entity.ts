/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import City from './city.entity';
import District from './district.entity';
import Wards from './wards.entity';
import Product from './product.entity';
import Order from './order.entity';
import { StoreStatus } from './enumeration/store-status';
import OrderDetails from './order-details.entity';

/**
 * A Store.
 */
@Entity('store')
export default class Store extends BaseEntity {
  @Column({ name: 'name', length: 255 })
  name: string;

  @Column({ name: 'address', length: 255, nullable: true })
  address: string;

  @Column({ name: 'tel', length: 100, nullable: true })
  tel: string;

  @Column({ name: 'code', length: 100, nullable: false })
  code: string;

  @Column({ type: 'boolean', name: 'is_del', nullable: true })
  isDel: boolean;

  @Column({ type: 'integer', name: 'transport_id', nullable: true })
  transportId: number;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  @Column({ type: 'simple-enum', name: 'status', enum: StoreStatus, default: StoreStatus.ACTIVE })
  status?: StoreStatus;

  @OneToMany(type => OrderDetails, other => other.store)
  orderDetail? : OrderDetails[]

  @OneToMany(type => Product, other =>other.store)
  product: Product[];

  @ManyToOne(type => City)
  city: City;

  @ManyToOne(type => District)
  district: District;

  @ManyToOne(type => Wards)
  ward: Wards;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

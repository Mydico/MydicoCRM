/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import TblCity from './tbl-city.entity';
import TblDistrict from './tbl-district.entity';
import TblWards from './tbl-wards.entity';

/**
 * A TblStore.
 */
@Entity('tbl_store')
export default class TblStore extends BaseEntity {
  @Column({ name: 'name', length: 255 })
  name: string;

  @Column({ name: 'address', length: 255, nullable: true })
  address: string;

  @Column({ name: 'tel', length: 100, nullable: true })
  tel: string;

  @Column({ type: 'integer', name: 'created_at', nullable: true })
  createdAt: number;

  @Column({ type: 'integer', name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ type: 'integer', name: 'updated_at', nullable: true })
  updatedAt: number;

  @Column({ type: 'integer', name: 'updated_by', nullable: true })
  updatedBy: number;

  @Column({ type: 'boolean', name: 'is_del', nullable: true })
  isDel: boolean;

  @Column({ type: 'integer', name: 'transport_id', nullable: true })
  transportId: number;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  @ManyToOne(type => TblCity)
  city: TblCity;

  @ManyToOne(type => TblDistrict)
  district: TblDistrict;

  @ManyToOne(type => TblWards)
  wards: TblWards;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

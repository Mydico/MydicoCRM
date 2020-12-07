/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import TblDistrict from './tbl-district.entity';

/**
 * A TblWards.
 */
@Entity('tbl_wards')
export default class TblWards extends BaseEntity {
  @Column({ name: 'name', length: 255, nullable: true })
  name: string;



  @Column({ type: 'boolean', name: 'is_del', nullable: true })
  isDel: boolean;

  @ManyToOne(type => TblDistrict)
  district: TblDistrict;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

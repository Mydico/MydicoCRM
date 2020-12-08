/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import ProductDetails from './product-details.entity';
import AttributeValue from './attribute-value.entity';

/**
 * A AttributeMap.
 */
@Entity('attribute_map')
export default class AttributeMap extends BaseEntity {


  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  @ManyToOne(type => ProductDetails)
  detail: ProductDetails;

  @ManyToOne(type => AttributeValue)
  value: AttributeValue;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

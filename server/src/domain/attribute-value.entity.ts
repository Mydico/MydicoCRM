/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import Attribute from './attribute.entity';

/**
 * A AttributeValue.
 */
@Entity('attribute_value')
export default class AttributeValue extends BaseEntity {
  @Column({ name: 'name', length: 255 })
  name: string;

  @Column({ type: 'integer', name: 'product_id', nullable: true })
  productId: number;



  @Column({ type: 'boolean', name: 'is_del', nullable: true })
  isDel: boolean;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId: number;

  @ManyToOne(type => Attribute)
  attribute: Attribute;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

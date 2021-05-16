/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import Promotion from './promotion.entity';

/**
 * A CustomerType.
 */
@Entity('customer_type')
export default class CustomerType extends BaseEntity {
    @Column({ name: 'name', length: 255, nullable: true })
    @Index()
    name?: string;

    @Column({ name: 'description', length: 255, nullable: true })
    @Index()
    description?: string;

    @Column({ name: 'code', length: 255, nullable: false })
    @Index()
    code?: string;


    @OneToMany(type => Promotion, promotion => promotion.customerType)
    promotion?: Promotion[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

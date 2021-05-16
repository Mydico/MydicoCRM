/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import StoreInput from './store-input.entity';

/**
 * A Provider.
 */
@Entity('provider')
export default class Provider extends BaseEntity {
    @Column({ name: 'name', nullable: true })
    @Index()
    name: string;

    @Column({ name: 'address', nullable: true })
    @Index()
    address: string;

    @Column({ name: 'code', nullable: true })
    @Index()
    code: string;

    @Column({ name: 'phone', nullable: true })
    @Index()
    phone: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
